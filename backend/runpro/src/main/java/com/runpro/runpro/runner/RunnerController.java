package com.runpro.runpro.runner;

import com.runpro.runpro.domain.WorkoutStatus;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.util.UUID;

@RestController
public class RunnerController {

    private final RunnerService runner;

    public RunnerController(RunnerService runner) {
        this.runner = runner;
    }

    @GetMapping("/api/runner/week")
    public RunnerDtos.WeekDto week(
            @AuthenticationPrincipal String userId,
            @RequestParam(value = "date", required = false) String dateStr
    ) {
        LocalDate ref = parseDate(dateStr);
        return runner.week(UUID.fromString(userId), ref);
    }

    @GetMapping("/api/runner/workouts/{id}")
    public RunnerDtos.WorkoutDto workout(
            @AuthenticationPrincipal String userId,
            @PathVariable("id") UUID workoutId
    ) {
        return runner.workout(UUID.fromString(userId), workoutId);
    }

    @GetMapping("/api/runner/weekly-goal")
    public ResponseEntity<RunnerDtos.WeeklyGoalDto> weeklyGoal(@AuthenticationPrincipal String userId) {
        return runner.weeklyGoal(UUID.fromString(userId))
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NO_CONTENT).build());
    }

    @PostMapping("/api/workouts/{id}/complete")
    public RunnerDtos.WorkoutDto complete(
            @AuthenticationPrincipal String userId,
            @PathVariable("id") UUID workoutId
    ) {
        return runner.markStatus(UUID.fromString(userId), workoutId, WorkoutStatus.COMPLETED);
    }

    @PostMapping("/api/workouts/{id}/miss")
    public RunnerDtos.WorkoutDto miss(
            @AuthenticationPrincipal String userId,
            @PathVariable("id") UUID workoutId
    ) {
        return runner.markStatus(UUID.fromString(userId), workoutId, WorkoutStatus.MISSED);
    }

    private static LocalDate parseDate(String s) {
        if (s == null || s.isBlank()) return null;
        try {
            return LocalDate.parse(s);
        } catch (DateTimeParseException e) {
            return null;
        }
    }
}
