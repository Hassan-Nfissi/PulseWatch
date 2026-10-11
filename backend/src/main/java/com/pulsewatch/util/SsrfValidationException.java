package com.pulsewatch.util;

public class SsrfValidationException extends RuntimeException {
    public SsrfValidationException(String message) {
        super(message);
    }
}
