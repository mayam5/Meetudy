package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.ChatMessageRequest;
import meetudy.demo.dto.response.ChatMessageResponse;
import meetudy.demo.dto.response.ChatRoomResponse;
import meetudy.demo.entity.ChatRoom;
import meetudy.demo.entity.ChatRoomMember;
import meetudy.demo.entity.ChatRoomMessage;
import meetudy.demo.entity.User;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.ChatRoomMemberRepository;
import meetudy.demo.repository.ChatRoomMessageRepository;
import meetudy.demo.repository.ChatRoomRepository;
import meetudy.demo.repository.UserRepository;

import java.util.List;
import java.util.stream.Collectors;

import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Slice;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatRoomMemberRepository chatRoomMemberRepository;
    private final ChatRoomMessageRepository chatRoomMessageRepository;
    private final UserRepository userRepository;

 //
//    /** CHAT-07: 채팅방 생성 (ApplicationService.accept() → PostService.createPost()에서 호출) */
//    @Transactional
//    public ChatRoom createRoom(StudyGroup studyGroup) {
//        return chatRoomRepository.save(ChatRoom.builder()
//                .studyGroup(studyGroup)
//                .roomStatus("ACTIVE")
//                .build());
//    }



    /** CHAT-08: 채팅방 정보 조회 */
    @Transactional(readOnly = true)
    public ChatRoomResponse getRoomInfo(Long userId, Long chatRoomId) {
        ChatRoom chatRoom = findRoomOrThrow(chatRoomId);
        validateMember(chatRoomId, userId);
        return ChatRoomResponse.from(chatRoom);
    }

    /** CHAT-09: 메시지 목록 조회 (페이징) */
    @Transactional(readOnly = true)
    public Slice<ChatMessageResponse> getMessages(Long userId, Long chatRoomId, int page, int size) {
        findRoomOrThrow(chatRoomId);
        validateMember(chatRoomId, userId);

        return chatRoomMessageRepository
                .findByChatRoom_ChatRoomIdOrderBySentAtDesc(
                        chatRoomId, PageRequest.of(page, size))
                .map(ChatMessageResponse::from);
    }

    /** CHAT-10: 읽음 처리 (last_read_message_id 갱신) */
    @Transactional
    public void markAsRead(Long userId, Long chatRoomId) {
        validateMember(chatRoomId, userId);

        ChatRoomMessage lastMessage = chatRoomMessageRepository
                .findTopByChatRoom_ChatRoomIdOrderBySentAtDesc(chatRoomId);

        if (lastMessage == null) return;

        ChatRoomMember member = chatRoomMemberRepository
                .findByChatRoom_ChatRoomIdAndUser_UserId(chatRoomId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.FORBIDDEN));

        member.updateLastReadMessage(lastMessage.getMessageId());
    }

    /** CHAT-15: WebSocket 메시지 저장 (ChatMessageHandler에서 호출) */
    @Transactional
    public ChatMessageResponse saveMessage(Long senderId, ChatMessageRequest request) {
        ChatRoom chatRoom = findRoomOrThrow(request.getChatRoomId());
        validateMember(request.getChatRoomId(), senderId);

        User sender = userRepository.findById(senderId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        ChatRoomMessage message = chatRoomMessageRepository.save(ChatRoomMessage.builder()
                .chatRoom(chatRoom)
                .sender(sender)
                .messageContent(request.getMessageContent())
                .messageType(request.getMessageType())
                .build());

        return ChatMessageResponse.from(message);
    }

    // ── private 헬퍼 ──────────────────────────────

    private ChatRoom findRoomOrThrow(Long chatRoomId) {
        return chatRoomRepository.findById(chatRoomId)
                .orElseThrow(() -> new CustomException(ErrorCode.CHAT_ROOM_NOT_FOUND));
    }

    private void validateMember(Long chatRoomId, Long userId) {
        chatRoomMemberRepository.findByChatRoom_ChatRoomIdAndUser_UserId(chatRoomId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.FORBIDDEN));
    }




        /** CHAT 추가: 내 채팅방 목록 조회 */
    @Transactional(readOnly = true)
    public List<ChatRoomResponse> getMyChatRooms(Long userId) {
        return chatRoomMemberRepository.findAllByUser_UserIdAndLeftAtIsNull(userId)
                .stream()
                .map(member -> ChatRoomResponse.from(member.getChatRoom()))
                .collect(Collectors.toList());
    }






}

