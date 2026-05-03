package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Posts")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Post {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_id")
    private Long postId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;

    @Column(name = "post_title", nullable = false, length = 200)
    private String postTitle;

    @Column(name = "post_content", nullable = false, columnDefinition = "TEXT")
    private String postContent;

    @Column(name = "meeting_time")
    private LocalDateTime meetingTime;

    @Column(name = "max_members", nullable = false)
    private Integer maxMembers;

    @Column(name = "current_members", nullable = false)
    @Builder.Default
    private Integer currentMembers = 1;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "place_id")
    private Place place;

    @Column(name = "place_price")
    private Integer placePrice;

    @Column(name = "post_status", nullable = false, length = 20)
    @Builder.Default
    private String postStatus = "OPEN";

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    // ── 도메인 메서드 ──────────────────────────────

    public void update(String postTitle, String postContent, LocalDateTime meetingTime,
                       Integer maxMembers, Integer placePrice) {
        if (postTitle != null)   this.postTitle   = postTitle;
        if (postContent != null) this.postContent = postContent;
        if (meetingTime != null) this.meetingTime = meetingTime;
        if (maxMembers != null)  this.maxMembers  = maxMembers;
        if (placePrice != null)  this.placePrice  = placePrice;
    }

    public void close() {
        this.postStatus = "CLOSED";
    }

    public void increaseCurrentMembers() {
        this.currentMembers++;
    }

    public boolean isOpen() {
        return "OPEN".equals(this.postStatus);
    }

    public boolean isAuthor(Long userId) {
        return this.user.getUserId().equals(userId);
    }
}
