-- Street Patrol Data Export
-- Current data snapshot from production database

-- Insert patrol records
INSERT INTO patrols (id, user_id, location, team_leader, team_members, start_time, end_time, notified_police, status, statistics, notes, created_at, police_cad_number, contact_statistics) VALUES
(
  'e75999a1-c869-4d7b-a351-21c358522bfb',
  '1919b10c-22ba-4ecb-97e9-be7553be493e',
  'Enfield',
  'Bill',
  'Alice, Fred, Joyce',
  '2025-03-03 19:22:00+00',
  '2025-03-03 19:23:11.2+00',
  true,
  'completed',
  '{"prayers": 0, "first_aid": 0, "directions": 0, "conversations": 0, "water_bottles": 0, "vulnerable_people": 0, "transport_assistance": 0}'::jsonb,
  null,
  '2025-03-03 19:23:00.862597+00',
  null,
  '{"asianMale13To17": 0, "asianMale18To25": 0, "asianMaleOver25": 0, "whiteMale13To17": 0, "whiteMale18To25": 0, "whiteMaleOver25": 0, "asianMaleUnder13": 0, "whiteMaleUnder13": 0, "asianFemale13To17": 0, "asianFemale18To25": 0, "asianFemaleOver25": 0, "whiteFemale13To17": 0, "whiteFemale18To25": 0, "whiteFemaleOver25": 0, "asianFemaleUnder13": 0, "whiteFemaleUnder13": 0, "afroCaribbeanMale13To17": 0, "afroCaribbeanMale18To25": 0, "afroCaribbeanMaleOver25": 0, "afroCaribbeanMaleUnder13": 0, "afroCaribbeanFemale13To17": 0, "afroCaribbeanFemale18To25": 0, "afroCaribbeanFemaleOver25": 0, "easternEuropeanMale13To17": 0, "easternEuropeanMale18To25": 0, "easternEuropeanMaleOver25": 0, "afroCaribbeanFemaleUnder13": 0, "easternEuropeanMaleUnder13": 0, "easternEuropeanFemale13To17": 0, "easternEuropeanFemale18To25": 0, "easternEuropeanFemaleOver25": 0, "easternEuropeanFemaleUnder13": 0}'::jsonb
),
(
  '7b40fb39-b08e-4146-a47a-b5f7483c0f60',
  '1919b10c-22ba-4ecb-97e9-be7553be493e',
  'Enfield',
  'Bob',
  'Alice, Fred',
  '2025-03-03 19:57:00+00',
  '2025-03-03 19:58:23.571+00',
  true,
  'completed',
  '{"prayers": 2, "first_aid": 0, "directions": 0, "conversations": 0, "water_bottles": 2, "cans_collected": 2, "vulnerable_people": 0, "transport_assistance": 0, "bottles_glass_collected": 2}'::jsonb,
  'Here are some notes

and some more

and some more

and some more

and some more

and some more

all saved',
  '2025-03-03 19:57:10.653319+00',
  'Police 123 ',
  '{"asianMale13To17": 0, "asianMale18To25": 0, "asianMaleOver25": 0, "whiteMale13To17": 0, "whiteMale18To25": 0, "whiteMaleOver25": 0, "asianMaleUnder13": 0, "whiteMaleUnder13": 0, "asianFemale13To17": 0, "asianFemale18To25": 0, "asianFemaleOver25": 0, "whiteFemale13To17": 0, "whiteFemale18To25": 0, "whiteFemaleOver25": 0, "asianFemaleUnder13": 0, "whiteFemaleUnder13": 0, "afroCaribbeanMale13To17": 0, "afroCaribbeanMale18To25": 0, "afroCaribbeanMaleOver25": 0, "afroCaribbeanMaleUnder13": 0, "afroCaribbeanFemale13To17": 0, "afroCaribbeanFemale18To25": 0, "afroCaribbeanFemaleOver25": 0, "easternEuropeanMale13To17": 0, "easternEuropeanMale18To25": 0, "easternEuropeanMaleOver25": 0, "afroCaribbeanFemaleUnder13": 0, "easternEuropeanMaleUnder13": 0, "easternEuropeanFemale13To17": 0, "easternEuropeanFemale18To25": 0, "easternEuropeanFemaleOver25": 0, "easternEuropeanFemaleUnder13": 0}'::jsonb
),
(
  '9b6ccdf3-f664-4e61-a6a4-c128723adc87',
  '1919b10c-22ba-4ecb-97e9-be7553be493e',
  'Enfield',
  'Bill',
  'Bob, Henry, Alice',
  '2025-03-03 19:19:00+00',
  '2025-03-03 19:37:14.959+00',
  true,
  'completed',
  '{"prayers": 4, "first_aid": 0, "directions": 3, "conversations": 0, "water_bottles": 0, "vulnerable_people": 4, "transport_assistance": 3}'::jsonb,
  'Test notes

test',
  '2025-03-03 19:20:27.272507+00',
  null,
  '{"asianMale13To17": 0, "asianMale18To25": 0, "asianMaleOver25": 0, "whiteMale13To17": 0, "whiteMale18To25": 0, "whiteMaleOver25": 0, "asianMaleUnder13": 0, "whiteMaleUnder13": 0, "asianFemale13To17": 0, "asianFemale18To25": 0, "asianFemaleOver25": 0, "whiteFemale13To17": 0, "whiteFemale18To25": 0, "whiteFemaleOver25": 0, "asianFemaleUnder13": 0, "whiteFemaleUnder13": 0, "afroCaribbeanMale13To17": 0, "afroCaribbeanMale18To25": 0, "afroCaribbeanMaleOver25": 0, "afroCaribbeanMaleUnder13": 0, "afroCaribbeanFemale13To17": 0, "afroCaribbeanFemale18To25": 0, "afroCaribbeanFemaleOver25": 0, "easternEuropeanMale13To17": 0, "easternEuropeanMale18To25": 0, "easternEuropeanMaleOver25": 0, "afroCaribbeanFemaleUnder13": 0, "easternEuropeanMaleUnder13": 0, "easternEuropeanFemale13To17": 0, "easternEuropeanFemale18To25": 0, "easternEuropeanFemaleOver25": 0, "easternEuropeanFemaleUnder13": 0}'::jsonb
),
(
  '3069bf5d-aeca-405b-976a-61b61e6f123b',
  '1919b10c-22ba-4ecb-97e9-be7553be493e',
  'Enfield',
  'Bob',
  'Frank, Peter, George',
  '2025-03-03 19:37:00+00',
  null,
  true,
  'active',
  '{"prayers": 1, "first_aid": 2, "directions": 0, "conversations": 5, "water_bottles": 1, "vulnerable_people": 0, "transport_assistance": 0}'::jsonb,
  'Some notes go here

Talked to Philip',
  '2025-03-03 19:37:58.802764+00',
  'Police 123 456',
  '{"asianMale13To17": 0, "asianMale18To25": 3, "asianMaleOver25": 0, "whiteMale13To17": 0, "whiteMale18To25": 0, "whiteMaleOver25": 1, "asianMaleUnder13": 1, "whiteMaleUnder13": 1, "asianFemale13To17": 0, "asianFemale18To25": 0, "asianFemaleOver25": 0, "whiteFemale13To17": 0, "whiteFemale18To25": 0, "whiteFemaleOver25": 0, "asianFemaleUnder13": 0, "whiteFemaleUnder13": 0, "afroCaribbeanMale13To17": 1, "afroCaribbeanMale18To25": 0, "afroCaribbeanMaleOver25": 1, "afroCaribbeanMaleUnder13": 0, "afroCaribbeanFemale13To17": 0, "afroCaribbeanFemale18To25": 0, "afroCaribbeanFemaleOver25": 0, "easternEuropeanMale13To17": 0, "easternEuropeanMale18To25": 0, "easternEuropeanMaleOver25": 0, "afroCaribbeanFemaleUnder13": 0, "easternEuropeanMaleUnder13": 0, "easternEuropeanFemale13To17": 1, "easternEuropeanFemale18To25": 0, "easternEuropeanFemaleOver25": 0, "easternEuropeanFemaleUnder13": 0}'::jsonb
),
(
  '24d5e251-7418-42d4-a342-b206b54ab53d',
  '776414c7-b1ff-4d11-a393-3daf5d05d696',
  'Paris',
  'Bob',
  'Tim, John',
  '2025-03-21 17:22:00+00',
  null,
  false,
  'active',
  '{"prayers": 0, "first_aid": 0, "directions": 0, "conversations": 0, "water_bottles": 0, "cans_collected": 0, "vulnerable_people": 0, "transport_assistance": 0, "bottles_glass_collected": 0}'::jsonb,
  null,
  '2025-03-21 17:24:05.761202+00',
  '',
  '{"asianMale13To17": 0, "asianMale18To25": 0, "asianMaleOver25": 0, "whiteMale13To17": 0, "whiteMale18To25": 0, "whiteMaleOver25": 0, "asianMaleUnder13": 0, "whiteMaleUnder13": 0, "asianFemale13To17": 0, "asianFemale18To25": 0, "asianFemaleOver25": 0, "whiteFemale13To17": 0, "whiteFemale18To25": 0, "whiteFemaleOver25": 0, "asianFemaleUnder13": 0, "whiteFemaleUnder13": 0, "afroCaribbeanMale13To17": 0, "afroCaribbeanMale18To25": 0, "afroCaribbeanMaleOver25": 0, "afroCaribbeanMaleUnder13": 0, "afroCaribbeanFemale13To17": 0, "afroCaribbeanFemale18To25": 0, "afroCaribbeanFemaleOver25": 0, "easternEuropeanMale13To17": 0, "easternEuropeanMale18To25": 0, "easternEuropeanMaleOver25": 0, "afroCaribbeanFemaleUnder13": 0, "easternEuropeanMaleUnder13": 0, "easternEuropeanFemale13To17": 0, "easternEuropeanFemale18To25": 0, "easternEuropeanFemaleOver25": 0, "easternEuropeanFemaleUnder13": 0}'::jsonb
);

-- Verify the import
SELECT
  COUNT(*) as total_records,
  COUNT(CASE WHEN status = 'active' THEN 1 END) as active_patrols,
  COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_patrols
FROM patrols;
