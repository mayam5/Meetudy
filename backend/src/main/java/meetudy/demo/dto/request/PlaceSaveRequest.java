package meetudy.demo.dto.request;

import jakarta.validation.constraints.NotBlank;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Getter
@NoArgsConstructor
public class PlaceSaveRequest {

    @NotBlank
    private String name;

    @NotBlank
    private String address;

    private BigDecimal latitude;
    private BigDecimal longitude;
}
