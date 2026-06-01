package meetudy.demo.repository;

import meetudy.demo.entity.Region;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RegionRepository extends JpaRepository<Region, Long> {

    @Query("SELECT DISTINCT r.cityName FROM Region r")
    List<String> findDistinctCities();
}