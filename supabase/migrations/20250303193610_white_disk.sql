/*
  # Add Police CAD Number field to patrols table

  1. Changes
    - Add `police_cad_number` column to the `patrols` table
    - This field will store the Computer Aided Dispatch number provided by police
    - The field is nullable as not all patrols may have a CAD number
*/

-- Add the police_cad_number column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patrols' AND column_name = 'police_cad_number'
  ) THEN
    ALTER TABLE patrols ADD COLUMN police_cad_number text;
  END IF;
END $$;