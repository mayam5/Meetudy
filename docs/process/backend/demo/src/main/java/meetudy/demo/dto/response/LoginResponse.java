package meetudy.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String refreshToken;
    private String tokenType;
    private Long userId;
    private String nickname;

    public static LoginResponse of(String accessToken, String refreshToken,
                                   Long userId, String nickname) {
        return new LoginResponse(accessToken, refreshToken, "Bearer", userId, nickname);
    }
}
