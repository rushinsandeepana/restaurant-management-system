ALTER TABLE meals
    ADD COLUMN IF NOT EXISTS category_id BIGINT REFERENCES categories(id) ON DELETE SET NULL,
    ADD COLUMN IF NOT EXISTS description TEXT,
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE';

UPDATE meals
SET status = 'ACTIVE'
WHERE status IS NULL;

ALTER TABLE meals
    ALTER COLUMN status SET DEFAULT 'ACTIVE';

DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'meal_variations' AND column_name = 'price_adjustment') THEN
        ALTER TABLE meal_variations
            ADD COLUMN IF NOT EXISTS price DECIMAL(10, 2);

        UPDATE meal_variations
        SET price = COALESCE(price_adjustment, 0)
        WHERE price IS NULL;

        ALTER TABLE meal_variations
            ALTER COLUMN price SET NOT NULL;

        ALTER TABLE meal_variations
            DROP COLUMN IF EXISTS price_adjustment;
    END IF;
END $$;

ALTER TABLE meal_variations
    ADD COLUMN IF NOT EXISTS status VARCHAR(50) NOT NULL DEFAULT 'ACTIVE';

CREATE TABLE IF NOT EXISTS meal_modifiers (
    meal_id     BIGINT NOT NULL REFERENCES meals(id) ON DELETE CASCADE,
    modifier_id BIGINT NOT NULL REFERENCES modifiers(id) ON DELETE CASCADE,
    PRIMARY KEY (meal_id, modifier_id)
);

CREATE INDEX IF NOT EXISTS idx_meal_modifiers_modifier_id
    ON meal_modifiers (modifier_id);

CREATE INDEX IF NOT EXISTS idx_meals_category_id
    ON meals (category_id);

CREATE INDEX IF NOT EXISTS idx_meals_status
    ON meals (status);

CREATE INDEX IF NOT EXISTS idx_meal_variations_status
    ON meal_variations (status);
