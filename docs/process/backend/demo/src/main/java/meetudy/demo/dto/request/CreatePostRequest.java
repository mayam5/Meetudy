package meetudy.demo.dto.request;

import jakarta.validation.constraints.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@NoArgsConstructor
public class CreatePostRequest {

    @NotBlank(message = "제목은 필수입니다.")
    @Size(max = 200, message = "제목은 200자 이하여야 합니다.")
    private String postTitle;

    @NotBlank(message = "내용은 필수입니다.")
    private String postContent;

    @NotNull(message = "모임 시작 시간은 필수입니다.")
    private LocalDateTime meetingTime;

    @NotNull(message = "모임 종료 시간은 필수입니다.")
    private LocalDateTime endTime;

    @NotNull(message = "최대 인원은 필수입니다.")
    @Min(value = 2, message = "최대 인원은 2명 이상이어야 합니다.")
    private Integer maxMembers;

    @NotNull(message = "카테고리는 필수입니다.")
    private Long categoryId;

    /** 선택: 오프라인 스터디 장소 ID */
    private Long placeId;
}
