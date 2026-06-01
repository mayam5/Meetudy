package meetudy.demo.repository;

import meetudy.demo.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface NotificationRepository extends JpaRepository<Notification, Long> {
    List<Notification> findAllByUser_UserIdOrderByCreatedAtDesc(Long userId);
}
