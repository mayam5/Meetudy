package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.repository.RegionRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class RegionService {

    private final RegionRepository regionRepository;

    public List<String> getCities() {
        return regionRepository.findDistinctCities();
    }
}