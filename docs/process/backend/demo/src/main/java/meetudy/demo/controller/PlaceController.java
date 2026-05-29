package meetudy.demo.controller;

import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import meetudy.demo.common.ApiResponse;
import meetudy.demo.dto.request.PlaceSaveRequest;
import meetudy.demo.dto.response.PlaceResponse;
import meetudy.demo.dto.response.PlaceSearchResponse;
import meetudy.demo.service.PlaceService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/places")
@RequiredArgsConstructor
public class PlaceController {

    private final PlaceService placeService;

    /** 카카오 Local API로 장소 검색 */
    @GetMapping("/search")
    public ResponseEntity<ApiResponse<List<PlaceSearchResponse>>> searchPlaces(
            @RequestParam String query) {
        return ResponseEntity.ok(ApiResponse.ok(placeService.searchPlaces(query)));
    }

    /** 선택한 장소 DB 저장 */
    @PostMapping
    public ResponseEntity<ApiResponse<PlaceResponse>> savePlace(
            @Valid @RequestBody PlaceSaveRequest request) {
        return ResponseEntity.ok(ApiResponse.ok(placeService.savePlace(request)));
    }

    /** 저장된 장소 단건 조회 */
    @GetMapping("/{placeId}")
    public ResponseEntity<ApiResponse<PlaceResponse>> getPlace(
            @PathVariable Long placeId) {
        return ResponseEntity.ok(ApiResponse.ok(placeService.getPlaceById(placeId)));
    }
}
