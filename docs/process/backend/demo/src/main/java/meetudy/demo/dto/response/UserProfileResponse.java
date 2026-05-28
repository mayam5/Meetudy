package meetudy.demo.dto.response;

import lombok.Builder;
import lombok.Getter;
import meetudy.demo.entity.User;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Builder
public class UserProfileResponse {

    private Long userId;
    private String email;
    private String nickname;
    private String profileImage;
    private LocalDate birthDate;
    private Boolean isAgePublic;
    private String gender;
    private String bio;
    private LocalDateTime createdAt;

    public static UserProfileResponse from(User user) {
        return UserProfileResponse.builder()
                .userId(user.getUserId())
                .email(user.getEmail())
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .birthDate(user.getBirthDate())
                .isAgePublic(user.getIsAgePublic())
                .gender(user.getGender())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
