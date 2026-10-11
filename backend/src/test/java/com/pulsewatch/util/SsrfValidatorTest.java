package com.pulsewatch.util;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

public class SsrfValidatorTest {

    private SsrfValidator ssrfValidator;

    @BeforeEach
    void setUp() {
        ssrfValidator = new SsrfValidator();
    }

    @Test
    void testLoopbackBlocked() {
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("http://127.0.0.1:8080/metrics"));
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("http://localhost:3000/api"));
    }

    @Test
    void testPrivateSubnetsBlocked() {
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("http://10.0.0.1/admin"));
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("http://192.168.1.100"));
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("http://172.16.5.10"));
    }

    @Test
    void testAwsMetadataBlocked() {
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("http://169.254.169.254/latest/meta-data/"));
    }

    @Test
    void testZeroAddressBlocked() {
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("http://0.0.0.0:8080"));
    }

    @Test
    void testInvalidSchemesBlocked() {
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("file:///etc/passwd"));
        assertThrows(SsrfValidationException.class, () -> ssrfValidator.validateUrl("ftp://ftp.example.com"));
    }

    @Test
    void testValidPublicUrlAllowed() {
        assertDoesNotThrow(() -> ssrfValidator.validateUrl("https://example.com"));
        assertDoesNotThrow(() -> ssrfValidator.validateUrl("https://google.com"));
    }
}
