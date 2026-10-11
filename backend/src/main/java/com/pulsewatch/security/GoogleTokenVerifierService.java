package com.pulsewatch.security;

import com.google.api.client.googleapis.auth.oauth2.GoogleIdToken;
import com.google.api.client.googleapis.auth.oauth2.GoogleIdTokenVerifier;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.gson.GsonFactory;
import lombok.Builder;
import lombok.Getter;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.Collections;

@Slf4j
@Service
public class GoogleTokenVerifierService {

    @Value("${app.google.client-id}")
    private String googleClientId;

    @Getter
    @Builder
    public static class GoogleUserPayload {
        private String googleId;
        private String email;
        private String name;
        private String pictureUrl;
    }

    public GoogleUserPayload verifyToken(String idTokenString) {
        if (idTokenString == null || idTokenString.trim().isEmpty()) {
            throw new IllegalArgumentException("Google ID Token is empty");
        }

        // Support for local Dev / Demo Token if enabled
        if (idTokenString.startsWith("dev-google-token-")) {
            String email = idTokenString.replace("dev-google-token-", "") + "@example.com";
            log.info("Processing dev mode token for email: {}", email);
            return GoogleUserPayload.builder()
                    .googleId("dev-google-id-" + Math.abs(email.hashCode()))
                    .email(email)
                    .name("Dev User (" + email + ")")
                    .pictureUrl("https://lh3.googleusercontent.com/a/default-user")
                    .build();
        }

        try {
            GoogleIdTokenVerifier verifier = new GoogleIdTokenVerifier.Builder(
                    new NetHttpTransport(),
                    GsonFactory.getDefaultInstance()
            )
            .setAudience(Collections.singletonList(googleClientId))
            .build();

            GoogleIdToken idToken = verifier.verify(idTokenString);
            if (idToken != null) {
                GoogleIdToken.Payload payload = idToken.getPayload();
                return GoogleUserPayload.builder()
                        .googleId(payload.getSubject())
                        .email(payload.getEmail())
                        .name((String) payload.get("name"))
                        .pictureUrl((String) payload.get("picture"))
                        .build();
            } else {
                throw new SecurityException("Invalid Google ID Token");
            }
        } catch (Exception e) {
            log.error("Failed to verify Google ID token: {}", e.getMessage());
            throw new SecurityException("Google token verification failed: " + e.getMessage());
        }
    }
}
