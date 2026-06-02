package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PostHashtags",
       uniqueConstraints = @UniqueConstraint(columnNames = {"post_id", "hashtag_id"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class PostHashtag {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "post_hashtag_id")
    private Long postHashtagId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "post_id", nullable = false)
    private Post post;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "hashtag_id", nullable = false)
    private Hashtag hashtag;
}
