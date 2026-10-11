package com.pulsewatch.util;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;

import java.net.InetAddress;
import java.net.URI;

@Slf4j
@Component
public class SsrfValidator {

    /**
     * Validates target URL against SSRF attacks by resolving DNS and ensuring IP is non-private and non-metadata.
     */
    public void validateUrl(String urlString) {
        if (urlString == null || urlString.trim().isEmpty()) {
            throw new SsrfValidationException("Target URL cannot be empty");
        }

        URI uri;
        try {
            uri = URI.create(urlString);
        } catch (Exception e) {
            throw new SsrfValidationException("Invalid URL syntax: " + urlString);
        }

        String scheme = uri.getScheme();
        if (scheme == null || (!scheme.equalsIgnoreCase("http") && !scheme.equalsIgnoreCase("https"))) {
            throw new SsrfValidationException("Only HTTP and HTTPS schemes are supported");
        }

        String host = uri.getHost();
        if (host == null || host.trim().isEmpty()) {
            throw new SsrfValidationException("URL must contain a valid hostname");
        }

        try {
            InetAddress[] addresses = InetAddress.getAllByName(host);
            for (InetAddress addr : addresses) {
                validateAddress(addr);
            }
        } catch (SsrfValidationException e) {
            throw e;
        } catch (Exception e) {
            log.warn("DNS resolution failed for host {}: {}", host, e.getMessage());
            throw new SsrfValidationException("DNS resolution failed for hostname: " + host);
        }
    }

    public void validateAddress(InetAddress addr) {
        if (addr == null) {
            throw new SsrfValidationException("Null IP address resolved");
        }

        byte[] raw = addr.getAddress();

        // Check standard InetAddress checks
        if (addr.isAnyLocalAddress() ||
            addr.isLoopbackAddress() ||
            addr.isLinkLocalAddress() ||
            addr.isSiteLocalAddress() ||
            addr.isMulticastAddress()) {
            throw new SsrfValidationException("Access to internal/private IP address is restricted: " + addr.getHostAddress());
        }

        // Additional IPv4 checks (0.0.0.0/8, 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16, 169.254.0.0/16)
        if (raw.length == 4) {
            int b0 = raw[0] & 0xFF;
            int b1 = raw[1] & 0xFF;

            // 0.0.0.0/8
            if (b0 == 0) {
                throw new SsrfValidationException("Access to 0.0.0.0/8 subnet is restricted: " + addr.getHostAddress());
            }
            // 10.0.0.0/8
            if (b0 == 10) {
                throw new SsrfValidationException("Access to private 10.0.0.0/8 subnet is restricted: " + addr.getHostAddress());
            }
            // 172.16.0.0/12 (172.16.0.0 - 172.31.255.255)
            if (b0 == 172 && (b1 >= 16 && b1 <= 31)) {
                throw new SsrfValidationException("Access to private 172.16.0.0/12 subnet is restricted: " + addr.getHostAddress());
            }
            // 192.168.0.0/16
            if (b0 == 192 && b1 == 168) {
                throw new SsrfValidationException("Access to private 192.168.0.0/16 subnet is restricted: " + addr.getHostAddress());
            }
            // 169.254.0.0/16 (AWS/Cloud Instance Metadata & Link-Local)
            if (b0 == 169 && b1 == 254) {
                throw new SsrfValidationException("Access to link-local/cloud metadata IP (169.254.x.x) is restricted: " + addr.getHostAddress());
            }
            // 127.0.0.0/8
            if (b0 == 127) {
                throw new SsrfValidationException("Access to loopback 127.0.0.0/8 subnet is restricted: " + addr.getHostAddress());
            }
        } else if (raw.length == 16) {
            // IPv6 Checks
            // fc00::/7 (Unique Local Address)
            int b0 = raw[0] & 0xFF;
            if ((b0 & 0xFE) == 0xFC) {
                throw new SsrfValidationException("Access to IPv6 Unique Local Address is restricted: " + addr.getHostAddress());
            }
            // fe80::/10 (Link-Local Address)
            if (b0 == 0xFE && ((raw[1] & 0xFF) & 0xC0) == 0x80) {
                throw new SsrfValidationException("Access to IPv6 Link-Local Address is restricted: " + addr.getHostAddress());
            }
        }
    }
}
