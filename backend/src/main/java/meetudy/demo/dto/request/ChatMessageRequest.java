package meetudy.demo.dto.request;

import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ChatMessageRequest {

    private Long chatRoomId;
    private String messageContent;
    private String messageType = "TEXT";
}
