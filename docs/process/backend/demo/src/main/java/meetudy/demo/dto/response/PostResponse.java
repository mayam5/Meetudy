package meetudy.demo.dto.response;

import lombok.Getter;
import meetudy.demo.entity.Post;

import java.time.LocalDateTime;

@Getter
public class PostResponse {

    private final Long postId;
    private final Long userId;
    private final String nickname;
    private final String postTitle;
    private final String postContent;
    private final LocalDateTime meetingTime;
    private final LocalDateTime endTime;
    private final Integer maxMembers;
    private final Integer currentMembers;
    private final Long placeId;
    private final String placeName;
    private final Long categoryId;
    private final String categoryName;
    private final String postStatus;
    private final LocalDateTime createdAt;
    private final LocalDateTime updatedAt;

    private PostResponse(Post post) {
        this.postId         = post.getPostId();
        this.userId         = post.getUser().getUserId();
        this.nickname       = post.getUser().getNickname();
        this.postTitle      = post.getPostTitle();
        this.postContent    = post.getPostContent();
        this.meetingTime    = post.getMeetingTime();
        this.endTime        = post.getEndTime();
        this.maxMembers     = post.getMaxMembers();
        this.currentMembers = post.getCurrentMembers();
        this.placeId        = post.getPlace() != null ? post.getPlace().getPlaceId() : null;
        this.placeName      = post.getPlace() != null ? post.getPlace().getName()    : null;
        this.categoryId     = post.getCategory() != null ? post.getCategory().getCategoryId() : null;
        this.categoryName   = post.getCategory() != null ? post.getCategory().getCategoryName() : null;
        this.postStatus     = post.getPostStatus();
        this.createdAt      = post.getCreatedAt();
        this.updatedAt      = post.getUpdatedAt();
    }

    public static PostResponse from(Post post) {
        return new PostResponse(post);
    }
}
