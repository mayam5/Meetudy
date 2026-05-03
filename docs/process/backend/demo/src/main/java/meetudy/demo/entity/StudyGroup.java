package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Study_Groups")
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class StudyGroup {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "study_group_id")
    private Long studyGroupId;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false, unique = true)
    private Post post;

    @Column(name = "group_name", nullable = false, length = 200)
    private String groupName;
}
