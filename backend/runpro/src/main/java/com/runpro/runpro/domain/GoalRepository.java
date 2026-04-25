package com.runpro.runpro.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.Optional;
import java.util.UUID;

public interface GoalRepository extends JpaRepository<Goal, UUID> {

    @Query("""
        select g from Goal g
        where g.athlete.id = :athleteId
          and g.deadline is not null
          and g.deadline >= :from
          and g.deadline <= :to
        order by g.deadline asc
        limit 1
    """)
    Optional<Goal> findNearestInWindow(
            @Param("athleteId") UUID athleteId,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );
}
