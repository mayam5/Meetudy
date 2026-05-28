package meetudy.demo.repository;

import meetudy.demo.entity.StudyGroupMember;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;


public interface StudyGroupMemberRepository extends JpaRepository<StudyGroupMember, Long> {
    /** 그룹 멤버 목록 */
    List<StudyGroupMember> findAllByStudyGroup_StudyGroupId(Long studyGroupId);
    /** 멤버 단건 조회 */
    Optional<StudyGroupMember> findByStudyGroup_StudyGroupIdAndUser_UserId(Long studyGroupId, Long userId);
    /** 멤버 존재 여부 */
    boolean existsByStudyGroup_StudyGroupIdAndUser_UserId(Long studyGroupId, Long userId);

    /** 내가 속한 활성 그룹 목록 */
    List<StudyGroupMember> findAllByUser_UserIdAndLeftAtIsNull(Long userId);
}
