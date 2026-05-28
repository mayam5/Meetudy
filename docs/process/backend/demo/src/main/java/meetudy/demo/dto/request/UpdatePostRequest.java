package meetudy.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class UpdatePostRequest {

    @Size(max = 200, message = "제목은 200자 이하여야 합니다.")
    private String postTitle;

    private String postContent;

    private LocalDateTime meetingTime;

    private LocalDateTime endTime;

    @Min(value = 2, message = "최대 인원은 2명 이상이어야 합니다.")
    private Integer maxMembers;

    private Long categoryId;
}
