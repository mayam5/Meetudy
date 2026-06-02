package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.ChatRoom;

import java.time.LocalDateTime;

@Getter
public class ChatRoomResponse {

    private final Long chatRoomId;
    private final Long studyGroupId;
    private final String groupName;
    private final String roomStatus;
    private final LocalDateTime createdAt;

    private ChatRoomResponse(Long chatRoomId, Long studyGroupId, String groupName,
                              String roomStatus, LocalDateTime createdAt) {
        this.chatRoomId = chatRoomId;
        this.studyGroupId = studyGroupId;
        this.groupName = groupName;
        this.roomStatus = roomStatus;
        this.createdAt = createdAt;
    }

    public static ChatRoomResponse from(ChatRoom chatRoom) {
        return new ChatRoomResponse(
                chatRoom.getChatRoomId(),
                chatRoom.getStudyGroup().getStudyGroupId(),
                chatRoom.getStudyGroup().getGroupName(),
                chatRoom.getRoomStatus(),
                chatRoom.getCreatedAt()
        );
    }
}
