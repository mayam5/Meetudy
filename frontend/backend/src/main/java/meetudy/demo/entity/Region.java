package meetudy.demo.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "Regions",
       uniqueConstraints = @UniqueConstraint(columnNames = {"city_name", "gu_name", "dong_name"}))
@Getter
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
@Builder
public class Region {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "region_id")
    private Long regionId;

    @Column(name = "city_name", nullable = false, length = 50)
    private String cityName;

    @Column(name = "gu_name", nullable = false, length = 50)
    private String guName;

    @Column(name = "dong_name", nullable = false, length = 50)
    private String dongName;
}
