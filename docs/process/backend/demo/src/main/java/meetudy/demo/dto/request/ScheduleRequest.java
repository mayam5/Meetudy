package meetudy.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ScheduleRequest {

    @NotBlank(message = "요일은 필수입니다.")
    private String dayOfWeek;   // "MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"

    @NotNull(message = "타임슬롯 ID는 필수입니다.")
    private Long timeSlotId;
}
