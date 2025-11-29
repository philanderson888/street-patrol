-- Street Patrol Data Import Script
-- This script provides templates for importing data from CSV exports

-- IMPORTANT: Before running this script:
-- 1. Export your current data using the queries in export-data-queries.sql
-- 2. Save the results as CSV files
-- 3. Update the file paths below to match your CSV file locations
-- 4. Ensure the CSV files are accessible to your PostgreSQL instance

-- Method 1: Import from CSV file (recommended for large datasets)
-- Replace '/path/to/your/patrols_export.csv' with the actual path to your CSV file

/*
COPY patrols (
    id,
    user_id,
    location,
    team_leader,
    team_members,
    start_time,
    end_time,
    notified_police,
    police_cad_number,
    status,
    statistics,
    contact_statistics,
    notes,
    created_at
)
FROM '/path/to/your/patrols_export.csv'
WITH (
    FORMAT CSV,
    HEADER true,
    DELIMITER ',',
    QUOTE '"',
    ESCAPE '"'
);
*/

-- Method 2: Manual data insertion (for small datasets or testing)
-- Example INSERT statements - replace with your actual data

/*
INSERT INTO patrols (
    id,
    user_id,
    location,
    team_leader,
    team_members,
    start_time,
    end_time,
    notified_police,
    police_cad_number,
    status,
    statistics,
    contact_statistics,
    notes,
    created_at
) VALUES 
(
    'example-uuid-1',
    'user-uuid-1',
    'City Center',
    'John Doe',
    'Jane Smith, Bob Johnson',
    '2024-01-15 20:00:00+00',
    '2024-01-15 23:00:00+00',
    true,
    'CAD123456',
    'completed',
    '{"conversations": 5, "prayers": 2, "water_bottles": 10, "first_aid": 1, "directions": 3, "transport_assistance": 0, "vulnerable_people": 2, "bottles_glass_collected": 5, "cans_collected": 3}',
    '{"whiteMale18To25": 2, "whiteFemale18To25": 1, "asianMale13To17": 1, "afroCaribbeanFemale18To25": 1}',
    'Successful patrol with good community engagement',
    '2024-01-15 19:45:00+00'
);
*/

-- Method 3: Import using psql \copy command (run from psql command line)
-- This method works when the CSV file is on the client machine

/*
\copy patrols (id, user_id, location, team_leader, team_members, start_time, end_time, notified_police, police_cad_number, status, statistics, contact_statistics, notes, created_at) FROM 'patrols_export.csv' WITH (FORMAT CSV, HEADER true);
*/

-- Verify the import
-- Run these queries after importing to verify data integrity

-- Check total number of imported records
SELECT COUNT(*) as total_patrols FROM patrols;

-- Check status distribution
SELECT status, COUNT(*) as count FROM patrols GROUP BY status;

-- Check date range of imported data
SELECT 
    MIN(start_time) as earliest_patrol,
    MAX(start_time) as latest_patrol
FROM patrols;

-- Check for any NULL user_ids (which would violate RLS)
SELECT COUNT(*) as null_user_ids FROM patrols WHERE user_id IS NULL;

-- Sample of imported data
SELECT 
    id,
    location,
    team_leader,
    start_time,
    status
FROM patrols 
ORDER BY start_time DESC 
LIMIT 5;

-- Verify JSON fields are properly formatted
SELECT 
    id,
    jsonb_typeof(statistics) as statistics_type,
    jsonb_typeof(contact_statistics) as contact_stats_type
FROM patrols 
WHERE statistics IS NOT NULL 
   OR contact_statistics IS NOT NULL
LIMIT 5;