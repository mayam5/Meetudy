package meetudy.demo.repository;

import meetudy.demo.entity.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {

    Optional<ChatRoomMember> findByChatRoom_ChatRoomIdAndUser_UserId(Long chatRoomId, Long userId);
}
