package meetudy.demo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.request.UpdateProfileRequest;
import meetudy.demo.dto.response.UserProfileResponse;
import meetudy.demo.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

@RestController
@RequestMapping("/users")
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    /** USER-07: 내 프로필 조회 */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> getProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        UserProfileResponse response = userService.getProfile(userId);
        return ResponseEntity.ok(ApiResponse.ok(response));
    }

    /** USER-08: 프로필 수정 */
    @PatchMapping("/me")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @Valid @RequestBody UpdateProfileRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        UserProfileResponse response = userService.updateProfile(userId, request);
        return ResponseEntity.ok(ApiResponse.ok("프로필이 수정되었습니다.", response));
    }

    /** USER-09: 프로필 이미지 수정 */
    @PatchMapping("/me/image")
    public ResponseEntity<ApiResponse<UserProfileResponse>> updateProfileImage(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam("image") MultipartFile image) {

        Long userId = Long.parseLong(userDetails.getUsername());

        // 실제 파일 저장 로직은 추후 구현 (S3 또는 로컬 저장)
        // 지금은 파일명을 이미지 URL로 임시 사용
        String imageUrl = "/uploads/" + image.getOriginalFilename();

        UserProfileResponse response = userService.updateProfileImage(userId, imageUrl);
        return ResponseEntity.ok(ApiResponse.ok("프로필 이미지가 수정되었습니다.", response));
    }

    /** USER-10: 회원 탈퇴 */
    @DeleteMapping("/me")
    public ResponseEntity<ApiResponse<Void>> withdraw(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        userService.withdraw(userId);
        return ResponseEntity.ok(ApiResponse.ok("회원 탈퇴가 완료되었습니다.", null));
    }
}
