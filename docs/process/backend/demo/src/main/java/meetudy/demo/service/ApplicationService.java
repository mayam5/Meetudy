package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.ApplicationRequest;
import meetudy.demo.dto.response.ApplicationResponse;
import meetudy.demo.service.NotificationService;
import meetudy.demo.entity.*;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ApplicationService {

    private final StudyApplicationRepository applicationRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;
    private final StudyGroupRepository studyGroupRepository;
    private final StudyGroupMemberRepository studyGroupMemberRepository;
    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final NotificationService notificationService;

    /** APP-05: 스터디 신청 */
    @Transactional
    public ApplicationResponse apply(Long applicantId, ApplicationRequest request) {
        Post post = postRepository.findById(request.getPostId())
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        // 본인 게시글 신청 불가
        if (post.isAuthor(applicantId)) {
            throw new CustomException(ErrorCode.SELF_APPLICATION_NOT_ALLOWED);
        }

        // 마감된 게시글 신청 불가
        if (!post.isOpen()) {
            throw new CustomException(ErrorCode.POST_ALREADY_CLOSED);
        }

        // 중복 신청 불가
        if (applicationRepository.existsByPost_PostIdAndApplicant_UserId(post.getPostId(), applicantId)) {
            throw new CustomException(ErrorCode.ALREADY_APPLIED);
        }

        User applicant = userRepository.findById(applicantId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        StudyApplication application = applicationRepository.save(StudyApplication.builder()
                .post(post)
                .applicant(applicant)
                .build());

        notificationService.createNotification(
                post.getUser().getUserId(),
                "apply",
                applicant.getNickname() + "님이 '" + post.getPostTitle() + "'에 참여 신청했습니다."
        );

        return ApplicationResponse.from(application);
    }

    /** APP-06: 신청 취소 (PENDING 상태만) */
    @Transactional
    public void cancel(Long applicantId, Long applicationId) {
        StudyApplication application = applicationRepository
                .findByApplicationIdAndApplicant_UserId(applicationId, applicantId)
                .orElseThrow(() -> new CustomException(ErrorCode.APPLICATION_NOT_FOUND));

        if (!application.isPending()) {
            throw new CustomException(ErrorCode.APPLICATION_CANCEL_NOT_ALLOWED);
        }

        applicationRepository.delete(application);
    }

    /** APP-07: 내 신청 목록 조회 */
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getMyApplications(Long applicantId) {
        return applicationRepository
                .findAllByApplicant_UserIdOrderByCreatedAtDesc(applicantId)
                .stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    /** APP-08: 게시글에 들어온 신청 목록 (작성자만) */
    @Transactional(readOnly = true)
    public List<ApplicationResponse> getApplicationsByPost(Long userId, Long postId) {
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        if (!post.isAuthor(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        return applicationRepository
                .findAllByPost_PostIdOrderByCreatedAtDesc(postId)
                .stream()
                .map(ApplicationResponse::from)
                .collect(Collectors.toList());
    }

    /**
     * APP-09: 신청 수락 (작성자만)
     * → Post.currentMembers++
     * → maxMembers 도달 시 Post.close()
     * → StudyGroupMember 추가 (신청자, MEMBER)
     * → ChatRoomMember 추가 (신청자)
     */
    @Transactional
    public ApplicationResponse accept(Long userId, Long applicationId) {
        StudyApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new CustomException(ErrorCode.APPLICATION_NOT_FOUND));

        Post post = application.getPost();
        if (!post.isAuthor(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        if (!application.isPending()) {
            throw new CustomException(ErrorCode.APPLICATION_CANCEL_NOT_ALLOWED);
        }

        // 1. 신청 상태 변경
        application.accept();

        // 2. 현재 인원 증가
        post.increaseCurrentMembers();

        // 3. 정원 초과 시 마감
        if (post.getCurrentMembers() >= post.getMaxMembers()) {
            post.close();
        }

        // 4. StudyGroup 조회 (Post 생성 시 이미 생성되어 있음)
        StudyGroup studyGroup = studyGroupRepository.findByPost_PostId(post.getPostId())
                .orElseThrow(() -> new CustomException(ErrorCode.INTERNAL_SERVER_ERROR));

        // 5. StudyGroupMember 추가
        studyGroupMemberRepository.save(StudyGroupMember.builder()
                .studyGroup(studyGroup)
                .user(application.getApplicant())
                .memberRole("MEMBER")
                .build());

        // 6. ChatRoom 조회 후 ChatRoomMember 추가
        ChatRoom chatRoom = chatRoomRepository.findByStudyGroup_StudyGroupId(studyGroup.getStudyGroupId())
                .orElseThrow(() -> new CustomException(ErrorCode.INTERNAL_SERVER_ERROR));

        chatRoomMemberRepository.save(ChatRoomMember.builder()
                .chatRoom(chatRoom)
                .user(application.getApplicant())
                .memberStatus("ACTIVE")
                .build());

        notificationService.createNotification(
                application.getApplicant().getUserId(),
                "accepted",
                "'" + post.getPostTitle() + "' 참여가 수락되었습니다."
        );

        return ApplicationResponse.from(application);
    }

    /** APP-10: 신청 거절 (작성자만) */
    @Transactional
    public ApplicationResponse reject(Long userId, Long applicationId) {
        StudyApplication application = applicationRepository.findById(applicationId)
                .orElseThrow(() -> new CustomException(ErrorCode.APPLICATION_NOT_FOUND));

        if (!application.getPost().isAuthor(userId)) {
            throw new CustomException(ErrorCode.FORBIDDEN);
        }

        if (!application.isPending()) {
            throw new CustomException(ErrorCode.APPLICATION_CANCEL_NOT_ALLOWED);
        }

        application.reject();

        notificationService.createNotification(
                application.getApplicant().getUserId(),
                "rejected",
                "'" + application.getPost().getPostTitle() + "' 참여가 거절되었습니다."
        );

        return ApplicationResponse.from(application);
    }
}
