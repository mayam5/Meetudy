package meetudy.demo.controller;

import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.response.CategoryResponse;
import meetudy.demo.service.UserInterestService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/me/interests")
@RequiredArgsConstructor
public class UserInterestController {

    private final UserInterestService userInterestService;

    /** INT-06: 내 관심사 목록 조회 */
    @GetMapping
    public ResponseEntity<ApiResponse<List<CategoryResponse>>> getMyInterests(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(userInterestService.getMyInterests(userId)));
    }

    /** INT-07: 관심사 추가 */
    @PostMapping
    public ResponseEntity<ApiResponse<Void>> addInterest(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam Long categoryId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        userInterestService.addInterest(userId, categoryId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("관심사가 추가되었습니다.", null));
    }

    /** INT-08: 관심사 삭제 */
    @DeleteMapping("/{categoryId}")
    public ResponseEntity<ApiResponse<Void>> removeInterest(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long categoryId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        userInterestService.removeInterest(userId, categoryId);
        return ResponseEntity.ok(ApiResponse.ok("관심사가 삭제되었습니다.", null));
    }
}
