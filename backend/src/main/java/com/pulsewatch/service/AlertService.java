package com.pulsewatch.service;

import com.pulsewatch.model.Incident;
import com.pulsewatch.model.Monitor;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.time.ZoneId;
import java.time.format.DateTimeFormatter;

@Slf4j
@Service
@RequiredArgsConstructor
public class AlertService {

    private final JavaMailSender mailSender;

    @Value("${app.mail.from:alerts@pulsewatch.io}")
    private String mailFrom;

    private static final DateTimeFormatter DATE_FORMATTER =
            DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss 'UTC'").withZone(ZoneId.of("UTC"));

    @Async
    public void sendIncidentOpenAlert(Monitor monitor, Incident incident) {
        String recipient = monitor.getUser().getEmail();
        String subject = "\uD83D\uDD34 [DOWN ALERT] Monitor " + monitor.getName() + " is DOWN";

        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; }
                    .card { background-color: #1e293b; border-radius: 8px; padding: 24px; max-width: 600px; margin: auto; border-top: 4px solid #ef4444; }
                    .header { font-size: 20px; font-weight: bold; color: #ef4444; margin-bottom: 16px; }
                    .info-row { margin: 8px 0; font-size: 14px; }
                    .label { font-weight: 600; color: #94a3b8; }
                    .value { color: #f1f5f9; }
                    .footer { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">\u26A0\uFE0F Incident Detected: Monitor is DOWN</div>
                    <div class="info-row"><span class="label">Monitor:</span> <span class="value">%s</span></div>
                    <div class="info-row"><span class="label">URL:</span> <span class="value">%s</span></div>
                    <div class="info-row"><span class="label">Started At:</span> <span class="value">%s</span></div>
                    <div class="info-row"><span class="label">Cause:</span> <span class="value">%s</span></div>
                    <div class="footer">Sent automatically by PulseWatch Uptime Monitoring</div>
                </div>
            </body>
            </html>
            """,
                monitor.getName(),
                monitor.getTargetUrl(),
                DATE_FORMATTER.format(incident.getStartedAt()),
                incident.getCause() != null ? incident.getCause() : "Unreachable"
        );

        sendEmail(recipient, subject, htmlContent);
    }

    @Async
    public void sendIncidentResolvedAlert(Monitor monitor, Incident incident) {
        String recipient = monitor.getUser().getEmail();
        String subject = "\u2705 [RESOLVED] Monitor " + monitor.getName() + " is UP";

        long minutes = incident.getDurationSeconds() != null ? incident.getDurationSeconds() / 60 : 0;
        long seconds = incident.getDurationSeconds() != null ? incident.getDurationSeconds() % 60 : 0;
        String durationStr = String.format("%d min, %d sec", minutes, seconds);

        String htmlContent = String.format("""
            <!DOCTYPE html>
            <html>
            <head>
                <meta charset="utf-8">
                <style>
                    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #0f172a; color: #f8fafc; padding: 20px; }
                    .card { background-color: #1e293b; border-radius: 8px; padding: 24px; max-width: 600px; margin: auto; border-top: 4px solid #10b981; }
                    .header { font-size: 20px; font-weight: bold; color: #10b981; margin-bottom: 16px; }
                    .info-row { margin: 8px 0; font-size: 14px; }
                    .label { font-weight: 600; color: #94a3b8; }
                    .value { color: #f1f5f9; }
                    .footer { margin-top: 24px; font-size: 12px; color: #64748b; text-align: center; }
                </style>
            </head>
            <body>
                <div class="card">
                    <div class="header">\u2705 Incident Resolved: Monitor is Operational</div>
                    <div class="info-row"><span class="label">Monitor:</span> <span class="value">%s</span></div>
                    <div class="info-row"><span class="label">URL:</span> <span class="value">%s</span></div>
                    <div class="info-row"><span class="label">Started At:</span> <span class="value">%s</span></div>
                    <div class="info-row"><span class="label">Resolved At:</span> <span class="value">%s</span></div>
                    <div class="info-row"><span class="label">Total Downtime:</span> <span class="value">%s</span></div>
                    <div class="footer">Sent automatically by PulseWatch Uptime Monitoring</div>
                </div>
            </body>
            </html>
            """,
                monitor.getName(),
                monitor.getTargetUrl(),
                DATE_FORMATTER.format(incident.getStartedAt()),
                DATE_FORMATTER.format(incident.getResolvedAt()),
                durationStr
        );

        sendEmail(recipient, subject, htmlContent);
    }

    private void sendEmail(String recipient, String subject, String htmlBody) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(mailFrom);
            helper.setTo(recipient);
            helper.setSubject(subject);
            helper.setText(htmlBody, true);

            mailSender.send(message);
            log.info("Email alert successfully sent to {}", recipient);
        } catch (Exception e) {
            log.warn("Could not dispatch email alert to {} (Check SMTP configuration): {}", recipient, e.getMessage());
        }
    }
}
