package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "Study_Applications",
       uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "applicant_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class StudyApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id")
    private Long applicationId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "applicant_id", nullable = false)
    private User applicant;

    // ★ 컬럼명 변경: application_status → status
    @Column(name = "status", nullable = false, length = 20)
    @Builder.Default
    private String status = "PENDING";

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

    public void accept()  { this.status = "ACCEPTED"; }
    public void reject()  { this.status = "REJECTED"; }
    public boolean isPending() { return "PENDING".equals(this.status); }
}
