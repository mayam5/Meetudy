package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.ChatRoomMessage;

import java.time.LocalDateTime;

@Getter
public class ChatMessageResponse {

    private final Long messageId;
    private final Long chatRoomId;
    private final Long senderId;
    private final String senderNickname;
    private final String messageContent;
    private final String messageType;
    private final LocalDateTime sentAt;

    private ChatMessageResponse(Long messageId, Long chatRoomId, Long senderId,
                                 String senderNickname, String messageContent,
                                 String messageType, LocalDateTime sentAt) {
        this.messageId = messageId;
        this.chatRoomId = chatRoomId;
        this.senderId = senderId;
        this.senderNickname = senderNickname;
        this.messageContent = messageContent;
        this.messageType = messageType;
        this.sentAt = sentAt;
    }

    public static ChatMessageResponse from(ChatRoomMessage message) {
        return new ChatMessageResponse(
                message.getMessageId(),
                message.getChatRoom().getChatRoomId(),
                message.getSender().getUserId(),
                message.getSender().getNickname(),
                message.getMessageContent(),
                message.getMessageType(),
                message.getSentAt()
        );
    }
}
