package meetudy.demo.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 인증
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT,       "이미 사용 중인 이메일입니다."),
    NICKNAME_ALREADY_EXISTS(HttpStatus.CONFLICT,    "이미 사용 중인 닉네임입니다."),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED,    "이메일 또는 비밀번호가 올바르지 않습니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED,           "로그인이 필요합니다."),

    // 유저
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,            "존재하지 않는 사용자입니다."),

    // 게시글
    POST_NOT_FOUND(HttpStatus.NOT_FOUND,            "존재하지 않는 게시글입니다."),
    POST_NOT_AUTHOR(HttpStatus.FORBIDDEN,           "게시글 작성자만 수행할 수 있습니다."),
    POST_ALREADY_CLOSED(HttpStatus.BAD_REQUEST,     "이미 마감된 게시글입니다."),

    // 신청
    ALREADY_APPLIED(HttpStatus.CONFLICT,            "이미 신청한 게시글입니다."),
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND,     "존재하지 않는 신청입니다."),

    // 카테고리
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND,            "존재하지 않는 카테고리입니다."),

    // 관심사
    INTEREST_ALREADY_EXISTS(HttpStatus.CONFLICT,        "이미 추가된 관심사입니다."),
    INTEREST_NOT_FOUND(HttpStatus.NOT_FOUND,            "존재하지 않는 관심사입니다."),

    // 공통
    FORBIDDEN(HttpStatus.FORBIDDEN,                 "접근 권한이 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String message;
}
