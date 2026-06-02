package meetudy.demo.exception;

import meetudy.demo.common.ApiResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.*;

import java.util.stream.Collectors;

@RestControllerAdvice
public class GlobalExceptionHandler {

    /** CustomException 처리 */
    @ExceptionHandler(CustomException.class)
    public ResponseEntity<ApiResponse<Void>> handleCustomException(CustomException e) {
        ErrorCode code = e.getErrorCode();
        return ResponseEntity
                .status(code.getStatus())
                .body(ApiResponse.fail(code.getMessage()));
    }

    /** @Valid 검증 실패 처리 */
    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<ApiResponse<Void>> handleValidationException(
            MethodArgumentNotValidException e) {
        String message = e.getBindingResult().getFieldErrors().stream()
                .map(FieldError::getDefaultMessage)
                .collect(Collectors.joining(", "));
        return ResponseEntity
                .badRequest()
                .body(ApiResponse.fail(message));
    }

    /** 그 외 예외 처리 */
    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiResponse<Void>> handleException(Exception e) {
       e.printStackTrace();
        return ResponseEntity
                .internalServerError()
                .body(ApiResponse.fail("서버 오류가 발생했습니다."));
    }
}
