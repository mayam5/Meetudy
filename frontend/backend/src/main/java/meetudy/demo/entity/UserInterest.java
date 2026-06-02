package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "User_Interests",
       uniqueConstraints = @UniqueConstraint(columnNames = {"user_id", "category_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class UserInterest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_interest_id")
    private Long userInterestId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private Category category;
}
