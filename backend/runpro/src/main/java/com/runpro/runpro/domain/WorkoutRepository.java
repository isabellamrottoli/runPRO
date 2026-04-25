package com.runpro.runpro.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface WorkoutRepository extends JpaRepository<Workout, UUID> {

    @Query("""
        select w from Workout w
        where w.spreadsheet.athlete.id = :athleteId
          and w.date between :start and :end
        order by w.date asc
    """)
    List<Workout> findWeek(
            @Param("athleteId") UUID athleteId,
            @Param("start") LocalDate start,
            @Param("end") LocalDate end
    );

    @Query("""
        select w from Workout w
        where w.spreadsheet.athlete.id = :athleteId
          and w.status <> com.runpro.runpro.domain.WorkoutStatus.PENDING
        order by w.date desc
        limit 1
    """)
    Optional<Workout> findLastCompletedOrMissed(@Param("athleteId") UUID athleteId);
}
