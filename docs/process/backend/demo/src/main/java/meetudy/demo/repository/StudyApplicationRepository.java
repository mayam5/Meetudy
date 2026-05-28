package meetudy.demo.repository;

import meetudy.demo.entity.StudyApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyApplicationRepository extends JpaRepository<StudyApplication, Long> {

    /** 중복 신청 체크 */
    boolean existsByPost_PostIdAndApplicant_UserId(Long postId, Long applicantId);

    /** 내 신청 목록 (최신순) */
    List<StudyApplication> findAllByApplicant_UserIdOrderByCreatedAtDesc(Long userId);

    /** 게시글에 들어온 신청 목록 (최신순) — 작성자 조회용 */
    List<StudyApplication> findAllByPost_PostIdOrderByCreatedAtDesc(Long postId);

    /** 단건 조회 (신청자 본인 확인용) */
    Optional<StudyApplication> findByApplicationIdAndApplicant_UserId(Long applicationId, Long userId);
}
