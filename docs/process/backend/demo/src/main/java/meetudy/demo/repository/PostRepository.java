package meetudy.demo.repository;

import meetudy.demo.entity.Post;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface PostRepository extends JpaRepository<Post, Long> {

    /** POST-06: OPEN 상태 게시글 전체 조회 (최신순) */
    List<Post> findAllByPostStatusOrderByCreatedAtDesc(String postStatus);

    /** POST-08: 카테고리별 OPEN 게시글 조회 */
    List<Post> findAllByPostStatusAndCategory_CategoryIdOrderByCreatedAtDesc(
            String postStatus, Long categoryId);

    /** POST-09: 제목 또는 내용 키워드 검색 (OPEN 한정) */
    @Query("SELECT p FROM Post p WHERE p.postStatus = 'OPEN' " +
           "AND (p.postTitle LIKE %:keyword% OR p.postContent LIKE %:keyword%) " +
           "ORDER BY p.createdAt DESC")
    List<Post> searchByKeyword(@Param("keyword") String keyword);

    /** POST-10: 내 게시글 목록 (최신순) */
    List<Post> findAllByUser_UserIdOrderByCreatedAtDesc(Long userId);
}
