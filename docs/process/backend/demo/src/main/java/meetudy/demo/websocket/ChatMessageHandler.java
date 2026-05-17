package meetudy.demo.websocket;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.ChatMessageRequest;
import meetudy.demo.dto.response.ChatMessageResponse;
import meetudy.demo.security.JwtProvider;
import meetudy.demo.service.ChatService;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Controller;

import java.security.Principal;
import java.util.List;

@Controller
@RequiredArgsConstructor
public class ChatMessageHandler {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final JwtProvider jwtProvider;

    /**
     * 클라이언트가 /app/chat.send 로 메시지 전송
     * → DB 저장 후 차단하지 않은 활성 멤버에게만 개별 브로드캐스트
     * STOMP CONNECT 시 Authorization: Bearer {token} 헤더 필요
     * 구독 경로: /user/queue/chat.{roomId}
     */
    @MessageMapping("/chat.send")
    public void sendMessage(ChatMessageRequest request, Principal principal) {
        Long senderId = Long.parseLong(principal.getName());

        ChatMessageResponse response = chatService.saveMessage(senderId, request);

        List<Long> recipients = chatService.getRecipientsForMessage(
                request.getChatRoomId(), senderId);

        for (Long recipientId : recipients) {
            messagingTemplate.convertAndSendToUser(
                    String.valueOf(recipientId),
                    "/queue/chat." + request.getChatRoomId(),
                    response);
        }
    }
}
