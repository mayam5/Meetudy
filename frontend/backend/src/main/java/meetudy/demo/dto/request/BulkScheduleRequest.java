package meetudy.demo.dto.request;

import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class BulkScheduleRequest {

    @NotNull
    @Valid
    private List<ScheduleRequest> schedules;
}
