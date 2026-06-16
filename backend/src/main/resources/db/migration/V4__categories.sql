CREATE TABLE categories (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255)  NOT NULL,
    slug        VARCHAR(255)  NOT NULL UNIQUE,
    description TEXT,
    status      VARCHAR(50)   NOT NULL DEFAULT 'ACTIVE',
    image_url   VARCHAR(512),
    created_at  TIMESTAMP     NOT NULL DEFAULT now(),
    updated_at  TIMESTAMP     NOT NULL DEFAULT now()
);

CREATE INDEX idx_categories_slug   ON categories (slug);
CREATE INDEX idx_categories_status ON categories (status);
CREATE INDEX idx_categories_name   ON categories (LOWER(name));