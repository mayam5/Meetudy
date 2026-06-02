package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.StudyApplication;

import java.time.LocalDateTime;

@Getter
public class ApplicationResponse {

    private final Long applicationId;
    private final Long postId;
    private final String postTitle;
    private final Long applicantId;
    private final String applicantNickname;
    private final String status;
    private final LocalDateTime createdAt;

    private ApplicationResponse(StudyApplication app) {
        this.applicationId     = app.getApplicationId();
        this.postId            = app.getPost().getPostId();
        this.postTitle         = app.getPost().getPostTitle();
        this.applicantId       = app.getApplicant().getUserId();
        this.applicantNickname = app.getApplicant().getNickname();
        this.status            = app.getStatus();
        this.createdAt         = app.getCreatedAt();
    }

    public static ApplicationResponse from(StudyApplication app) {
        return new ApplicationResponse(app);
    }
}
