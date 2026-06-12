CREATE TABLE meals (
    id          BIGSERIAL PRIMARY KEY,
    name        VARCHAR(255) NOT NULL,
    image_url   VARCHAR(512),
    quantity    INTEGER NOT NULL DEFAULT 0,
    base_price  DECIMAL(10, 2) NOT NULL,
    created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TABLE meal_variations (
    id                BIGSERIAL PRIMARY KEY,
    meal_id           BIGINT NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    name              VARCHAR(100) NOT NULL,
    price_adjustment  DECIMAL(10, 2) NOT NULL DEFAULT 0
);

CREATE INDEX idx_meals_name ON meals(name);
CREATE INDEX idx_meals_created_at ON meals(created_at DESC);
CREATE INDEX idx_meal_variations_meal_id ON meal_variations(meal_id);
