package com.rms.service;

import com.rms.domain.RefreshToken;
import com.rms.domain.User;
import com.rms.dto.AuthResponse;
import com.rms.dto.LoginRequest;
import com.rms.dto.UserResponse;
import com.rms.exception.AppException;
import com.rms.repository.RefreshTokenRepository;
import com.rms.repository.UserRepository;
import com.rms.security.JwtTokenProvider;
import com.rms.security.UserPrincipal;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;

@Service
@RequiredArgsConstructor
public class AuthService {

    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;
    private final RefreshTokenRepository refreshTokenRepository;
    private final JwtTokenProvider jwtTokenProvider;

    @Transactional
    public AuthResponse login(LoginRequest request) {
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.email(), request.password()));
        UserPrincipal principal = (UserPrincipal) authentication.getPrincipal();
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return buildAuthResponse(user);
    }

    @Transactional
    public AuthResponse refresh(String refreshTokenValue) {
        RefreshToken refreshToken = refreshTokenRepository.findByToken(refreshTokenValue)
                .filter(rt -> !rt.isRevoked())
                .filter(rt -> rt.getExpiresAt().isAfter(Instant.now()))
                .orElseThrow(() -> new AppException("Invalid refresh token", HttpStatus.UNAUTHORIZED));

        User user = refreshToken.getUser();
        if (!user.isActive()) {
            throw new AppException("Account is disabled", HttpStatus.FORBIDDEN);
        }

        refreshToken.setRevoked(true);
        refreshTokenRepository.save(refreshToken);
        return buildAuthResponse(user);
    }

    @Transactional
    public void logout(String refreshTokenValue) {
        refreshTokenRepository.findByToken(refreshTokenValue).ifPresent(token -> {
            token.setRevoked(true);
            refreshTokenRepository.save(token);
        });
    }

    public UserResponse me(UserPrincipal principal) {
        User user = userRepository.findByEmail(principal.getEmail())
                .orElseThrow(() -> new AppException("User not found", HttpStatus.NOT_FOUND));
        return UserResponse.from(user);
    }

    private AuthResponse buildAuthResponse(User user) {
        String accessToken = jwtTokenProvider.generateAccessToken(user);
        String refreshValue = jwtTokenProvider.generateRefreshTokenValue();
        Instant expiresAt = Instant.now().plusMillis(jwtTokenProvider.getRefreshTokenExpirationMs());

        RefreshToken refreshToken = RefreshToken.builder()
                .user(user)
                .token(refreshValue)
                .expiresAt(expiresAt)
                .revoked(false)
                .build();
        refreshTokenRepository.save(refreshToken);

        return AuthResponse.of(
                accessToken,
                refreshValue,
                jwtTokenProvider.getAccessTokenExpirationMs() / 1000,
                UserResponse.from(user)
        );
    }
}
