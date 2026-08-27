CREATE TABLE IF NOT EXISTS food_cases (
  id TEXT PRIMARY KEY,
  public_reference TEXT NOT NULL UNIQUE,
  category TEXT NOT NULL CHECK (category IN ('packaged','premises','delivery','illness')),
  status TEXT NOT NULL,
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS food_submissions (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES food_cases(id),
  payload JSONB NOT NULL,
  created_at TIMESTAMPTZ NOT NULL
);

CREATE TABLE IF NOT EXISTS food_events (
  id TEXT PRIMARY KEY,
  case_id TEXT NOT NULL REFERENCES food_cases(id),
  type TEXT NOT NULL,
  actor_id TEXT NOT NULL,
  actor_role TEXT NOT NULL,
  visibility TEXT NOT NULL CHECK (visibility IN ('public','private')),
  reason_code TEXT,
  payload JSONB,
  occurred_at TIMESTAMPTZ NOT NULL
);

CREATE INDEX IF NOT EXISTS food_cases_updated_idx ON food_cases (updated_at DESC);
CREATE INDEX IF NOT EXISTS food_cases_category_status_idx ON food_cases (category, status);
CREATE INDEX IF NOT EXISTS food_events_case_time_idx ON food_events (case_id, occurred_at);
