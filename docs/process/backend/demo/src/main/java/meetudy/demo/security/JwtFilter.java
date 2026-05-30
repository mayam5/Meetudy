package meetudy.demo.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {

    private final JwtProvider jwtProvider;
    private final UserDetailsService userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {
                
/* 
        String token = resolveToken(request);

        if (StringUtils.hasText(token) && jwtProvider.validateToken(token)) {
            Long userId = jwtProvider.getUserId(token);
            UserDetails userDetails = userDetailsService.loadUserByUsername(String.valueOf(userId));

            UsernamePasswordAuthenticationToken authentication =
                    new UsernamePasswordAuthenticationToken(userDetails, null, userDetails.getAuthorities());

            SecurityContextHolder.getContext().setAuthentication(authentication);
        }

        filterChain.doFilter(request, response);
    }
*/

System.out.println("🔥🔥🔥 JwtFilter 실행됨 🔥🔥🔥");
String token = resolveToken(request);

System.out.println("요청 URI = " + request.getRequestURI());
System.out.println("토큰 있음? " + StringUtils.hasText(token));
System.out.println("추출된 token = " + token);
System.out.println("토큰 있음? " + StringUtils.hasText(token));

if (StringUtils.hasText(token)) {
    System.out.println("토큰 유효? " + jwtProvider.validateToken(token));
}

if (StringUtils.hasText(token)) {

    boolean valid = jwtProvider.validateToken(token);
    System.out.println("토큰 유효? " + valid);

    if (valid) {
        Long userId = jwtProvider.getUserId(token);
        System.out.println("userId = " + userId);

        UserDetails userDetails =
                userDetailsService.loadUserByUsername(String.valueOf(userId));

        System.out.println("userDetails = " + userDetails);

        UsernamePasswordAuthenticationToken authentication =
                new UsernamePasswordAuthenticationToken(
                        userDetails,
                        null,
                        userDetails.getAuthorities()
                );

        SecurityContextHolder.getContext().setAuthentication(authentication);
    }
}

filterChain.doFilter(request, response);
            }

    /** Authorization: Bearer {token} 에서 토큰 추출 */
    private String resolveToken(HttpServletRequest request) {
        String bearer = request.getHeader("Authorization");
        if (StringUtils.hasText(bearer) && bearer.startsWith("Bearer ")) {
            return bearer.substring(7);
        }
        return null;
    }
}
