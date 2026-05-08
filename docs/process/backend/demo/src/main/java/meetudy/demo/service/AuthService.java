package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.dto.request.LoginRequest;
import meetudy.demo.dto.request.RegisterRequest;
import meetudy.demo.dto.response.LoginResponse;
import meetudy.demo.entity.User;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.UserRepository;
import meetudy.demo.security.JwtProvider;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtProvider jwtProvider;
    private final RefreshTokenService refreshTokenService;

    /** AUTH-08: 회원가입 */
    @Transactional
    public void register(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail()))
            throw new CustomException(ErrorCode.EMAIL_ALREADY_EXISTS);
        if (userRepository.existsByNickname(request.getNickname()))
            throw new CustomException(ErrorCode.NICKNAME_ALREADY_EXISTS);

        userRepository.save(User.builder()
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .nickname(request.getNickname())
                .isAgePublic(true)
                .build());
    }

    /** AUTH-09: 로그인 — Access + Refresh Token 동시 발급 */
    @Transactional
    public LoginResponse login(LoginRequest request, String deviceInfo) {
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_CREDENTIALS));

        if (user.isDeleted() || !passwordEncoder.matches(request.getPassword(), user.getPassword()))
            throw new CustomException(ErrorCode.INVALID_CREDENTIALS);

        String accessToken  = jwtProvider.generateToken(user.getUserId(), user.getEmail());
        String refreshToken = jwtProvider.generateRefreshToken();

        refreshTokenService.save(user, refreshToken, deviceInfo);

        return LoginResponse.of(accessToken, refreshToken, user.getUserId(), user.getNickname());
    }

    /** AUTH-NEW: Access Token 재발급 (Refresh Token Rotation) */
    @Transactional
    public LoginResponse refresh(String rawRefreshToken, String deviceInfo) {
        // 기존 토큰 검증 + 폐기, User 반환
        User user = refreshTokenService.validateAndRotate(rawRefreshToken);

        String newAccessToken  = jwtProvider.generateToken(user.getUserId(), user.getEmail());
        String newRefreshToken = jwtProvider.generateRefreshToken();

        refreshTokenService.save(user, newRefreshToken, deviceInfo);

        return LoginResponse.of(newAccessToken, newRefreshToken, user.getUserId(), user.getNickname());
    }

    /** AUTH-NEW: 로그아웃 — 모든 Refresh Token 폐기 */
    @Transactional
    public void logout(Long userId) {
        refreshTokenService.revokeAll(userId);
    }
}
