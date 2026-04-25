package com.runpro.runpro.auth;

import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService auth;

    public AuthController(AuthService auth) {
        this.auth = auth;
    }

    @PostMapping("/login")
    public AuthDtos.AuthResponse login(@Valid @RequestBody AuthDtos.LoginRequest req) {
        return auth.login(req);
    }

    @PostMapping("/signup/coach")
    public AuthDtos.AuthResponse signupCoach(@Valid @RequestBody AuthDtos.CoachSignupRequest req) {
        return auth.signupCoach(req);
    }

    @PostMapping("/signup/athlete")
    public AuthDtos.AuthResponse signupAthlete(@Valid @RequestBody AuthDtos.AthleteSignupRequest req) {
        return auth.signupAthlete(req);
    }

    @ExceptionHandler(AuthService.AuthException.class)
    public ResponseEntity<AuthDtos.ErrorResponse> handleAuth(AuthService.AuthException ex) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body(new AuthDtos.ErrorResponse(ex.getMessage()));
    }
}
