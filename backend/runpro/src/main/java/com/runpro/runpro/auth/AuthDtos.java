package com.runpro.runpro.auth;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public final class AuthDtos {
    private AuthDtos() {}

    public record LoginRequest(
            @NotBlank @Email String email,
            @NotBlank String password
    ) {}

    public record CoachSignupRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank String cref,
            @NotBlank @Size(min = 6) String password,
            @NotBlank String advisoryName
    ) {}

    public record AthleteSignupRequest(
            @NotBlank String name,
            @NotBlank @Email String email,
            @NotBlank String advisoryCode,
            @NotBlank @Size(min = 6) String password
    ) {}

    public record UserDto(
            String id,
            String name,
            String email,
            String role,
            String advisoryId
    ) {}

    public record AuthResponse(String token, UserDto user) {}

    public record ErrorResponse(String message) {}
}
