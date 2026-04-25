package com.runpro.runpro.coach;

import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/coach")
public class CoachController {

    private final CoachService coach;

    public CoachController(CoachService coach) {
        this.coach = coach;
    }

    @GetMapping("/advisory")
    public CoachDtos.AdvisoryDto advisory(@AuthenticationPrincipal String userId) {
        return coach.getAdvisory(UUID.fromString(userId));
    }

    @GetMapping("/join-requests")
    public List<CoachDtos.JoinRequestDto> joinRequests(@AuthenticationPrincipal String userId) {
        return coach.listPendingRequests(UUID.fromString(userId));
    }

    @PostMapping("/join-requests/{id}/approve")
    public ResponseEntity<Void> approve(
            @AuthenticationPrincipal String userId,
            @PathVariable("id") UUID requestId
    ) {
        coach.approve(UUID.fromString(userId), requestId);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/join-requests/{id}/reject")
    public ResponseEntity<Void> reject(
            @AuthenticationPrincipal String userId,
            @PathVariable("id") UUID requestId
    ) {
        coach.reject(UUID.fromString(userId), requestId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/athletes")
    public List<CoachDtos.AthleteListItemDto> athletes(@AuthenticationPrincipal String userId) {
        return coach.listAthletes(UUID.fromString(userId));
    }
}
