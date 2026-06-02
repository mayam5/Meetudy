package meetudy.demo.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.Key;
import java.util.Date;
import java.util.UUID;

@Component
public class JwtProvider {

    private final Key key;
    private final long accessExpirationMs;
    private final long refreshExpirationMs;

    public JwtProvider(
            @Value("${jwt.secret}") String secret,
            @Value("${jwt.expiration-ms}") long accessExpirationMs,
            @Value("${jwt.refresh-expiration-ms}") long refreshExpirationMs) {
        this.key = Keys.hmacShaKeyFor(secret.getBytes());
        this.accessExpirationMs  = accessExpirationMs;
        this.refreshExpirationMs = refreshExpirationMs;
    }

    /** Access Token (짧은 유효기간, userId/email 포함) */
    public String generateToken(Long userId, String email) {
        return Jwts.builder()
                .setSubject(String.valueOf(userId))
                .claim("email", email)
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + accessExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    /** Refresh Token (UUID subject, 실제 검증은 DB에서 수행) */
    public String generateRefreshToken() {
        return Jwts.builder()
                .setSubject(UUID.randomUUID().toString())
                .setIssuedAt(new Date())
                .setExpiration(new Date(System.currentTimeMillis() + refreshExpirationMs))
                .signWith(key, SignatureAlgorithm.HS256)
                .compact();
    }

    public Long getUserId(String token) {
        return Long.parseLong(parseClaims(token).getSubject());
    }

    public boolean validateToken(String token) {
        try {
            parseClaims(token);
            return true;
        } catch (JwtException | IllegalArgumentException e) {
            return false;
        }
    }

    private Claims parseClaims(String token) {
        return Jwts.parserBuilder()
                .setSigningKey(key)
                .build()
                .parseClaimsJws(token)
                .getBody();
    }
}
