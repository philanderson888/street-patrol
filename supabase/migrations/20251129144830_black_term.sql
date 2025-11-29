-- Street Patrol Row Level Security Policies
-- This script sets up RLS policies for secure data access

-- Enable Row Level Security on patrols table
ALTER TABLE patrols ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only read their own patrols
CREATE POLICY "Users can read own patrols" ON patrols
    FOR SELECT
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Users can only insert patrols for themselves
CREATE POLICY "Users can insert own patrols" ON patrols
    FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can only update their own patrols
CREATE POLICY "Users can update own patrols" ON patrols
    FOR UPDATE
    TO authenticated
    USING (auth.uid() = user_id);

-- Policy: Users can only delete their own patrols (optional - currently not used in app)
CREATE POLICY "Users can delete own patrols" ON patrols
    FOR DELETE
    TO authenticated
    USING (auth.uid() = user_id);

-- Grant necessary permissions to authenticated users
GRANT SELECT, INSERT, UPDATE, DELETE ON patrols TO authenticated;
GRANT USAGE ON SEQUENCE patrols_id_seq TO authenticated;

-- Grant read access to anon users (for public data if needed)
-- Currently not used but included for completeness
-- GRANT SELECT ON patrols TO anon;

-- Create function to get current user ID (helper function)
CREATE OR REPLACE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  SELECT 
    COALESCE(
        nullif(current_setting('request.jwt.claim.sub', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
    )::uuid
$$;

-- Create function to get current user role (helper function)
CREATE OR REPLACE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  SELECT 
    COALESCE(
        nullif(current_setting('request.jwt.claim.role', true), ''),
        (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
    )::text
$$;

-- Add additional security: Prevent users from modifying user_id after creation
CREATE OR REPLACE FUNCTION prevent_user_id_change()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.user_id IS DISTINCT FROM NEW.user_id THEN
        RAISE EXCEPTION 'Cannot change user_id of existing patrol';
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER prevent_user_id_change_trigger
    BEFORE UPDATE ON patrols
    FOR EACH ROW
    EXECUTE FUNCTION prevent_user_id_change();