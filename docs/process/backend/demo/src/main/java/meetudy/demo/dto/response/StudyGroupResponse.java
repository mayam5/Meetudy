package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.StudyGroup;

import java.time.LocalDateTime;

@Getter
public class StudyGroupResponse {

    private final Long studyGroupId;
    private final Long postId;
    private final String groupName;
    private final boolean bookmarked;
    private final LocalDateTime createdAt;

    private StudyGroupResponse(StudyGroup group, boolean bookmarked) {
        this.studyGroupId = group.getStudyGroupId();
        this.postId       = group.getPost().getPostId();
        this.groupName    = group.getGroupName();
        this.bookmarked = bookmarked;
        this.createdAt    = group.getCreatedAt();
    }

    public static StudyGroupResponse from (
            StudyGroup group,
            boolean bookmarked
            ) {
        return new StudyGroupResponse(group, bookmarked);

    }
}
