package com.runpro.runpro.domain;

import jakarta.persistence.*;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "goal")
public class Goal {

    @Id
    @GeneratedValue
    private UUID id;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String description;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GoalType type;

    @Column(name = "target_value", nullable = false)
    private double targetValue;

    @Column(name = "current_value", nullable = false)
    private double currentValue = 0.0;

    private LocalDate deadline;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 16)
    private GoalStatus status = GoalStatus.IN_PROGRESS;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 24)
    private GoalOrigin origin;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "coach_id", nullable = false)
    private User coach;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "athlete_id", nullable = false)
    private User athlete;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "advisory_id", nullable = false)
    private Advisory advisory;

    public UUID getId() { return id; }
    public void setId(UUID id) { this.id = id; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public GoalType getType() { return type; }
    public void setType(GoalType type) { this.type = type; }
    public double getTargetValue() { return targetValue; }
    public void setTargetValue(double targetValue) { this.targetValue = targetValue; }
    public double getCurrentValue() { return currentValue; }
    public void setCurrentValue(double currentValue) { this.currentValue = currentValue; }
    public LocalDate getDeadline() { return deadline; }
    public void setDeadline(LocalDate deadline) { this.deadline = deadline; }
    public GoalStatus getStatus() { return status; }
    public void setStatus(GoalStatus status) { this.status = status; }
    public GoalOrigin getOrigin() { return origin; }
    public void setOrigin(GoalOrigin origin) { this.origin = origin; }
    public User getCoach() { return coach; }
    public void setCoach(User coach) { this.coach = coach; }
    public User getAthlete() { return athlete; }
    public void setAthlete(User athlete) { this.athlete = athlete; }
    public Advisory getAdvisory() { return advisory; }
    public void setAdvisory(Advisory advisory) { this.advisory = advisory; }
}
