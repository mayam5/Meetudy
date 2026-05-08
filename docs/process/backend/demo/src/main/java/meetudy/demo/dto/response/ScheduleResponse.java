package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.UserSchedule;

import java.time.LocalTime;

@Getter
public class ScheduleResponse {

    private final Long userScheduleId;
    private final String dayOfWeek;
    private final Long timeSlotId;
    private final String slotName;
    private final LocalTime startTime;
    private final LocalTime endTime;

    private ScheduleResponse(UserSchedule schedule) {
        this.userScheduleId = schedule.getUserScheduleId();
        this.dayOfWeek      = schedule.getDayOfWeek();
        this.timeSlotId     = schedule.getTimeSlot().getTimeSlotId();
        this.slotName       = schedule.getTimeSlot().getSlotName();
        this.startTime      = schedule.getTimeSlot().getStartTime();
        this.endTime        = schedule.getTimeSlot().getEndTime();
    }

    public static ScheduleResponse from(UserSchedule schedule) {
        return new ScheduleResponse(schedule);
    }
}
