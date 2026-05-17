package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.StudyGroup;

import java.time.LocalDateTime;

@Getter
public class StudyGroupResponse {

    private final Long studyGroupId;
    private final Long postId;
    private final String groupName;
    private final LocalDateTime createdAt;

    private StudyGroupResponse(StudyGroup group) {
        this.studyGroupId = group.getStudyGroupId();
        this.postId       = group.getPost().getPostId();
        this.groupName    = group.getGroupName();
        this.createdAt    = group.getCreatedAt();
    }

    public static StudyGroupResponse from(StudyGroup group) {
        return new StudyGroupResponse(group);
    }
}
