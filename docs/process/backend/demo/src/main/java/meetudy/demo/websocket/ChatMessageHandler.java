package meetudy.demo.websocket;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.ChatMessageRequest;
import meetudy.demo.dto.response.ChatMessageResponse;
import meetudy.demo.security.JwtProvider;
import meetudy.demo.service.ChatService;
import org.springframework.messaging.handler.annotation.Header;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

@Controller
@RequiredArgsConstructor
public class ChatMessageHandler {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtProvider jwtProvider;

    /**
     * 클라이언트가 /app/chat.send 로 메시지 전송
     * → DB 저장 후 /topic/chat.{roomId} 구독자에게 브로드캐스트
     * 헤더에 Authorization: Bearer {token} 포함 필요
     */
    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageRequest request,
                            @Header("Authorization") String authHeader) {

        // JWT에서 userId 추출
        String token = authHeader.replace("Bearer ", "");
        Long senderId = jwtProvider.getUserId(token);

        // DB에 저장
        ChatMessageResponse response = chatService.saveMessage(senderId, request);

        // 해당 채팅방 구독자 전체에게 브로드캐스트
        messagingTemplate.convertAndSend(
                "/topic/chat." + request.getChatRoomId(), response);
    }
}
