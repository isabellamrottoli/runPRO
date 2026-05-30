CREATE TABLE advisory (
    id         UUID         NOT NULL,
    name       VARCHAR(100) NOT NULL,
    code       VARCHAR(20)  NOT NULL,
    created_at TIMESTAMP(6) NOT NULL,
    CONSTRAINT pk_advisory PRIMARY KEY (id),
    CONSTRAINT uq_advisory_code UNIQUE (code)
);

CREATE TABLE app_user (
    id          UUID         NOT NULL,
    name        VARCHAR(100) NOT NULL,
    email       VARCHAR(100) NOT NULL,
    password    VARCHAR(255) NOT NULL,
    role        VARCHAR(16)  NOT NULL,
    cref        VARCHAR(15),
    created_at  TIMESTAMP(6) NOT NULL,
    advisory_id UUID         NOT NULL,
    CONSTRAINT pk_app_user PRIMARY KEY (id),
    CONSTRAINT uq_app_user_email UNIQUE (email),
    CONSTRAINT fk_app_user_advisory FOREIGN KEY (advisory_id) REFERENCES advisory (id)
);

CREATE TABLE spreadsheet (
    id          UUID         NOT NULL,
    name        VARCHAR(100) NOT NULL,
    description TEXT,
    type        VARCHAR(16)  NOT NULL,
    start_date  DATE         NOT NULL,
    end_date    DATE         NOT NULL,
    coach_id    UUID         NOT NULL,
    athlete_id  UUID         NOT NULL,
    advisory_id UUID         NOT NULL,
    CONSTRAINT pk_spreadsheet PRIMARY KEY (id),
    CONSTRAINT fk_spreadsheet_coach FOREIGN KEY (coach_id) REFERENCES app_user (id),
    CONSTRAINT fk_spreadsheet_athlete FOREIGN KEY (athlete_id) REFERENCES app_user (id),
    CONSTRAINT fk_spreadsheet_advisory FOREIGN KEY (advisory_id) REFERENCES advisory (id)
);

CREATE TABLE workout (
    id             UUID         NOT NULL,
    name           VARCHAR(100),
    date           DATE         NOT NULL,
    description    TEXT,
    status         VARCHAR(16)  NOT NULL,
    spreadsheet_id UUID         NOT NULL,
    CONSTRAINT pk_workout PRIMARY KEY (id),
    CONSTRAINT fk_workout_spreadsheet FOREIGN KEY (spreadsheet_id) REFERENCES spreadsheet (id)
);

CREATE TABLE goal (
    id            UUID             NOT NULL,
    description   TEXT             NOT NULL,
    type          VARCHAR(16)      NOT NULL,
    target_value  DOUBLE PRECISION NOT NULL,
    current_value DOUBLE PRECISION NOT NULL,
    deadline      DATE,
    status        VARCHAR(16)      NOT NULL,
    origin        VARCHAR(24)      NOT NULL,
    coach_id      UUID             NOT NULL,
    athlete_id    UUID             NOT NULL,
    advisory_id   UUID             NOT NULL,
    CONSTRAINT pk_goal PRIMARY KEY (id),
    CONSTRAINT fk_goal_coach FOREIGN KEY (coach_id) REFERENCES app_user (id),
    CONSTRAINT fk_goal_athlete FOREIGN KEY (athlete_id) REFERENCES app_user (id),
    CONSTRAINT fk_goal_advisory FOREIGN KEY (advisory_id) REFERENCES advisory (id)
);

CREATE TABLE join_request (
    id           UUID         NOT NULL,
    status       VARCHAR(16)  NOT NULL,
    requested_at TIMESTAMP(6) NOT NULL,
    responded_at TIMESTAMP(6),
    athlete_id   UUID         NOT NULL,
    coach_id     UUID         NOT NULL,
    advisory_id  UUID         NOT NULL,
    CONSTRAINT pk_join_request PRIMARY KEY (id),
    CONSTRAINT fk_join_request_athlete FOREIGN KEY (athlete_id) REFERENCES app_user (id),
    CONSTRAINT fk_join_request_coach FOREIGN KEY (coach_id) REFERENCES app_user (id),
    CONSTRAINT fk_join_request_advisory FOREIGN KEY (advisory_id) REFERENCES advisory (id)
);
