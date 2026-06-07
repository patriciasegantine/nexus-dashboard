-- Add slug as nullable first to allow data migration
ALTER TABLE "Project" ADD COLUMN "slug" TEXT;

-- Populate slug from name: lowercase, spaces → hyphens, remove special chars
UPDATE "Project"
SET "slug" = LOWER(
  TRIM(
    REGEXP_REPLACE(
      REGEXP_REPLACE("name", '[^a-zA-Z0-9\s-]', '', 'g'),
      '\s+', '-', 'g'
    )
  )
);

-- Fallback for any empty slug (name was all special chars)
UPDATE "Project" SET "slug" = "id" WHERE "slug" IS NULL OR "slug" = '';

-- Resolve duplicate slugs by appending -1, -2, etc.
WITH ranked AS (
  SELECT "id", "slug",
    ROW_NUMBER() OVER (PARTITION BY "slug" ORDER BY "createdAt") AS rn
  FROM "Project"
)
UPDATE "Project" p
SET "slug" = CASE
  WHEN r.rn > 1 THEN r."slug" || '-' || (r.rn - 1)::text
  ELSE r."slug"
END
FROM ranked r
WHERE p."id" = r."id";

-- Make NOT NULL and add UNIQUE constraint
ALTER TABLE "Project" ALTER COLUMN "slug" SET NOT NULL;
CREATE UNIQUE INDEX "Project_slug_key" ON "Project"("slug");
