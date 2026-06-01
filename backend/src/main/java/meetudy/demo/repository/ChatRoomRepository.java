package meetudy.demo.repository;

import meetudy.demo.entity.ChatRoom;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ChatRoomRepository extends JpaRepository<ChatRoom, Long> {

    Optional<ChatRoom> findByStudyGroup_StudyGroupId(Long studyGroupId);
}
