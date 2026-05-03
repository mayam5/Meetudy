package meetudy.demo.repository;

import meetudy.demo.entity.UserInterest;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserInterestRepository extends JpaRepository<UserInterest, Long> {

    List<UserInterest> findAllByUser_UserId(Long userId);

    Optional<UserInterest> findByUser_UserIdAndCategory_CategoryId(Long userId, Long categoryId);

    boolean existsByUser_UserIdAndCategory_CategoryId(Long userId, Long categoryId);
}
