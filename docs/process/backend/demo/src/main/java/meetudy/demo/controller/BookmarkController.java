package meetudy.demo.controller;

import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.response.PostResponse;
import meetudy.demo.service.BookmarkService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
// import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class BookmarkController {

    private final BookmarkService bookmarkService;

    /** BM-06: 북마크 추가 POST /posts/{postId}/bookmark */
    @PostMapping("/{postId}/bookmark")
    public ResponseEntity<ApiResponse<String>> addBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {

        Long userId = Long.parseLong(userDetails.getUsername());
        bookmarkService.addBookmark(userId, postId);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("북마크가 추가되었습니다."));
    }

    /** BM-07: 북마크 취소 DELETE /posts/{postId}/bookmark */
    @DeleteMapping("/{postId}/bookmark")
    public ResponseEntity<ApiResponse<String>> removeBookmark(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {

        Long userId = Long.parseLong(userDetails.getUsername());
        bookmarkService.removeBookmark(userId, postId);
        return ResponseEntity.ok(ApiResponse.ok("북마크가 취소되었습니다."));
    }

    /** BM-08: 내 북마크 목록 GET /posts/bookmarks */
    @GetMapping("/bookmarks")
    public ResponseEntity<?> getMyBookmarks(
            @AuthenticationPrincipal UserDetails userDetails) {

        Long userId = Long.parseLong(userDetails.getUsername());

        return ResponseEntity.ok(
                bookmarkService.getMyBookmarks(userId));
    }
}
