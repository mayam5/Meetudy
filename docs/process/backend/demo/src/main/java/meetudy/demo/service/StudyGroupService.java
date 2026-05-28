package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.response.StudyGroupMemberResponse;
import meetudy.demo.dto.response.StudyGroupResponse;
import meetudy.demo.entity.ChatRoom;
import meetudy.demo.entity.ChatRoomMember;
import meetudy.demo.entity.StudyGroup;
import meetudy.demo.entity.StudyGroupMember;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.ChatRoomMemberRepository;
import meetudy.demo.repository.ChatRoomRepository;
import meetudy.demo.repository.StudyGroupMemberRepository;
import meetudy.demo.repository.StudyGroupRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyGroupService {

    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupMemberRepository studyGroupMemberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;

    /** 내가 속한 스터디 그룹 목록 */
    @Transactional(readOnly = true)
    public List<StudyGroupResponse> getMyGroups(Long userId) {
        return studyGroupMemberRepository.findAllByUser_UserIdAndLeftAtIsNull(userId)
                .stream()
                .map(m -> StudyGroupResponse.from(m.getStudyGroup()))
                .collect(Collectors.toList());
    }

    /** 스터디 그룹 상세 조회 (멤버만) */
    @Transactional(readOnly = true)
    public StudyGroupResponse getGroupInfo(Long userId, Long studyGroupId) {
        StudyGroup group = findGroupOrThrow(studyGroupId);
        validateMember(studyGroupId, userId);
        return StudyGroupResponse.from(group);
    }

    /** 스터디 그룹 멤버 목록 (멤버만) */
    @Transactional(readOnly = true)
    public List<StudyGroupMemberResponse> getGroupMembers(Long userId, Long studyGroupId) {
        findGroupOrThrow(studyGroupId);
        validateMember(studyGroupId, userId);
        return studyGroupMemberRepository.findAllByStudyGroup_StudyGroupId(studyGroupId)
                .stream()
                .filter(m -> m.getLeftAt() == null)
                .map(StudyGroupMemberResponse::from)
                .collect(Collectors.toList());
    }

    /** 스터디 그룹 나가기 (StudyGroupMember + ChatRoomMember 동시 처리) */
    @Transactional
    public void leaveGroup(Long userId, Long studyGroupId) {
        StudyGroupMember groupMember = studyGroupMemberRepository
                .findByStudyGroup_StudyGroupIdAndUser_UserId(studyGroupId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.FORBIDDEN));

        if (groupMember.getLeftAt() != null) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        groupMember.leave();

        ChatRoom chatRoom = chatRoomRepository.findByStudyGroup_StudyGroupId(studyGroupId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));

        chatRoomMemberRepository
                .findByChatRoom_ChatRoomIdAndUser_UserId(chatRoom.getChatRoomId(), userId)
                .ifPresent(ChatRoomMember::leave);
    }

    private StudyGroup findGroupOrThrow(Long studyGroupId) {
        return studyGroupRepository.findById(studyGroupId)
                .orElseThrow(() -> new CustomException(ErrorCode.STUDY_GROUP_NOT_FOUND));
    }

    private void validateMember(Long studyGroupId, Long userId) {
        if (!studyGroupMemberRepository.existsByStudyGroup_StudyGroupIdAndUser_UserId(studyGroupId, userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }
    }
}
