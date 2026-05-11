package meetudy.demo.repository;

import meetudy.demo.entity.StudyLog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StudyLogRepository extends JpaRepository<StudyLog, Long> {

    /** LOG-04: 내 학습 로그 전체 조회 (날짜 최신순) */
    List<StudyLog> findAllByUser_UserIdOrderByStudyDateDesc(Long userId);

    /** 삭제 권한 확인용 */
    Optional<StudyLog> findByStudyLogIdAndUser_UserId(Long studyLogId, Long userId);
}
