/*
  # Add contact statistics to patrols table

  1. Changes
    - Add contact_statistics field to the patrols table to store demographic data
  
  This migration adds a new JSONB field to store contact statistics with demographic information
  including gender, age group, and ethnicity.
*/

-- Add contact_statistics column if it doesn't exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'patrols' AND column_name = 'contact_statistics'
  ) THEN
    ALTER TABLE patrols ADD COLUMN contact_statistics jsonb DEFAULT '{
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
    }'::jsonb;
  END IF;
END $$;