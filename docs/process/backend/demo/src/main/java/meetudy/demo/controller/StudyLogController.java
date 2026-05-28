package meetudy.demo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.request.StudyLogRequest;
import meetudy.demo.dto.response.StudyLogResponse;
import meetudy.demo.service.StudyLogService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/study-logs")
@RequiredArgsConstructor
public class StudyLogController {

    private final StudyLogService studyLogService;

    /** LOG-05: 학습 로그 기록 POST /study-logs */
    @PostMapping
    public ResponseEntity<ApiResponse<StudyLogResponse>> addLog(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody StudyLogRequest request) {

        Long userId = Long.parseLong(userDetails.getUsername());
        StudyLogResponse response = studyLogService.addLog(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    /** LOG-06: 내 학습 로그 목록 GET /study-logs/me */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<StudyLogResponse>>> getMyLogs(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(studyLogService.getMyLogs(userId)));
    }

    /** 학습 로그 삭제 DELETE /study-logs/{studyLogId} */
    @DeleteMapping("/{studyLogId}")
    public ResponseEntity<ApiResponse<String>> deleteLog(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long studyLogId) {

        Long userId = Long.parseLong(userDetails.getUsername());
        studyLogService.deleteLog(userId, studyLogId);
        return ResponseEntity.ok(ApiResponse.ok("학습 로그가 삭제되었습니다."));
    }
}
