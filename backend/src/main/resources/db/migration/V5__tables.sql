CREATE TABLE tables (
    id         BIGSERIAL    PRIMARY KEY,
    name       VARCHAR(255) NOT NULL UNIQUE,
    status     VARCHAR(50)  NOT NULL DEFAULT 'AVAILABLE',
    created_at TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_tables_name   ON tables (LOWER(name));
CREATE INDEX idx_tables_status ON tables (status);
