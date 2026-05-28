package meetudy.demo.dto.request;

import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class StudyLogRequest {

    @NotNull(message = "학습 날짜는 필수입니다.")
    private LocalDate studyDate;

    @NotNull(message = "학습 시간은 필수입니다.")
    @Min(value = 1, message = "학습 시간은 1분 이상이어야 합니다.")
    private Integer durationMinutes;
}
