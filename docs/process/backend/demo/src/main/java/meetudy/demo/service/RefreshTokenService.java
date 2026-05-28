package meetudy.demo.service;

import lombok.RequiredArgsConstructor;
import meetudy.demo.entity.RefreshToken;
import meetudy.demo.entity.User;
import meetudy.demo.exception.CustomException;
import meetudy.demo.exception.ErrorCode;
import meetudy.demo.repository.RefreshTokenRepository;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.time.LocalDateTime;
import java.util.HexFormat;

@Service
@RequiredArgsConstructor
public class RefreshTokenService {

    private final RefreshTokenRepository refreshTokenRepository;

    @Value("${jwt.refresh-expiration-ms}")
    private long refreshExpirationMs;

    /** 원본 토큰 → SHA-256 해시 (DB에는 해시만 저장) */
    public String hash(String rawToken) {
        try {
            byte[] bytes = MessageDigest.getInstance("SHA-256")
                    .digest(rawToken.getBytes(StandardCharsets.UTF_8));
            return HexFormat.of().formatHex(bytes);
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("SHA-256 not available", e);
        }
    }

    /** 로그인/재발급 시 새 Refresh Token 저장 */
    @Transactional
    public void save(User user, String rawToken, String deviceInfo) {
        refreshTokenRepository.save(RefreshToken.builder()
                .user(user)
                .tokenHash(hash(rawToken))
                .deviceInfo(deviceInfo)
                .expiresAt(LocalDateTime.now().plusSeconds(refreshExpirationMs / 1000))
                .build());
    }

    /**
     * 검증 후 해당 토큰 즉시 폐기 (Rotation 방식)
     * → 검증 성공 시 User 반환, AuthService에서 새 토큰 쌍 발급
     */
    @Transactional
    public User validateAndRotate(String rawToken) {
        RefreshToken token = refreshTokenRepository.findByTokenHash(hash(rawToken))
                .orElseThrow(() -> new CustomException(ErrorCode.INVALID_REFRESH_TOKEN));

        if (token.isRevoked() || token.isExpired()) {
            throw new CustomException(ErrorCode.INVALID_REFRESH_TOKEN);
        }

        token.revoke();  // 사용된 토큰 즉시 폐기
        return token.getUser();
    }

    /** 로그아웃: 해당 유저의 모든 활성 토큰 일괄 폐기 */
    @Transactional
    public void revokeAll(Long userId) {
        refreshTokenRepository.revokeAllByUserId(userId);
    }
}
