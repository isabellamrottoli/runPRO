package com.runpro.runpro.runner;

import java.time.LocalDate;
import java.util.List;

public final class RunnerDtos {
    private RunnerDtos() {}

    public record WeekDto(LocalDate start, LocalDate end, List<DayDto> days) {}

    public record DayDto(
            LocalDate date,
            String workoutId,
            String workoutName,
            String type,      // RUNNING | STRENGTH | null
            String status     // PENDING | COMPLETED | MISSED | null (nenhum treino)
    ) {}

    public record WorkoutDto(
            String id,
            String name,
            String description,
            LocalDate date,
            String type,
            String status
    ) {}

    public record WeeklyGoalDto(
            String id,
            String description,
            String type,
            double currentValue,
            double targetValue,
            String unit,
            LocalDate deadline
    ) {}
}
