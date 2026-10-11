package com.pulsewatch.service;

import com.pulsewatch.dto.AuthResponse;
import com.pulsewatch.dto.GoogleAuthRequest;
import com.pulsewatch.dto.UserDto;
import com.pulsewatch.model.User;
import com.pulsewatch.repository.UserRepository;
import com.pulsewatch.security.GoogleTokenVerifierService;
import com.pulsewatch.security.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final UserRepository userRepository;
    private final GoogleTokenVerifierService googleTokenVerifier;
    private final JwtUtils jwtUtils;

    @Transactional
    public AuthResponse authenticateWithGoogle(GoogleAuthRequest request) {
        GoogleTokenVerifierService.GoogleUserPayload payload = googleTokenVerifier.verifyToken(request.getIdToken());

        User user = userRepository.findByGoogleId(payload.getGoogleId())
                .orElseGet(() -> userRepository.findByEmail(payload.getEmail())
                        .map(existingUser -> {
                            existingUser.setGoogleId(payload.getGoogleId());
                            if (payload.getPictureUrl() != null) {
                                existingUser.setPictureUrl(payload.getPictureUrl());
                            }
                            return userRepository.save(existingUser);
                        })
                        .orElseGet(() -> {
                            log.info("Auto-provisioning new user for Google ID: {}", payload.getGoogleId());
                            return userRepository.save(User.builder()
                                    .googleId(payload.getGoogleId())
                                    .email(payload.getEmail())
                                    .name(payload.getName())
                                    .pictureUrl(payload.getPictureUrl())
                                    .build());
                        }));

        String token = jwtUtils.generateToken(user.getId(), user.getEmail());

        return AuthResponse.builder()
                .token(token)
                .user(UserDto.builder()
                        .id(user.getId())
                        .email(user.getEmail())
                        .name(user.getName())
                        .pictureUrl(user.getPictureUrl())
                        .build())
                .build();
    }

    public UserDto getCurrentUserDto(User user) {
        return UserDto.builder()
                .id(user.getId())
                .email(user.getEmail())
                .name(user.getName())
                .pictureUrl(user.getPictureUrl())
                .build();
    }
}
