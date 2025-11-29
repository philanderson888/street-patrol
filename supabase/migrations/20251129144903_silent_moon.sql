-- Street Patrol Data Export Queries
-- Run these queries in your current Supabase SQL editor to export data

-- INSTRUCTIONS:
-- 1. Run each query below in your Supabase SQL editor
-- 2. Copy the results and save them as CSV files
-- 3. Use these CSV files with the import scripts

-- =====================================================
-- QUERY 1: Export all patrol data
-- =====================================================
-- Copy this result and save as 'patrols_export.csv'

SELECT 
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
    statistics::text as statistics,
    contact_statistics::text as contact_statistics,
    notes,
    created_at
FROM patrols
ORDER BY created_at;

-- =====================================================
-- QUERY 2: Export patrol summary for verification
-- =====================================================
-- Use this to verify your export is complete

SELECT 
    COUNT(*) as total_patrols,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_patrols,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_patrols,
    MIN(start_time) as earliest_patrol,
    MAX(start_time) as latest_patrol,
    COUNT(DISTINCT user_id) as unique_users
FROM patrols;

-- =====================================================
-- QUERY 3: Export user statistics summary
-- =====================================================
-- Useful for verifying data integrity after import

SELECT 
    user_id,
    COUNT(*) as patrol_count,
    COUNT(CASE WHEN status = 'active' THEN 1 END) as active_count,
    COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_count,
    MIN(start_time) as first_patrol,
    MAX(start_time) as last_patrol
FROM patrols
GROUP BY user_id
ORDER BY patrol_count DESC;

-- =====================================================
-- QUERY 4: Export statistics aggregation for verification
-- =====================================================
-- Use this to verify statistics are preserved correctly

SELECT 
    SUM((statistics->>'conversations')::int) as total_conversations,
    SUM((statistics->>'prayers')::int) as total_prayers,
    SUM((statistics->>'water_bottles')::int) as total_water_bottles,
    SUM((statistics->>'first_aid')::int) as total_first_aid,
    SUM((statistics->>'directions')::int) as total_directions,
    SUM((statistics->>'transport_assistance')::int) as total_transport_assistance,
    SUM((statistics->>'vulnerable_people')::int) as total_vulnerable_people,
    SUM((statistics->>'bottles_glass_collected')::int) as total_bottles_glass,
    SUM((statistics->>'cans_collected')::int) as total_cans
FROM patrols
WHERE statistics IS NOT NULL;

-- =====================================================
-- QUERY 5: Export contact statistics summary
-- =====================================================
-- Verify contact matrix data is preserved

SELECT 
    COUNT(*) as patrols_with_contact_data,
    AVG(jsonb_array_length(jsonb_object_keys(contact_statistics))) as avg_contact_categories
FROM patrols
WHERE contact_statistics IS NOT NULL 
  AND contact_statistics != '{}'::jsonb;

-- =====================================================
-- QUERY 6: Export recent patrol data (for testing)
-- =====================================================
-- Use this for testing the import process with recent data

SELECT 
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
    statistics::text as statistics,
    contact_statistics::text as contact_statistics,
    notes,
    created_at
FROM patrols
WHERE start_time >= NOW() - INTERVAL '30 days'
ORDER BY start_time DESC;

-- =====================================================
-- ADDITIONAL VERIFICATION QUERIES
-- =====================================================

-- Check for any data quality issues before export
SELECT 'Missing location' as issue, COUNT(*) as count FROM patrols WHERE location IS NULL OR location = ''
UNION ALL
SELECT 'Missing team leader' as issue, COUNT(*) as count FROM patrols WHERE team_leader IS NULL OR team_leader = ''
UNION ALL
SELECT 'Missing team members' as issue, COUNT(*) as count FROM patrols WHERE team_members IS NULL OR team_members = ''
UNION ALL
SELECT 'Invalid status' as issue, COUNT(*) as count FROM patrols WHERE status NOT IN ('active', 'completed')
UNION ALL
SELECT 'Future start time' as issue, COUNT(*) as count FROM patrols WHERE start_time > NOW()
UNION ALL
SELECT 'End before start' as issue, COUNT(*) as count FROM patrols WHERE end_time IS NOT NULL AND end_time < start_time;

-- Check JSON field structure
SELECT 
    'Statistics fields' as field_type,
    COUNT(*) as total_records,
    COUNT(CASE WHEN statistics ? 'conversations' THEN 1 END) as has_conversations,
    COUNT(CASE WHEN statistics ? 'prayers' THEN 1 END) as has_prayers,
    COUNT(CASE WHEN statistics ? 'water_bottles' THEN 1 END) as has_water_bottles
FROM patrols
WHERE statistics IS NOT NULL;