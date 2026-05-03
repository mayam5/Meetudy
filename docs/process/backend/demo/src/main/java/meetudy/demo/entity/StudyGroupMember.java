package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Study_Group_Members",
       uniqueConstraints = @UniqueConstraint(columnNames = {"study_group_id", "user_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class StudyGroupMember {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_group_member_id")
    private Long studyGroupMemberId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "study_group_id", nullable = false)
    private StudyGroup studyGroup;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "member_role", nullable = false, length = 20)
    @Builder.Default
    private String memberRole = "MEMBER";

    @Column(name = "member_status", length = 20)
    private String memberStatus;

    @Column(name = "joined_at", nullable = false, updatable = false)
    private LocalDateTime joinedAt;

    @Column(name = "left_at")
    private LocalDateTime leftAt;

    @PrePersist
    protected void onCreate() {
        this.joinedAt = LocalDateTime.now();
    }

    // ── 도메인 메서드 ──────────────────────────────

    public void leave() {
        this.leftAt = LocalDateTime.now();
        this.memberStatus = "INACTIVE";
    }

    public void kick() {
        this.leftAt = LocalDateTime.now();
        this.memberStatus = "KICKED";
    }

    public boolean isHost() {
        return "HOST".equals(this.memberRole);
    }
}
