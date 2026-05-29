package meetudy.demo.dto.response;

import lombok.AllArgsConstructor;
import lombok.Getter;
import meetudy.demo.entity.Place;

import java.math.BigDecimal;

@Getter
@AllArgsConstructor
public class PlaceResponse {

    private Long placeId;
    private String name;
    private String address;
    private BigDecimal latitude;
    private BigDecimal longitude;

    public static PlaceResponse from(Place place) {
        return new PlaceResponse(
                place.getPlaceId(),
                place.getName(),
                place.getAddress(),
                place.getLatitude(),
                place.getLongitude()
        );
    }
}
