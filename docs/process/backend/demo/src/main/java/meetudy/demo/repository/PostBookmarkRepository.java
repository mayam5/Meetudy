package meetudy.demo.repository;

import meetudy.demo.entity.PostBookmark;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface PostBookmarkRepository extends JpaRepository<PostBookmark, Long> {

    /** BM-03/04: 특정 유저-게시글 북마크 존재 여부 확인 */
    boolean existsByUser_UserIdAndPost_PostId(Long userId, Long postId);

    /** BM-04: 북마크 삭제용 조회 */
    Optional<PostBookmark> findByUser_UserIdAndPost_PostId(Long userId, Long postId);

    /** BM-05: 내 북마크 목록 (최신순) */
    @Query("SELECT b FROM PostBookmark b JOIN FETCH b.post p JOIN FETCH p.user " +
           "WHERE b.user.userId = :userId ORDER BY b.createdAt DESC")
    List<PostBookmark> findAllByUser_UserIdOrderByCreatedAtDesc(@Param("userId") Long userId);
}
