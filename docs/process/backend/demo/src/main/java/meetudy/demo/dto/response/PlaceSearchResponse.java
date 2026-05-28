package meetudy.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class PlaceSearchResponse {

    private String kakaoPlaceId;
    private String name;
    private String address;
    private String roadAddress;
    private String categoryName;
    private String phone;
    private String placeUrl;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public static PlaceSearchResponse from(KakaoPlaceSearchResponse.Document doc) {
        BigDecimal lat = (doc.getY() != null && !doc.getY().isBlank())
                ? new BigDecimal(doc.getY()) : null;
        BigDecimal lng = (doc.getX() != null && !doc.getX().isBlank())
                ? new BigDecimal(doc.getX()) : null;

        return new PlaceSearchResponse(
                doc.getId(),
                doc.getPlaceName(),
                doc.getAddressName(),
                doc.getRoadAddressName(),
                doc.getCategoryName(),
                doc.getPhone(),
                doc.getPlaceUrl(),
                lat,
                lng
        );
    }
}
