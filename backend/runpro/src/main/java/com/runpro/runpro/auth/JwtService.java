package com.runpro.runpro.auth;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import javax.crypto.Mac;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.time.Instant;
import java.util.Base64;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.Optional;

/**
 * Minimal HS256 JWT using only the JDK. Format: header.payload.signature (base64url).
 * Payload fields: sub, role, adv (advisoryId), exp (epoch seconds).
 */
@Service
public class JwtService {

    private final byte[] key;
    private final long expirationSeconds;

    public JwtService(
            @Value("${app.jwt.secret}") String secret,
            @Value("${app.jwt.expiration-hours:24}") long expirationHours
    ) {
        this.key = secret.getBytes(StandardCharsets.UTF_8);
        this.expirationSeconds = expirationHours * 3600L;
    }

    public record Claims(String subject, String role, String advisoryId, long expiresAt) {}

    public String issue(String subject, String role, String advisoryId) {
        long exp = Instant.now().getEpochSecond() + expirationSeconds;
        String header = b64(json(Map.of("alg", "HS256", "typ", "JWT")));
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("sub", subject);
        body.put("role", role);
        body.put("adv", advisoryId);
        body.put("exp", exp);
        String payload = b64(json(body));
        String signingInput = header + "." + payload;
        String sig = b64(hmacSha256(signingInput.getBytes(StandardCharsets.UTF_8)));
        return signingInput + "." + sig;
    }

    public Optional<Claims> verify(String token) {
        if (token == null) return Optional.empty();
        String[] parts = token.split("\\.");
        if (parts.length != 3) return Optional.empty();

        String signingInput = parts[0] + "." + parts[1];
        byte[] expected = hmacSha256(signingInput.getBytes(StandardCharsets.UTF_8));
        byte[] provided;
        try {
            provided = Base64.getUrlDecoder().decode(parts[2]);
        } catch (IllegalArgumentException e) {
            return Optional.empty();
        }
        if (!MessageDigest.isEqual(expected, provided)) return Optional.empty();

        String payloadJson = new String(Base64.getUrlDecoder().decode(parts[1]), StandardCharsets.UTF_8);
        String sub = extract(payloadJson, "sub");
        String role = extract(payloadJson, "role");
        String adv = extract(payloadJson, "adv");
        String expStr = extract(payloadJson, "exp");
        long exp;
        try {
            exp = Long.parseLong(expStr);
        } catch (NumberFormatException e) {
            return Optional.empty();
        }
        if (Instant.now().getEpochSecond() > exp) return Optional.empty();
        return Optional.of(new Claims(sub, role, adv, exp));
    }

    private byte[] hmacSha256(byte[] data) {
        try {
            Mac mac = Mac.getInstance("HmacSHA256");
            mac.init(new SecretKeySpec(key, "HmacSHA256"));
            return mac.doFinal(data);
        } catch (Exception e) {
            throw new IllegalStateException(e);
        }
    }

    private static String b64(String s) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(s.getBytes(StandardCharsets.UTF_8));
    }

    private static String b64(byte[] s) {
        return Base64.getUrlEncoder().withoutPadding().encodeToString(s);
    }

    private static String json(Map<String, ?> map) {
        StringBuilder sb = new StringBuilder("{");
        boolean first = true;
        for (var entry : map.entrySet()) {
            if (!first) sb.append(",");
            first = false;
            sb.append("\"").append(escape(entry.getKey())).append("\":");
            Object v = entry.getValue();
            if (v instanceof Number) sb.append(v);
            else sb.append("\"").append(escape(String.valueOf(v))).append("\"");
        }
        return sb.append("}").toString();
    }

    private static String escape(String s) {
        return s.replace("\\", "\\\\").replace("\"", "\\\"");
    }

    // naive JSON field extractor — works because we control the token shape
    private static String extract(String json, String field) {
        String quoted = "\"" + field + "\":";
        int i = json.indexOf(quoted);
        if (i < 0) return null;
        int start = i + quoted.length();
        while (start < json.length() && Character.isWhitespace(json.charAt(start))) start++;
        if (start >= json.length()) return null;
        char c = json.charAt(start);
        if (c == '"') {
            int end = json.indexOf('"', start + 1);
            return end < 0 ? null : json.substring(start + 1, end);
        }
        int end = start;
        while (end < json.length() && "0123456789-".indexOf(json.charAt(end)) >= 0) end++;
        return json.substring(start, end);
    }
}
