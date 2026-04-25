package com.runpro.runpro.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.List;
import java.util.UUID;

public interface SpreadsheetRepository extends JpaRepository<Spreadsheet, UUID> {
    List<Spreadsheet> findByAthleteIdOrderByStartDateDesc(UUID athleteId);
}
