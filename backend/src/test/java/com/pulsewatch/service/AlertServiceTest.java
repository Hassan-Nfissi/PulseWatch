package com.pulsewatch.service;

import org.junit.jupiter.api.Test;
import org.springframework.mail.javamail.JavaMailSender;

import static org.junit.jupiter.api.Assertions.assertNotNull;
import static org.mockito.Mockito.mock;

public class AlertServiceTest {

    @Test
    void testAlertServiceInitialization() {
        JavaMailSender mailSender = mock(JavaMailSender.class);
        AlertService alertService = new AlertService(mailSender);
        assertNotNull(alertService);
    }
}
