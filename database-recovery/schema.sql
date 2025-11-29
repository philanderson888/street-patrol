-- Street Patrol Database Schema
-- Complete database recreation script
-- This script creates the entire database structure from scratch

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create patrols table
CREATE TABLE IF NOT EXISTS patrols (
  id uuid NOT NULL,
  user_id uuid NOT NULL,
  location text NOT NULL,
  team_leader text NOT NULL,
  team_members text NOT NULL,
  start_time timestamp with time zone NOT NULL,
  end_time timestamp with time zone,
  notified_police boolean NOT NULL DEFAULT false,
  status text NOT NULL CHECK (status = ANY (ARRAY['active'::text, 'completed'::text])),
  statistics jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamp with time zone DEFAULT now(),
  police_cad_number text,
  contact_statistics jsonb DEFAULT '{"asianMale13To17": 0, "asianMale18To25": 0, "asianMaleOver25": 0, "whiteMale13To17": 0, "whiteMale18To25": 0, "whiteMaleOver25": 0, "asianMaleUnder13": 0, "whiteMaleUnder13": 0, "asianFemale13To17": 0, "asianFemale18To25": 0, "asianFemaleOver25": 0, "whiteFemale13To17": 0, "whiteFemale18To25": 0, "whiteFemaleOver25": 0, "asianFemaleUnder13": 0, "whiteFemaleUnder13": 0, "afroCaribbeanMale13To17": 0, "afroCaribbeanMale18To25": 0, "afroCaribbeanMaleOver25": 0, "afroCaribbeanMaleUnder13": 0, "afroCaribbeanFemale13To17": 0, "afroCaribbeanFemale18To25": 0, "afroCaribbeanFemaleOver25": 0, "easternEuropeanMale13To17": 0, "easternEuropeanMale18To25": 0, "easternEuropeanMaleOver25": 0, "afroCaribbeanFemaleUnder13": 0, "easternEuropeanMaleUnder13": 0, "easternEuropeanFemale13To17": 0, "easternEuropeanFemale18To25": 0, "easternEuropeanFemaleOver25": 0, "easternEuropeanFemaleUnder13": 0}'::jsonb,
  CONSTRAINT patrols_pkey PRIMARY KEY (id),
  CONSTRAINT patrols_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id)
);

-- Enable Row Level Security
ALTER TABLE patrols ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can read own patrols" ON patrols
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patrols" ON patrols
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patrols" ON patrols
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own patrols" ON patrols
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_patrols_user_id ON patrols(user_id);
CREATE INDEX IF NOT EXISTS idx_patrols_start_time ON patrols(start_time);
CREATE INDEX IF NOT EXISTS idx_patrols_status ON patrols(status);
CREATE INDEX IF NOT EXISTS idx_patrols_user_status ON patrols(user_id, status);
CREATE INDEX IF NOT EXISTS idx_patrols_user_date ON patrols(user_id, start_time);
CREATE INDEX IF NOT EXISTS idx_patrols_created_at ON patrols(created_at);
CREATE INDEX IF NOT EXISTS idx_patrols_active ON patrols(user_id, start_time) WHERE status = 'active';
CREATE INDEX IF NOT EXISTS idx_patrols_statistics ON patrols USING GIN(statistics);
CREATE INDEX IF NOT EXISTS idx_patrols_contact_statistics ON patrols USING GIN(contact_statistics);
CREATE INDEX IF NOT EXISTS idx_patrols_location ON patrols(location);
CREATE INDEX IF NOT EXISTS idx_patrols_location_date ON patrols(location, start_time);

-- Grant permissions
GRANT SELECT, INSERT, UPDATE, DELETE ON patrols TO authenticated;
