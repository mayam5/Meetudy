package meetudy.demo.dto.request;

import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Getter
@NoArgsConstructor
public class ApplicationRequest {

    @NotNull(message = "게시글 ID는 필수입니다.")
    private Long postId;
}
