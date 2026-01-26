CREATE TABLE technician_teams (
    id BIGSERIAL PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(512)
);

CREATE TABLE technician_team_assignments (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    team_id BIGINT NOT NULL REFERENCES technician_teams(id) ON DELETE CASCADE,
    assigned_at DATE NOT NULL DEFAULT CURRENT_DATE,
    ended_at DATE,
    CONSTRAINT uq_team_assignment UNIQUE (user_id, team_id, assigned_at)
);

CREATE TABLE rgie_habilitations (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    certificate_number VARCHAR(100),
    authority_level VARCHAR(100),
    valid_from DATE,
    valid_until DATE NOT NULL
);

CREATE TABLE user_notifications (
    id BIGSERIAL PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message VARCHAR(1024),
    is_read BOOLEAN NOT NULL DEFAULT FALSE,
    created_at TIMESTAMP WITHOUT TIME ZONE NOT NULL DEFAULT NOW(),
    read_at TIMESTAMP WITHOUT TIME ZONE
);

CREATE INDEX idx_team_assignments_user_active
    ON technician_team_assignments (user_id)
    WHERE ended_at IS NULL;

CREATE INDEX idx_rgie_habilitations_user
    ON rgie_habilitations (user_id);

CREATE INDEX idx_user_notifications_user
    ON user_notifications (user_id);

CREATE INDEX idx_user_notifications_unread
    ON user_notifications (user_id)
    WHERE is_read = FALSE;
