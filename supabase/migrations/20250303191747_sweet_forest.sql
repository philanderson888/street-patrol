/*
  # Create patrols table

  1. New Tables
    - `patrols`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references auth.users)
      - `location` (text)
      - `team_leader` (text)
      - `team_members` (text)
      - `start_time` (timestamptz)
      - `end_time` (timestamptz, nullable)
      - `notified_police` (boolean)
      - `status` (text)
      - `statistics` (jsonb)
      - `notes` (text, nullable)
      - `created_at` (timestamptz)
  2. Security
    - Enable RLS on `patrols` table
    - Add policy for authenticated users to read their own data
    - Add policy for authenticated users to insert their own data
    - Add policy for authenticated users to update their own data
*/

CREATE TABLE IF NOT EXISTS patrols (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES auth.users NOT NULL,
  location text NOT NULL,
  team_leader text NOT NULL,
  team_members text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  notified_police boolean NOT NULL DEFAULT false,
  status text NOT NULL CHECK (status IN ('active', 'completed')),
  statistics jsonb NOT NULL DEFAULT '{}'::jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE patrols ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own patrols"
  ON patrols
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own patrols"
  ON patrols
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own patrols"
  ON patrols
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id);