package com.runpro.runpro.runner;

import com.runpro.runpro.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.*;

@Service
public class RunnerService {

    private final UserRepository users;
    private final WorkoutRepository workouts;
    private final GoalRepository goals;

    public RunnerService(UserRepository users, WorkoutRepository workouts, GoalRepository goals) {
        this.users = users;
        this.workouts = workouts;
        this.goals = goals;
    }

    @Transactional(readOnly = true)
    public RunnerDtos.WeekDto week(UUID athleteId, LocalDate reference) {
        requireAthlete(athleteId);
        LocalDate ref = reference != null ? reference : LocalDate.now();
        LocalDate start = ref.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate end = start.plusDays(6);

        List<Workout> weekWorkouts = workouts.findWeek(athleteId, start, end);
        Map<LocalDate, Workout> byDate = new HashMap<>();
        for (Workout w : weekWorkouts) byDate.put(w.getDate(), w);

        List<RunnerDtos.DayDto> days = new ArrayList<>(7);
        for (int i = 0; i < 7; i++) {
            LocalDate d = start.plusDays(i);
            Workout w = byDate.get(d);
            if (w == null) {
                days.add(new RunnerDtos.DayDto(d, null, null, null, null));
            } else {
                days.add(new RunnerDtos.DayDto(
                        d,
                        w.getId().toString(),
                        w.getName(),
                        w.getSpreadsheet().getType().name(),
                        w.getStatus().name()
                ));
            }
        }
        return new RunnerDtos.WeekDto(start, end, days);
    }

    @Transactional(readOnly = true)
    public RunnerDtos.WorkoutDto workout(UUID athleteId, UUID workoutId) {
        requireAthlete(athleteId);
        Workout w = workouts.findById(workoutId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!w.getSpreadsheet().getAthlete().getId().equals(athleteId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        return new RunnerDtos.WorkoutDto(
                w.getId().toString(),
                w.getName(),
                w.getDescription(),
                w.getDate(),
                w.getSpreadsheet().getType().name(),
                w.getStatus().name()
        );
    }

    @Transactional(readOnly = true)
    public Optional<RunnerDtos.WeeklyGoalDto> weeklyGoal(UUID athleteId) {
        requireAthlete(athleteId);
        LocalDate today = LocalDate.now();
        LocalDate end = today.with(TemporalAdjusters.nextOrSame(DayOfWeek.SATURDAY));
        return goals.findNearestInWindow(athleteId, today, end)
                .map(g -> new RunnerDtos.WeeklyGoalDto(
                        g.getId().toString(),
                        g.getDescription(),
                        g.getType().name(),
                        g.getCurrentValue(),
                        g.getTargetValue(),
                        unitFor(g.getType()),
                        g.getDeadline()
                ));
    }

    @Transactional
    public RunnerDtos.WorkoutDto markStatus(UUID athleteId, UUID workoutId, WorkoutStatus status) {
        requireAthlete(athleteId);
        Workout w = workouts.findById(workoutId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND));
        if (!w.getSpreadsheet().getAthlete().getId().equals(athleteId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN);
        }
        w.setStatus(status);
        return new RunnerDtos.WorkoutDto(
                w.getId().toString(),
                w.getName(),
                w.getDescription(),
                w.getDate(),
                w.getSpreadsheet().getType().name(),
                w.getStatus().name()
        );
    }

    private static String unitFor(GoalType type) {
        return switch (type) {
            case DISTANCE -> "km";
            case TIME -> "min";
            case FREQUENCY -> "treinos";
            case PACE -> "min/km";
        };
    }

    private User requireAthlete(UUID athleteId) {
        User u = users.findById(athleteId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (u.getRole() != UserRole.ATHLETE) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso restrito a atleta.");
        }
        return u;
    }
}
