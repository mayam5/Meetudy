package meetudy.demo.controller;

import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.response.BlockedUserResponse;
import meetudy.demo.service.BlockService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/users/block")
@RequiredArgsConstructor
public class BlockController {

    private final BlockService blockService;

    /** BLK-06: 유저 차단 */
    @PostMapping("/{targetId}")
    public ResponseEntity<ApiResponse<Void>> blockUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long targetId) {
        Long blockerId = Long.parseLong(userDetails.getUsername());
        blockService.blockUser(blockerId, targetId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("차단되었습니다.", null));
    }

    /** BLK-07: 차단 해제 */
    @DeleteMapping("/{targetId}")
    public ResponseEntity<ApiResponse<Void>> unblockUser(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long targetId) {
        Long blockerId = Long.parseLong(userDetails.getUsername());
        blockService.unblockUser(blockerId, targetId);
        return ResponseEntity.ok(ApiResponse.ok("차단이 해제되었습니다.", null));
    }

    /** BLK-08: 차단 목록 조회 */
    @GetMapping
    public ResponseEntity<ApiResponse<List<BlockedUserResponse>>> getBlockList(
            @AuthenticationPrincipal UserDetails userDetails) {
        Long blockerId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(blockService.getBlockList(blockerId)));
    }
}
