package meetudy.demo.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;

@Getter
@RequiredArgsConstructor
public enum ErrorCode {

    // 인증
    EMAIL_ALREADY_EXISTS(HttpStatus.CONFLICT,           "이미 사용 중인 이메일입니다."),
    NICKNAME_ALREADY_EXISTS(HttpStatus.CONFLICT,        "이미 사용 중인 닉네임입니다."),
    INVALID_CREDENTIALS(HttpStatus.UNAUTHORIZED,        "이메일 또는 비밀번호가 올바르지 않습니다."),
    UNAUTHORIZED(HttpStatus.UNAUTHORIZED,               "로그인이 필요합니다."),
    INVALID_REFRESH_TOKEN(HttpStatus.UNAUTHORIZED,      "유효하지 않은 Refresh Token입니다."),

    // 유저
    USER_NOT_FOUND(HttpStatus.NOT_FOUND,            "존재하지 않는 사용자입니다."),

    // 게시글
    POST_NOT_FOUND(HttpStatus.NOT_FOUND,            "존재하지 않는 게시글입니다."),
    POST_NOT_AUTHOR(HttpStatus.FORBIDDEN,           "게시글 작성자만 수행할 수 있습니다."),
    POST_ALREADY_CLOSED(HttpStatus.BAD_REQUEST,     "이미 마감된 게시글입니다."),

    // 북마크
    BOOKMARK_ALREADY_EXISTS(HttpStatus.CONFLICT,    "이미 북마크한 게시글입니다."),
    BOOKMARK_NOT_FOUND(HttpStatus.NOT_FOUND,        "북마크 내역이 존재하지 않습니다."),

    // 학습 로그
    STUDY_LOG_NOT_FOUND(HttpStatus.NOT_FOUND,       "존재하지 않는 학습 로그입니다."),

    // 스터디 그룹
    STUDY_GROUP_NOT_FOUND(HttpStatus.NOT_FOUND,  "존재하지 않는 스터디 그룹입니다."),

    // 신청
    ALREADY_APPLIED(HttpStatus.CONFLICT,            "이미 신청한 게시글입니다."),
    APPLICATION_NOT_FOUND(HttpStatus.NOT_FOUND,     "존재하지 않는 신청입니다."),
    SELF_APPLICATION_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "본인 게시글에는 신청할 수 없습니다."),
    APPLICATION_CANCEL_NOT_ALLOWED(HttpStatus.BAD_REQUEST, "대기 중인 신청만 취소할 수 있습니다."),

    // 카테고리
    CATEGORY_NOT_FOUND(HttpStatus.NOT_FOUND,        "존재하지 않는 카테고리입니다."),

    // 관심사
    INTEREST_ALREADY_EXISTS(HttpStatus.CONFLICT,    "이미 추가된 관심사입니다."),
    INTEREST_NOT_FOUND(HttpStatus.NOT_FOUND,        "존재하지 않는 관심사입니다."),

    // 장소
    PLACE_NOT_FOUND(HttpStatus.NOT_FOUND,           "존재하지 않는 장소입니다."),

    // 차단
    SELF_BLOCK_NOT_ALLOWED(HttpStatus.BAD_REQUEST,       "자기 자신을 차단할 수 없습니다."),
    ALREADY_BLOCKED(HttpStatus.CONFLICT,                "이미 차단한 유저입니다."),
    BLOCK_NOT_FOUND(HttpStatus.NOT_FOUND,               "차단 내역이 존재하지 않습니다."),

    // 채팅
    CHAT_ROOM_NOT_FOUND(HttpStatus.NOT_FOUND,           "존재하지 않는 채팅방입니다."),

    // 스케줄
    SCHEDULE_ALREADY_EXISTS(HttpStatus.CONFLICT,    "이미 등록된 스케줄입니다."),
    SCHEDULE_NOT_FOUND(HttpStatus.NOT_FOUND,        "존재하지 않는 스케줄입니다."),
    TIMESLOT_NOT_FOUND(HttpStatus.NOT_FOUND,        "존재하지 않는 타임슬롯입니다."),

    // 공통
    FORBIDDEN(HttpStatus.FORBIDDEN,                 "접근 권한이 없습니다."),
    INTERNAL_SERVER_ERROR(HttpStatus.INTERNAL_SERVER_ERROR, "서버 오류가 발생했습니다.");

    private final HttpStatus status;
    private final String message;
}
