package meetudy.demo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.request.CreatePostRequest;
import meetudy.demo.dto.request.UpdatePostRequest;
import meetudy.demo.dto.response.PostResponse;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.service.PostService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/posts")
@RequiredArgsConstructor
public class PostController {

    private final PostService postService;

    /** POST-15: OPEN 게시글 목록 / POST-08: 카테고리 필터 / POST-09: 키워드 검색 */
    @GetMapping
    public ResponseEntity<ApiResponse<List<PostResponse>>> getPosts(
    @AuthenticationPrincipal UserDetails userDetails,    
        @RequestParam(required = false) Long categoryId,
            @RequestParam(required = false) String keyword) {
        Long userId = null;

            if (userDetails != null) {
                userId = Long.parseLong(userDetails.getUsername());
            }
            
                List<PostResponse> result;
                if (keyword != null && !keyword.isBlank()) {
                    result = postService.searchPosts(userId, keyword);
                } else if (categoryId != null) {
                    result = postService.getPostsByCategory(userId, categoryId);
                } else {
                    result = postService.getAllOpenPosts(userId);
                }

                return ResponseEntity.ok(ApiResponse.ok(result));
    }

    /** POST-16: 게시글 단건 조회 (비로그인 허용) */
    @GetMapping("/{postId}")
    public ResponseEntity<ApiResponse<PostResponse>> getPost(
            @PathVariable Long postId) {
        return ResponseEntity.ok(ApiResponse.ok(postService.getPostById(postId)));
    }

    /** POST-17: 내 게시글 목록 */
    @GetMapping("/me")
    public ResponseEntity<ApiResponse<List<PostResponse>>> getMyPosts(
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
        throw new CustomException(ErrorCode.UNAUTHORIZED);
        }
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(postService.getMyPosts(userId)));
    }

   
    /** POST-18: 게시글 작성 */
    @PostMapping
    public ResponseEntity<ApiResponse<PostResponse>> createPost(
            Authentication authentication,
            @Valid @RequestBody CreatePostRequest request) {

        System.out.println("===== PostController createPost =====");
        System.out.println("method parameter authentication = " + authentication);

        Authentication contextAuth = SecurityContextHolder.getContext().getAuthentication();
        System.out.println("SecurityContext authentication = " + contextAuth);

        if (contextAuth != null) {
            System.out.println("principal = " + contextAuth.getPrincipal());
            System.out.println("principal class = " + contextAuth.getPrincipal().getClass().getName());
            System.out.println("authorities = " + contextAuth.getAuthorities());
            System.out.println("isAuthenticated = " + contextAuth.isAuthenticated());
        }

        if (contextAuth == null || contextAuth.getPrincipal() == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(ApiResponse.fail("로그인이 필요합니다."));
        }

        UserDetails userDetails = (UserDetails) contextAuth.getPrincipal();

        Long userId = Long.parseLong(userDetails.getUsername());
        PostResponse response = postService.createPost(userId, request);

        return ResponseEntity.status(HttpStatus.CREATED).body(ApiResponse.ok(response));
    }

    /** POST-19: 게시글 수정 */
    @PatchMapping("/{postId}")
    public ResponseEntity<ApiResponse<PostResponse>> updatePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId,
            @Valid @RequestBody UpdatePostRequest request) {
        Long userId = Long.parseLong(userDetails.getUsername());
        return ResponseEntity.ok(ApiResponse.ok(postService.updatePost(userId, postId, request)));
    }

    /** POST-20: 모집 마감 */
    @PatchMapping("/{postId}/close")
    public ResponseEntity<ApiResponse<Void>> closePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        postService.closePost(userId, postId);
        return ResponseEntity.ok(ApiResponse.ok("모집이 마감되었습니다.", null));
    }

    /** POST-21: 게시글 삭제 */
    @DeleteMapping("/{postId}")
    public ResponseEntity<ApiResponse<Void>> deletePost(
            @AuthenticationPrincipal UserDetails userDetails,
            @PathVariable Long postId) {
        Long userId = Long.parseLong(userDetails.getUsername());
        postService.deletePost(userId, postId);
        return ResponseEntity.ok(ApiResponse.ok("게시글이 삭제되었습니다.", null));
    }
}
