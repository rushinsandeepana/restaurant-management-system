CREATE TABLE modifiers (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    slug        VARCHAR(255) NOT NULL UNIQUE,
    base_price  REAL         NOT NULL,
    status      VARCHAR(50)  NOT NULL DEFAULT 'ACTIVE',
    created_at  TIMESTAMP    NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP    NOT NULL DEFAULT now()
);

CREATE INDEX idx_modifiers_slug   ON modifiers (slug);
CREATE INDEX idx_modifiers_status ON modifiers (status);
CREATE INDEX idx_modifiers_name   ON modifiers (LOWER(name));