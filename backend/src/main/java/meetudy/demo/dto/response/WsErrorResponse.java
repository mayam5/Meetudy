package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.exception.ErrorCode;

@Getter
public class WsErrorResponse {

    private final int status;
    private final String message;

    private WsErrorResponse(int status, String message) {
        this.status = status;
        this.message = message;
    }

    public static WsErrorResponse of(ErrorCode errorCode) {
        return new WsErrorResponse(errorCode.getStatus().value(), errorCode.getMessage());
    }

    public static WsErrorResponse unexpected() {
        return new WsErrorResponse(500, "서버 오류가 발생했습니다.");
    }
}
