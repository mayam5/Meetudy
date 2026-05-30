package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.PlaceSaveRequest;
import meetudy.demo.dto.response.KakaoPlaceSearchResponse;
import meetudy.demo.dto.response.PlaceResponse;
import meetudy.demo.dto.response.PlaceSearchResponse;
import meetudy.demo.entity.Place;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.PlaceRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.util.Collections;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class PlaceService {

    private final RestTemplate restTemplate;
    private final PlaceRepository placeRepository;

    @Value("${kakao.api.key}")
    private String kakaoApiKey;

    private static final String KAKAO_SEARCH_URL =
            "https://dapi.kakao.com/v2/local/search/keyword.json";

    /** 카카오 Local API로 장소 검색 (DB 저장 없음) */
    public List<PlaceSearchResponse> searchPlaces(String query) {
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoApiKey);

        String url = UriComponentsBuilder.fromHttpUrl(KAKAO_SEARCH_URL)
                .queryParam("query", query)
                .queryParam("size", 15)
                .build()
                .toUriString();

        try {
            ResponseEntity<KakaoPlaceSearchResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.GET,
                    new HttpEntity<>(headers),
                    KakaoPlaceSearchResponse.class
            );

            if (response.getBody() == null || response.getBody().getDocuments() == null) {
                return Collections.emptyList();
            }

            return response.getBody().getDocuments().stream()
                    .map(PlaceSearchResponse::from)
                    .collect(Collectors.toList());

        } catch (RestClientException e) {
            System.out.println("카카오 API 호출 실패 원인: " + e.getMessage());
            throw new CustomException(ErrorCode.KAKAO_API_ERROR);
        }
    }

    /** 선택한 장소를 DB에 저장 */
    @Transactional
    public PlaceResponse savePlace(PlaceSaveRequest request) {
        Place place = placeRepository.save(Place.builder()
                .name(request.getName())
                .address(request.getAddress())
                .latitude(request.getLatitude())
                .longitude(request.getLongitude())
                .build());

        return PlaceResponse.from(place);
    }

    /** 저장된 장소 단건 조회 */
    @Transactional(readOnly = true)
    public PlaceResponse getPlaceById(Long placeId) {
        Place place = placeRepository.findById(placeId)
                .orElseThrow(() -> new CustomException(ErrorCode.PLACE_NOT_FOUND));

        return PlaceResponse.from(place);
    }
}
