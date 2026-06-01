package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.StudyLog;

import java.time.LocalDate;

@Getter
public class StudyLogResponse {

    private final Long studyLogId;
    private final LocalDate studyDate;
    private final Integer durationMinutes;

    private StudyLogResponse(StudyLog log) {
        this.studyLogId      = log.getStudyLogId();
        this.studyDate       = log.getStudyDate();
        this.durationMinutes = log.getDurationMinutes();
    }

    public static StudyLogResponse from(StudyLog log) {
        return new StudyLogResponse(log);
    }
}
