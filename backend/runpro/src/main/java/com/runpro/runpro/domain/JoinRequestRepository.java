package com.runpro.runpro.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface JoinRequestRepository extends JpaRepository<JoinRequest, UUID> {
    List<JoinRequest> findByCoachIdAndStatusOrderByRequestedAtAsc(UUID coachId, JoinRequestStatus status);
    List<JoinRequest> findByAdvisoryIdAndStatusOrderByRequestedAtAsc(UUID advisoryId, JoinRequestStatus status);
}
