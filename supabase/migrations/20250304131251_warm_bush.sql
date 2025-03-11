/*
  # Add default contact statistics to existing patrols

  1. Updates
    - Add default contact_statistics to any patrol records that don't have them
  
  2. Purpose
    - Ensures all patrol records have the contact_statistics field initialized
    - Prevents null reference errors when accessing contact_statistics
*/

-- Update existing patrols that don't have contact_statistics
UPDATE patrols
SET contact_statistics = '{
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
}'::jsonb
WHERE contact_statistics IS NULL;