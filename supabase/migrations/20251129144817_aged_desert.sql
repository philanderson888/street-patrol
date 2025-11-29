-- Street Patrol Tables Creation
-- This script creates all necessary tables for the Street Patrol application

-- Create patrols table
CREATE TABLE IF NOT EXISTS patrols (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id uuid NOT NULL,
    location text NOT NULL,
    team_leader text NOT NULL,
    team_members text NOT NULL,
    start_time timestamptz NOT NULL,
    end_time timestamptz,
    notified_police boolean DEFAULT false,
    police_cad_number text,
    status text NOT NULL DEFAULT 'active',
    statistics jsonb DEFAULT '{
        "conversations": 0,
        "prayers": 0,
        "water_bottles": 0,
        "first_aid": 0,
        "directions": 0,
        "transport_assistance": 0,
        "vulnerable_people": 0,
        "bottles_glass_collected": 0,
        "cans_collected": 0
    }'::jsonb,
    contact_statistics jsonb DEFAULT '{
        "whiteMaleUnder13": 0,
        "whiteFemaleUnder13": 0,
        "whiteMale13To17": 0,
        "whiteFemale13To17": 0,
        "whiteMale18To25": 0,
        "whiteFemale18To25": 0,
        "whiteMaleOver25": 0,
        "whiteFemaleOver25": 0,
        "afroCaribbeanMaleUnder13": 0,
        "afroCaribbeanFemaleUnder13": 0,
        "afroCaribbeanMale13To17": 0,
        "afroCaribbeanFemale13To17": 0,
        "afroCaribbeanMale18To25": 0,
        "afroCaribbeanFemale18To25": 0,
        "afroCaribbeanMaleOver25": 0,
        "afroCaribbeanFemaleOver25": 0,
        "asianMaleUnder13": 0,
        "asianFemaleUnder13": 0,
        "asianMale13To17": 0,
        "asianFemale13To17": 0,
        "asianMale18To25": 0,
        "asianFemale18To25": 0,
        "asianMaleOver25": 0,
        "asianFemaleOver25": 0,
        "easternEuropeanMaleUnder13": 0,
        "easternEuropeanFemaleUnder13": 0,
        "easternEuropeanMale13To17": 0,
        "easternEuropeanFemale13To17": 0,
        "easternEuropeanMale18To25": 0,
        "easternEuropeanFemale18To25": 0,
        "easternEuropeanMaleOver25": 0,
        "easternEuropeanFemaleOver25": 0
    }'::jsonb,
    notes text,
    created_at timestamptz DEFAULT now()
);

-- Add constraints (only if they don't exist)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_constraint
        WHERE conname = 'patrols_status_check'
        AND conrelid = 'patrols'::regclass
    ) THEN
        ALTER TABLE patrols
        ADD CONSTRAINT patrols_status_check
        CHECK (status IN ('active', 'completed'));
    END IF;
END $$;

-- Add comments for documentation
COMMENT ON TABLE patrols IS 'Main table storing patrol session data and statistics';
COMMENT ON COLUMN patrols.id IS 'Unique identifier for each patrol session';
COMMENT ON COLUMN patrols.user_id IS 'Reference to the user who created the patrol (links to auth.users)';
COMMENT ON COLUMN patrols.location IS 'Location where the patrol took place';
COMMENT ON COLUMN patrols.team_leader IS 'Name of the team leader for this patrol';
COMMENT ON COLUMN patrols.team_members IS 'Comma-separated list of team member names';
COMMENT ON COLUMN patrols.start_time IS 'When the patrol session started';
COMMENT ON COLUMN patrols.end_time IS 'When the patrol session ended (NULL for active patrols)';
COMMENT ON COLUMN patrols.notified_police IS 'Whether police were notified about this patrol';
COMMENT ON COLUMN patrols.police_cad_number IS 'Police CAD reference number if applicable';
COMMENT ON COLUMN patrols.status IS 'Current status of the patrol (active/completed)';
COMMENT ON COLUMN patrols.statistics IS 'JSON object containing patrol activity statistics';
COMMENT ON COLUMN patrols.contact_statistics IS 'JSON object containing demographic contact data';
COMMENT ON COLUMN patrols.notes IS 'Free-text notes about the patrol session';
COMMENT ON COLUMN patrols.created_at IS 'Timestamp when the record was created';