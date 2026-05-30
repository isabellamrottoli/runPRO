package com.runpro.runpro.coach;

import com.runpro.runpro.domain.*;
import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

@Service
public class CoachService {

    private final UserRepository users;
    private final JoinRequestRepository joinRequests;
    private final WorkoutRepository workouts;
    private final GoalRepository goals;

    public CoachService(
            UserRepository users,
            JoinRequestRepository joinRequests,
            WorkoutRepository workouts,
            GoalRepository goals
    ) {
        this.users = users;
        this.joinRequests = joinRequests;
        this.workouts = workouts;
        this.goals = goals;
    }

    @Transactional(readOnly = true)
    public CoachDtos.AdvisoryDto getAdvisory(UUID coachId) {
        User coach = requireCoach(coachId);
        Advisory adv = coach.getAdvisory();
        return new CoachDtos.AdvisoryDto(adv.getId().toString(), adv.getName(), adv.getCode());
    }

    @Transactional(readOnly = true)
    public List<CoachDtos.JoinRequestDto> listPendingRequests(UUID coachId) {
        User coach = requireCoach(coachId);
        List<JoinRequest> requests = joinRequests.findByAdvisoryIdAndStatusOrderByRequestedAtAsc(
                coach.getAdvisory().getId(), JoinRequestStatus.PENDING);
        return requests.stream().map(r -> new CoachDtos.JoinRequestDto(
                r.getId().toString(),
                r.getAthlete().getId().toString(),
                r.getAthlete().getName(),
                "Quer entrar na consultoria",
                r.getRequestedAt()
        )).toList();
    }

    @Transactional
    public void approve(UUID coachId, UUID requestId) {
        JoinRequest req = resolveOwnedRequest(coachId, requestId);
        req.setStatus(JoinRequestStatus.APPROVED);
        req.setRespondedAt(Instant.now());
        User athlete = req.getAthlete();
        athlete.setAdvisory(req.getAdvisory());
    }

    @Transactional
    public void reject(UUID coachId, UUID requestId) {
        JoinRequest req = resolveOwnedRequest(coachId, requestId);
        req.setStatus(JoinRequestStatus.REJECTED);
        req.setRespondedAt(Instant.now());
    }

    @Transactional(readOnly = true)
    public List<CoachDtos.AthleteListItemDto> listAthletes(UUID coachId) {
        User coach = requireCoach(coachId);
        UUID advisoryId = coach.getAdvisory().getId();
        LocalDate raceFrom = LocalDate.now().plusDays(8);
        LocalDate farFuture = raceFrom.plusYears(5);

        return users.findByAdvisoryIdAndRoleOrderByNameAsc(advisoryId, UserRole.ATHLETE).stream()
                .map(athlete -> new CoachDtos.AthleteListItemDto(
                        athlete.getId().toString(),
                        athlete.getName(),
                        nextRaceLabel(athlete.getId(), raceFrom, farFuture),
                        lastTrainingStatus(athlete.getId())
                ))
                .toList();
    }

    private String nextRaceLabel(UUID athleteId, LocalDate from, LocalDate to) {
        return goals.findNearestInWindow(athleteId, from, to)
                .filter(g -> g.getType() == GoalType.DISTANCE)
                .map(g -> formatDistance(g.getTargetValue()))
                .orElse(null);
    }

    private Boolean lastTrainingStatus(UUID athleteId) {
        Optional<Workout> last = workouts.findLastCompletedOrMissed(athleteId);
        return last.map(w -> w.getStatus() == WorkoutStatus.COMPLETED).orElse(null);
    }

    private static String formatDistance(double km) {
        if (km == Math.floor(km)) return (int) km + "km";
        return km + "km";
    }

    private JoinRequest resolveOwnedRequest(UUID coachId, UUID requestId) {
        User coach = requireCoach(coachId);
        JoinRequest req = joinRequests.findById(requestId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Solicitação não encontrada."));
        if (!req.getAdvisory().getId().equals(coach.getAdvisory().getId())) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Solicitação de outra assessoria.");
        }
        if (req.getStatus() != JoinRequestStatus.PENDING) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Solicitação já foi respondida.");
        }
        return req;
    }

    private User requireCoach(UUID coachId) {
        User user = users.findById(coachId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED));
        if (user.getRole() != UserRole.COACH) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Acesso restrito a coach.");
        }
        return user;
    }
}
