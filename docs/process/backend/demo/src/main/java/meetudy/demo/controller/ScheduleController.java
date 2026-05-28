package meetudy.demo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.request.BulkScheduleRequest;
import meetudy.demo.dto.request.ScheduleRequest;
import meetudy.demo.dto.response.ScheduleResponse;
import meetudy.demo.service.ScheduleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/schedules")
@RequiredArgsConstructor
public class ScheduleController {

    private final ScheduleService scheduleService;

    /** SCH-Bulk: 스케줄 전체 교체 */
    @PutMapping
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> replaceSchedules(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody BulkScheduleRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("스케줄이 저장되었습니다.",
                scheduleService.replaceSchedules(userId, request)));
    }

    /** SCH-07: 내 스케줄 목록 조회 */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<ScheduleResponse>>> getMySchedules(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(scheduleService.getMySchedules(userId)));
    }

    /** SCH-08: 스케줄 추가 */
    @PostMapping
    public ResponseEntity<ApiResponse<ScheduleResponse>> addSchedule(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ScheduleRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("스케줄이 추가되었습니다.", scheduleService.addSchedule(userId, request)));
    }

    /** SCH-09: 스케줄 수정 */
    @PatchMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<ScheduleResponse>> updateSchedule(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long scheduleId,
            @Valid @RequestBody ScheduleRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("스케줄이 수정되었습니다.",
                scheduleService.updateSchedule(userId, scheduleId, request)));
    }

    /** SCH-10: 스케줄 삭제 */
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<ApiResponse<Void>> deleteSchedule(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long scheduleId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        scheduleService.deleteSchedule(userId, scheduleId);
        return ResponseEntity.ok(ApiResponse.ok("스케줄이 삭제되었습니다.", null));
    }
}