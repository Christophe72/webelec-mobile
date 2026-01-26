CREATE TABLE technician_teams (
    id BIGINT IDENTITY(1, 1) PRIMARY KEY,
    code VARCHAR(64) NOT NULL UNIQUE,
    name VARCHAR(255) NOT NULL,
    description VARCHAR(512)
);

CREATE TABLE technician_team_assignments (
    id BIGINT IDENTITY(1, 1) PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    team_id BIGINT NOT NULL REFERENCES technician_teams(id) ON DELETE CASCADE,
    assigned_at DATE NOT NULL DEFAULT CONVERT(date, GETDATE()),
    ended_at DATE,
    CONSTRAINT uq_team_assignment UNIQUE (user_id, team_id, assigned_at)
);

CREATE TABLE rgie_habilitations (
    id BIGINT IDENTITY(1, 1) PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    label VARCHAR(255) NOT NULL,
    certificate_number VARCHAR(100),
    authority_level VARCHAR(100),
    valid_from DATE,
    valid_until DATE NOT NULL
);

CREATE TABLE user_notifications (
    id BIGINT IDENTITY(1, 1) PRIMARY KEY,
    user_id BIGINT NOT NULL REFERENCES utilisateurs(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    message VARCHAR(1024),
    is_read BIT NOT NULL DEFAULT 0,
    created_at DATETIME2 NOT NULL DEFAULT SYSDATETIME(),
    read_at DATETIME2
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
    WHERE is_read = 0;
