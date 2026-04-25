package com.runpro.runpro.coach;

import java.time.Instant;

public final class CoachDtos {
    private CoachDtos() {}

    public record AdvisoryDto(String id, String name, String code) {}

    public record JoinRequestDto(
            String id,
            String athleteId,
            String athleteName,
            String message,
            Instant requestedAt
    ) {}

    public record AthleteListItemDto(
            String id,
            String name,
            String nextRace,
            Boolean lastTrainingCompleted
    ) {}
}
