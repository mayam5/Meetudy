package meetudy.demo.dto.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.util.List;

@Getter
@NoArgsConstructor
public class KakaoPlaceSearchResponse {

    private List<Document> documents;

    @Getter
    @NoArgsConstructor
    public static class Document {

        private String id;

        @JsonProperty("place_name")
        private String placeName;

        @JsonProperty("category_name")
        private String categoryName;

        @JsonProperty("category_group_name")
        private String categoryGroupName;

        private String phone;

        @JsonProperty("address_name")
        private String addressName;

        @JsonProperty("road_address_name")
        private String roadAddressName;

        /** 경도 (x) */
        private String x;

        /** 위도 (y) */
        private String y;

        @JsonProperty("place_url")
        private String placeUrl;
    }
}
