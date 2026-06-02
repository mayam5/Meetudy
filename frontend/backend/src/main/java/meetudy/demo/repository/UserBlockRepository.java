package meetudy.demo.repository;

import meetudy.demo.entity.UserBlock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserBlockRepository extends JpaRepository<UserBlock, Long> {

    boolean existsByBlocker_UserIdAndBlocked_UserId(Long blockerId, Long blockedId);

    Optional<UserBlock> findByBlocker_UserIdAndBlocked_UserId(Long blockerId, Long blockedId);

    List<UserBlock> findAllByBlocker_UserId(Long blockerId);
}
