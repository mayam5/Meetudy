package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.UpdateProfileRequest;
import meetudy.demo.dto.response.UserProfileResponse;
import meetudy.demo.entity.User;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class UserService {

    private final UserRepository userRepository;

    /** USER-03: 내 프로필 조회 */
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(Long userId) {
        User user = findActiveUser(userId);
        return UserProfileResponse.from(user);
    }

    /** USER-04: 프로필 수정 */
    @Transactional
    public UserProfileResponse updateProfile(Long userId, UpdateProfileRequest request) {
        User user = findActiveUser(userId);

        // 닉네임 변경 시 중복 체크
        if (request.getNickname() != null
                && !request.getNickname().equals(user.getNickname())
                && userRepository.existsByNickname(request.getNickname())) {
            throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);
        }

        user.updateProfile(
                request.getNickname(),
                request.getBio(),
                request.getGender(),
                request.getBirthDate(),
                request.getIsAgePublic()
        );

        return UserProfileResponse.from(user);
    }

    /** USER-05: 프로필 이미지 수정 */
    @Transactional
    public UserProfileResponse updateProfileImage(Long userId, String imageUrl) {
        User user = findActiveUser(userId);
        user.updateProfileImage(imageUrl);
        return UserProfileResponse.from(user);
    }

    /** USER-06: 회원 탈퇴 (소프트 삭제) */
    @Transactional
    public void withdraw(Long userId) {
        User user = findActiveUser(userId);
        user.withdraw();
    }

    // ── 내부 메서드 ──────────────────────────

    private User findActiveUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new CustomException(ErrorCode.USER_NOT_FOUND));
        if (user.isDeleted()) {
            throw new CustomException(ErrorCode.USER_NOT_FOUND);
        }
        return user;
    }
}
