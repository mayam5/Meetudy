package meetudy.demo.repository;

import meetudy.demo.entity.ChatRoomMessage;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Slice;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatRoomMessageRepository extends JpaRepository<ChatRoomMessage, Long> {

    // 최신순 페이징 조회
    Slice<ChatRoomMessage> findByChatRoom_ChatRoomIdOrderBySentAtDesc(Long chatRoomId, Pageable pageable);

    // 마지막 메시지 ID 조회 (읽음 처리용)
    ChatRoomMessage findTopByChatRoom_ChatRoomIdOrderBySentAtDesc(Long chatRoomId);
}
