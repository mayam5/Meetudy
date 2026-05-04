package meetudy.demo.dto.request;

import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Getter
@NoArgsConstructor
public class UpdateProfileRequest {

    @Size(min = 2, max = 20, message = "닉네임은 2~20자 사이여야 합니다.")
    private String nickname;

    private String bio;

    private String gender;

    private LocalDate birthDate;

    private Boolean isAgePublic;

    /** 비밀번호 변경 - 둘 다 있을 때만 처리 */
    private String currentPassword;

    @Size(min = 8, message = "새 비밀번호는 8자 이상이어야 합니다.")
    private String newPassword;
}
