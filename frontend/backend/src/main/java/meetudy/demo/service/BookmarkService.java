package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.response.PostResponse;
import meetudy.demo.entity.Post;
import meetudy.demo.entity.PostBookmark;
import meetudy.demo.entity.User;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.PostBookmarkRepository;
import meetudy.demo.repository.PostRepository;
import meetudy.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class BookmarkService {

    private final PostBookmarkRepository bookmarkRepository;
    private final PostRepository postRepository;
    private final UserRepository userRepository;

    /** BM-03: 북마크 추가 (중복 방지) */
    @Transactional
    public void addBookmark(Long userId, Long postId) {
        if (bookmarkRepository.existsByUser_UserIdAndPost_PostId(userId, postId)) {
            throw new CustomException(ErrorCode.BOOKMARK_ALREADY_EXISTS);
        }

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        Post post = postRepository.findById(postId)
                .orElseThrow(() -> new CustomException(ErrorCode.POST_NOT_FOUND));

        bookmarkRepository.save(PostBookmark.builder()
                .user(user)
                .post(post)
                .build());
    }

    /** BM-04: 북마크 취소 */
    @Transactional
    public void removeBookmark(Long userId, Long postId) {
        PostBookmark bookmark = bookmarkRepository
                .findByUser_UserIdAndPost_PostId(userId, postId)
                .orElseThrow(() -> new CustomException(ErrorCode.BOOKMARK_NOT_FOUND));

        bookmarkRepository.delete(bookmark);
    }

    /** BM-05: 내 북마크 목록 조회 */
    @Transactional(readOnly = true)
    public List<PostResponse> getMyBookmarks(Long userId) {
        return bookmarkRepository.findAllByUser_UserIdOrderByCreatedAtDesc(userId)
                .stream()
                .map(bookmark -> PostResponse.from(bookmark.getPost(), true))
                .collect(Collectors.toList());
    }
}
