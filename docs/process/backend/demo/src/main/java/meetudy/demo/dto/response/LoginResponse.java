package meetudy.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class LoginResponse {

    private String accessToken;
    private String tokenType;
    private Long userId;
    private String nickname;

    public static LoginResponse of(String token, Long userId, String nickname) {
        return new LoginResponse(token, "Bearer", userId, nickname);
    }
}
