package com.runpro.runpro.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "workout")
public class Workout {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(length = 100)
    private String name;

    @Column(nullable = false)
    private LocalDate date;

    @Column(columnDefinition = "TEXT")
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private WorkoutStatus status = WorkoutStatus.PENDING;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "spreadsheet_id", nullable = false)
    private Spreadsheet spreadsheet;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public WorkoutStatus getStatus() { return status; }
    public void setStatus(WorkoutStatus status) { this.status = status; }
    public Spreadsheet getSpreadsheet() { return spreadsheet; }
    public void setSpreadsheet(Spreadsheet spreadsheet) { this.spreadsheet = spreadsheet; }
}
