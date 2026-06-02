package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "User_Schedules",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "day_of_week", "time_slot_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_schedule_id")
    private Long userScheduleId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "day_of_week", nullable = false, length = 10)
    private String dayOfWeek;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "time_slot_id", nullable = false)
    private TimeSlot timeSlot;
}
