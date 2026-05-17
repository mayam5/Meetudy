package meetudy.demo.controller;

import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.response.ChatMessageResponse;
import meetudy.demo.dto.response.ChatRoomResponse;
import meetudy.demo.service.ChatService;

import java.util.List;

import org.springframework.data.domain.Slice;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/chats")
@RequiredArgsConstructor
public class ChatController {

    private final ChatService chatService;

    /** CHAT-11: 채팅방 정보 조회 */
    @GetMapping("/{roomId}")
    public ResponseEntity<ApiResponse<ChatRoomResponse>> getRoomInfo(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long roomId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(chatService.getRoomInfo(userId, roomId)));
    }

    /** CHAT-12: 메시지 목록 조회 (페이징) */
    @GetMapping("/{roomId}/messages")
    public ResponseEntity<ApiResponse<Slice<ChatMessageResponse>>> getMessages(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long roomId,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "30") int size) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(chatService.getMessages(userId, roomId, page, size)));
    }

    /** CHAT-13: 읽음 처리 */
    @PatchMapping("/{roomId}/read")
    public ResponseEntity<ApiResponse<Void>> markAsRead(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long roomId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        chatService.markAsRead(userId, roomId);
        return ResponseEntity.ok(ApiResponse.ok("읽음 처리 완료", null));
    }





    /** CHAT 추가: 내 채팅방 목록 조회 */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ChatRoomResponse>>> getMyChatRooms(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(chatService.getMyChatRooms(userId)));
    }

}
