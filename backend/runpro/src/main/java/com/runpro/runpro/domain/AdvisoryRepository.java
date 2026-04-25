package com.runpro.runpro.domain;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import java.util.UUID;

public interface AdvisoryRepository extends JpaRepository<Advisory, UUID> {
    Optional<Advisory> findByCode(String code);
    boolean existsByCode(String code);
}
