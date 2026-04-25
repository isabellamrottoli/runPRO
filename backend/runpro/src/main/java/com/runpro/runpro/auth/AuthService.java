package com.runpro.runpro.auth;

import com.runpro.runpro.domain.*;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;

@Service
public class AuthService {

    private static final String ALPHABET = "ABCDEFGHIJKLMNPQRSTUVWXYZ23456789";
    private static final SecureRandom RNG = new SecureRandom();

    private final UserRepository users;
    private final AdvisoryRepository advisories;
    private final PasswordEncoder encoder;
    private final JwtService jwt;

    public AuthService(
            UserRepository users,
            AdvisoryRepository advisories,
            PasswordEncoder encoder,
            JwtService jwt
    ) {
        this.users = users;
        this.advisories = advisories;
        this.encoder = encoder;
        this.jwt = jwt;
    }

    @Transactional
    public AuthDtos.AuthResponse login(AuthDtos.LoginRequest req) {
        User user = users.findByEmail(req.email())
                .orElseThrow(() -> new AuthException("Credenciais inválidas."));
        if (!encoder.matches(req.password(), user.getPassword())) {
            throw new AuthException("Credenciais inválidas.");
        }
        return buildResponse(user);
    }

    @Transactional
    public AuthDtos.AuthResponse signupCoach(AuthDtos.CoachSignupRequest req) {
        if (users.existsByEmail(req.email())) {
            throw new AuthException("E-mail já cadastrado.");
        }

        Advisory advisory = new Advisory();
        advisory.setName(req.advisoryName());
        advisory.setCode(generateAdvisoryCode());
        advisory = advisories.save(advisory);

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPassword(encoder.encode(req.password()));
        user.setRole(UserRole.COACH);
        user.setCref(req.cref());
        user.setAdvisory(advisory);
        user = users.save(user);

        return buildResponse(user);
    }

    @Transactional
    public AuthDtos.AuthResponse signupAthlete(AuthDtos.AthleteSignupRequest req) {
        if (users.existsByEmail(req.email())) {
            throw new AuthException("E-mail já cadastrado.");
        }
        Advisory advisory = advisories.findByCode(req.advisoryCode())
                .orElseThrow(() -> new AuthException("Código de assessoria inválido."));

        User user = new User();
        user.setName(req.name());
        user.setEmail(req.email());
        user.setPassword(encoder.encode(req.password()));
        user.setRole(UserRole.ATHLETE);
        user.setAdvisory(advisory);
        user = users.save(user);

        return buildResponse(user);
    }

    private AuthDtos.AuthResponse buildResponse(User user) {
        String advisoryId = user.getAdvisory().getId().toString();
        String token = jwt.issue(user.getId().toString(), user.getRole().name(), advisoryId);
        return new AuthDtos.AuthResponse(token, new AuthDtos.UserDto(
                user.getId().toString(),
                user.getName(),
                user.getEmail(),
                user.getRole().name(),
                advisoryId
        ));
    }

    private String generateAdvisoryCode() {
        for (int attempt = 0; attempt < 5; attempt++) {
            StringBuilder sb = new StringBuilder(6);
            for (int i = 0; i < 6; i++) {
                sb.append(ALPHABET.charAt(RNG.nextInt(ALPHABET.length())));
            }
            String code = sb.toString();
            if (!advisories.existsByCode(code)) return code;
        }
        throw new IllegalStateException("Unable to generate advisory code");
    }

    public static class AuthException extends RuntimeException {
        public AuthException(String msg) { super(msg); }
    }
}
