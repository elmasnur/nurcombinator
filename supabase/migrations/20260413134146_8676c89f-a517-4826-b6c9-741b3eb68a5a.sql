-- Add tsvector column to projects
ALTER TABLE public.projects ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(summary, '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'C')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_projects_fts ON public.projects USING GIN(fts);

-- Add tsvector column to open_calls
ALTER TABLE public.open_calls ADD COLUMN IF NOT EXISTS fts tsvector
  GENERATED ALWAYS AS (
    setweight(to_tsvector('simple', coalesce(title, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(description, '')), 'B')
  ) STORED;

CREATE INDEX IF NOT EXISTS idx_open_calls_fts ON public.open_calls USING GIN(fts);