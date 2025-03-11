/*
  # Update patrol statistics schema

  1. Changes
     - Add new statistics fields to track collected items:
       - `bottles_glass_collected` (number) - For tracking bottles and glass items collected
       - `cans_collected` (number) - For tracking cans collected
     - Add `police_cad_number` field to patrols table
  
  2. Notes
     - These changes help track safety improvements by counting hazardous items removed from streets
     - The CAD number helps with police coordination
*/

-- Add police_cad_number column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patrols' AND column_name = 'police_cad_number'
  ) THEN
    ALTER TABLE patrols ADD COLUMN police_cad_number text DEFAULT '';
  END IF;
END $$;

-- No need to modify the statistics columns as they are stored in a JSONB field
-- The application code will handle the new statistics fields