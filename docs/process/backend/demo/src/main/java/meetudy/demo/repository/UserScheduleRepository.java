package meetudy.demo.repository;

import meetudy.demo.entity.UserSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserScheduleRepository extends JpaRepository<UserSchedule, Long> {

    List<UserSchedule> findAllByUser_UserId(Long userId);

    Optional<UserSchedule> findByUserScheduleIdAndUser_UserId(Long scheduleId, Long userId);

    boolean existsByUser_UserIdAndDayOfWeekAndTimeSlot_TimeSlotId(
            Long userId, String dayOfWeek, Long timeSlotId);
}
