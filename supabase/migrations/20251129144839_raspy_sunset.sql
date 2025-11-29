-- Street Patrol Database Indexes
-- This script creates indexes for optimal query performance

-- Index on user_id for fast user-specific queries
CREATE INDEX IF NOT EXISTS idx_patrols_user_id ON patrols(user_id);

-- Index on start_time for chronological queries and reporting
CREATE INDEX IF NOT EXISTS idx_patrols_start_time ON patrols(start_time);

-- Index on status for filtering active vs completed patrols
CREATE INDEX IF NOT EXISTS idx_patrols_status ON patrols(status);

-- Composite index for user-specific status queries (e.g., finding active patrols for a user)
CREATE INDEX IF NOT EXISTS idx_patrols_user_status ON patrols(user_id, status);

-- Composite index for user-specific date range queries (for reports)
CREATE INDEX IF NOT EXISTS idx_patrols_user_date ON patrols(user_id, start_time);

-- Index on created_at for general chronological sorting
CREATE INDEX IF NOT EXISTS idx_patrols_created_at ON patrols(created_at);

-- Partial index for active patrols only (more efficient for active patrol queries)
CREATE INDEX IF NOT EXISTS idx_patrols_active ON patrols(user_id, start_time) 
WHERE status = 'active';

-- GIN index on statistics JSONB field for efficient JSON queries
CREATE INDEX IF NOT EXISTS idx_patrols_statistics ON patrols USING GIN(statistics);

-- GIN index on contact_statistics JSONB field for efficient JSON queries
CREATE INDEX IF NOT EXISTS idx_patrols_contact_statistics ON patrols USING GIN(contact_statistics);

-- Index on location for location-based queries
CREATE INDEX IF NOT EXISTS idx_patrols_location ON patrols(location);

-- Composite index for location and date queries
CREATE INDEX IF NOT EXISTS idx_patrols_location_date ON patrols(location, start_time);

-- Add index comments for documentation
COMMENT ON INDEX idx_patrols_user_id IS 'Fast lookup of patrols by user';
COMMENT ON INDEX idx_patrols_start_time IS 'Chronological sorting and date range queries';
COMMENT ON INDEX idx_patrols_status IS 'Filter patrols by status (active/completed)';
COMMENT ON INDEX idx_patrols_user_status IS 'User-specific status queries (e.g., active patrols for user)';
COMMENT ON INDEX idx_patrols_user_date IS 'User-specific date range queries for reports';
COMMENT ON INDEX idx_patrols_active IS 'Efficient queries for active patrols only';
COMMENT ON INDEX idx_patrols_statistics IS 'JSON queries on statistics field';
COMMENT ON INDEX idx_patrols_contact_statistics IS 'JSON queries on contact statistics field';