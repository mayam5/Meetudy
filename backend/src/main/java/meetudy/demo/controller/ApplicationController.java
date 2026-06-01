package meetudy.demo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.request.ApplicationRequest;
import meetudy.demo.dto.response.ApplicationResponse;
import meetudy.demo.service.ApplicationService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class ApplicationController {

    private final ApplicationService applicationService;

    /** APP-11: 스터디 신청 */
    @PostMapping("/applications")
    public ResponseEntity<ApiResponse<ApplicationResponse>> apply(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody ApplicationRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        ApplicationResponse response = applicationService.apply(userId, request);
        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    /** APP-12: 신청 취소 */
    @DeleteMapping("/applications/{applicationId}")
    public ResponseEntity<ApiResponse<Void>> cancel(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long applicationId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        applicationService.cancel(userId, applicationId);
        return ResponseEntity.ok(ApiResponse.ok("신청이 취소되었습니다.", null));
    }

    /** APP-13: 내 신청 목록 */
    @GetMapping("/applications/me")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getMyApplications(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getMyApplications(userId)));
    }

    /** APP-14: 게시글에 들어온 신청 목록 (작성자만) */
    @GetMapping("/posts/{postId}/applications")
    public ResponseEntity<ApiResponse<List<ApplicationResponse>>> getApplicationsByPost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(applicationService.getApplicationsByPost(userId, postId)));
    }

    /** APP-15: 신청 수락 */
    @PatchMapping("/applications/{applicationId}/accept")
    public ResponseEntity<ApiResponse<ApplicationResponse>> accept(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long applicationId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("신청이 수락되었습니다.", applicationService.accept(userId, applicationId)));
    }

    /** APP-16: 신청 거절 */
    @PatchMapping("/applications/{applicationId}/reject")
    public ResponseEntity<ApiResponse<ApplicationResponse>> reject(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long applicationId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok("신청이 거절되었습니다.", applicationService.reject(userId, applicationId)));
    }
}
