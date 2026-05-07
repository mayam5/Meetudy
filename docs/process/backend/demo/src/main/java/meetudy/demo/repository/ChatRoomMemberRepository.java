package meetudy.demo.repository;

import meetudy.demo.entity.ChatRoomMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ChatRoomMemberRepository extends JpaRepository<ChatRoomMember, Long> {

    Optional<ChatRoomMember> findByChatRoom_ChatRoomIdAndUser_UserId(Long chatRoomId, Long userId);

    /** CHAT 추가: 내가 소속된 채팅방 목록 (탈퇴한 방 제외) */
    List<ChatRoomMember> findAllByUser_UserIdAndLeftAtIsNull(Long userId);


}
