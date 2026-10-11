package com.pulsewatch.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.test.util.ReflectionTestUtils;

import static org.junit.jupiter.api.Assertions.*;

public class JwtUtilsTest {

    private JwtUtils jwtUtils;

    @BeforeEach
    void setUp() {
        jwtUtils = new JwtUtils();
        ReflectionTestUtils.setField(jwtUtils, "jwtSecret", "404E635266556A586E3272357538782F413F4428472B4B6250645367566B5970");
        ReflectionTestUtils.setField(jwtUtils, "jwtExpirationMs", 3600000L); // 1 hour
    }

    @Test
    void testGenerateAndValidateToken() {
        String token = jwtUtils.generateToken(123L, "test@example.com");
        assertNotNull(token);
        assertTrue(jwtUtils.validateToken(token));
        assertEquals("test@example.com", jwtUtils.getEmailFromToken(token));
        assertEquals(123L, jwtUtils.getUserIdFromToken(token));
    }

    @Test
    void testInvalidTokenRejected() {
        assertFalse(jwtUtils.validateToken("invalid.jwt.token"));
        assertNull(jwtUtils.getEmailFromToken("invalid.jwt.token"));
    }
}
