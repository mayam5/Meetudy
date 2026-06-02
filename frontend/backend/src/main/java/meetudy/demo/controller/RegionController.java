package meetudy.demo.controller;

import lombok.RequiredArgsConstructor;
import meetudy.demo.service.RegionService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/regions")
@RequiredArgsConstructor
public class RegionController {

    private final RegionService regionService;

    @GetMapping("/cities")
    public ResponseEntity<?> getCities() {
        return ResponseEntity.ok(regionService.getCities());
    }
}