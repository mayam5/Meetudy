package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.StudyLogRequest;
import meetudy.demo.dto.response.StudyLogResponse;
import meetudy.demo.entity.StudyLog;
import meetudy.demo.entity.User;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.StudyLogRepository;
import meetudy.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class StudyLogService {

    private final StudyLogRepository studyLogRepository;
    private final UserRepository userRepository;

    /** LOG-03: 학습 로그 기록 */
    @Transactional
    public StudyLogResponse addLog(Long userId, StudyLogRequest request) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));

        StudyLog log = studyLogRepository.save(StudyLog.builder()
                .user(user)
                .studyDate(request.getStudyDate())
                .durationMinutes(request.getDurationMinutes())
                .build());

        return StudyLogResponse.from(log);
    }

    /** LOG-04: 내 학습 로그 목록 조회 */
    @Transactional(readOnly = true)
    public List<StudyLogResponse> getMyLogs(Long userId) {
        return studyLogRepository.findAllByUser_UserIdOrderByStudyDateDesc(userId)
                .stream()
                .map(StudyLogResponse::from)
                .collect(Collectors.toList());
    }

    /** LOG-05: 학습 로그 삭제 (본인 것만) */
    @Transactional
    public void deleteLog(Long userId, Long studyLogId) {
        StudyLog log = studyLogRepository
                .findByStudyLogIdAndUser_UserId(studyLogId, userId)
                .orElseThrow(() -> new CustomException(ErrorCode.STUDY_LOG_NOT_FOUND));

        studyLogRepository.delete(log);
    }
}
