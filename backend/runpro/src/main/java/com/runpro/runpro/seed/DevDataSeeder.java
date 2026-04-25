package com.runpro.runpro.seed;

import com.runpro.runpro.domain.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.time.temporal.TemporalAdjusters;
import java.util.List;

@Component
public class DevDataSeeder implements CommandLineRunner {

    private static final String DEMO_PASSWORD = "s3nha123";
    private static final String DEMO_CODE = "DEMO01";

    private final AdvisoryRepository advisories;
    private final UserRepository users;
    private final SpreadsheetRepository spreadsheets;
    private final WorkoutRepository workouts;
    private final GoalRepository goals;
    private final JoinRequestRepository joinRequests;
    private final PasswordEncoder encoder;

    public DevDataSeeder(
            AdvisoryRepository advisories,
            UserRepository users,
            SpreadsheetRepository spreadsheets,
            WorkoutRepository workouts,
            GoalRepository goals,
            JoinRequestRepository joinRequests,
            PasswordEncoder encoder
    ) {
        this.advisories = advisories;
        this.users = users;
        this.spreadsheets = spreadsheets;
        this.workouts = workouts;
        this.goals = goals;
        this.joinRequests = joinRequests;
        this.encoder = encoder;
    }

    @Override
    @Transactional
    public void run(String... args) {
        if (users.existsByEmail("isa@runpro.dev")) return;

        Advisory advisory = save(advisories, build(new Advisory(), a -> {
            a.setName("Runpro Demo");
            a.setCode(DEMO_CODE);
        }));

        User coach = save(users, build(new User(), u -> {
            u.setName("Isabella Rottoli");
            u.setEmail("isa@runpro.dev");
            u.setPassword(encoder.encode(DEMO_PASSWORD));
            u.setRole(UserRole.COACH);
            u.setCref("123-G/SP");
            u.setAdvisory(advisory);
        }));

        User ana = save(users, athlete(advisory, "Ana Souza", "ana@runpro.dev"));
        User bruno = save(users, athlete(advisory, "Bruno Lima", "bruno@runpro.dev"));
        User carla = save(users, athlete(advisory, "Carla Dias", "carla@runpro.dev"));

        seedWeekFor(ana, coach, advisory);
        seedWeekFor(bruno, coach, advisory);

        // Pending join request from Carla
        save(joinRequests, build(new JoinRequest(), jr -> {
            jr.setAthlete(carla);
            jr.setCoach(coach);
            jr.setAdvisory(advisory);
            jr.setStatus(JoinRequestStatus.PENDING);
        }));

        // Next race goal (for coach home "Próxima corrida")
        save(goals, raceGoal(ana, coach, advisory, 5.0));
        save(goals, raceGoal(bruno, coach, advisory, 10.0));
    }

    private User athlete(Advisory advisory, String name, String email) {
        User u = new User();
        u.setName(name);
        u.setEmail(email);
        u.setPassword(encoder.encode(DEMO_PASSWORD));
        u.setRole(UserRole.ATHLETE);
        u.setAdvisory(advisory);
        return u;
    }

    private void seedWeekFor(User athlete, User coach, Advisory advisory) {
        LocalDate today = LocalDate.now();
        LocalDate weekStart = today.with(TemporalAdjusters.previousOrSame(DayOfWeek.SUNDAY));
        LocalDate weekEnd = weekStart.plusDays(6);

        Spreadsheet sheet = save(spreadsheets, build(new Spreadsheet(), s -> {
            s.setName("Base de corrida");
            s.setDescription("Plano base da semana");
            s.setType(SpreadsheetType.RUNNING);
            s.setStartDate(weekStart);
            s.setEndDate(weekEnd);
            s.setCoach(coach);
            s.setAthlete(athlete);
            s.setAdvisory(advisory);
        }));

        String[] names = {"Regenerativo", "Tempo", "Long run", "Tiros", "Fartlek", "Força", "Long run"};
        String[] descriptions = {
                "Corrida leve 30min em ritmo confortável.",
                "3km aquecimento + 5x1km pace 5:30 + 2km desaquecimento.",
                "12km em ritmo de conversa.",
                "1km aquec + 8x400m fortes + 1km desaquec.",
                "10 min aquec leve, 5km pace 6:00/km, 5 min alongamento.",
                "Circuito funcional: agachamento, prancha, avanço — 4 séries.",
                "15km em ritmo constante."
        };

        for (int i = 0; i < 7; i++) {
            LocalDate date = weekStart.plusDays(i);
            WorkoutStatus status;
            if (date.isBefore(today)) {
                status = (i % 3 == 2) ? WorkoutStatus.MISSED : WorkoutStatus.COMPLETED;
            } else {
                status = WorkoutStatus.PENDING;
            }
            final WorkoutStatus finalStatus = status;
            final int idx = i;
            save(workouts, build(new Workout(), w -> {
                w.setName(names[idx]);
                w.setDescription(descriptions[idx]);
                w.setDate(date);
                w.setStatus(finalStatus);
                w.setSpreadsheet(sheet);
            }));
        }

        save(goals, build(new Goal(), g -> {
            g.setDescription("Correr 12km esta semana");
            g.setType(GoalType.DISTANCE);
            g.setTargetValue(12.0);
            g.setCurrentValue(8.0);
            g.setDeadline(weekEnd);
            g.setOrigin(GoalOrigin.COACH);
            g.setCoach(coach);
            g.setAthlete(athlete);
            g.setAdvisory(advisory);
        }));
    }

    private Goal raceGoal(User athlete, User coach, Advisory advisory, double km) {
        Goal g = new Goal();
        g.setDescription("Corrida de " + (int) km + "km");
        g.setType(GoalType.DISTANCE);
        g.setTargetValue(km);
        g.setCurrentValue(0.0);
        g.setDeadline(LocalDate.now().plusMonths(2));
        g.setOrigin(GoalOrigin.COACH);
        g.setCoach(coach);
        g.setAthlete(athlete);
        g.setAdvisory(advisory);
        return g;
    }

    private static <T> T build(T entity, java.util.function.Consumer<T> fill) {
        fill.accept(entity);
        return entity;
    }

    private static <T, R extends org.springframework.data.repository.CrudRepository<T, ?>> T save(R repo, T entity) {
        return repo.save(entity);
    }
}
