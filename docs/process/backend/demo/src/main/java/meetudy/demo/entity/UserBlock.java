package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "UserBlocks",
       uniqueConstraints = @UniqueConstraint(columnNames = {"blocker_id", "blocked_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "block_id")
    private Long blockId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocker_id", nullable = false)
    private User blocker;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "blocked_id", nullable = false)
    private User blocked;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}