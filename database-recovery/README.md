# Database Recovery Guide

This directory contains everything needed to recreate the Street Patrol database from scratch.

## Quick Start

### For Supabase (Recommended)

1. **Create a new Supabase project**
   - Go to https://supabase.com/dashboard
   - Click "New Project"
   - Note your project URL and anon key

2. **Run the schema script**
   - Open Supabase SQL Editor
   - Copy contents of `schema.sql`
   - Execute the script

3. **Import your data**
   - In Supabase SQL Editor
   - Copy contents of `data.sql`
   - Execute the script

4. **Update your app environment variables**
   - Update `.env` with new Supabase URL and keys

### For Other PostgreSQL Databases

```bash
# Create database
createdb street_patrol

# Run schema
psql -d street_patrol -f schema.sql

# Import data
psql -d street_patrol -f data.sql
```

## Files in this Directory

- `README.md` - This guide
- `schema.sql` - Complete database structure (tables, RLS, indexes)
- `data.sql` - Current data snapshot (5 patrol records)
- `data-export-template.csv` - CSV template for manual data export

## Database Structure

The database contains one main table:

**patrols** table:
- 5 patrol records (2 active, 3 completed)
- 2 unique users
- Locations: Enfield (4 patrols), Paris (1 patrol)
- Comprehensive statistics and contact demographics
- Full audit trail with timestamps

## Verification

After importing, run these checks in Supabase SQL Editor:

```sql
-- Check record count (should return 5)
SELECT COUNT(*) FROM patrols;

-- Check status distribution (should show 2 active, 3 completed)
SELECT status, COUNT(*) FROM patrols GROUP BY status;

-- Verify RLS is enabled
SELECT tablename, rowsecurity
FROM pg_tables
WHERE tablename = 'patrols';

-- Check policies exist (should show 4 policies)
SELECT policyname FROM pg_policies WHERE tablename = 'patrols';
```

## What's Included

### schema.sql
Complete database structure including:
- Table definition with all columns and constraints
- Row Level Security (RLS) policies
- Performance indexes
- Foreign key to auth.users

### data.sql
Current data snapshot with 5 patrol records:
- User 1919b10c: 4 patrols in Enfield
- User 776414c7: 1 patrol in Paris

## Important Notes

1. **User IDs**: The data references two user_id values. You'll need to:
   - Create these users in Supabase Auth, OR
   - Update the user_id values in data.sql to match your new users

2. **Foreign Key**: The patrols table has a foreign key to auth.users(id). Ensure users exist before importing data.

3. **RLS Policies**: Users can only see/edit their own patrols. The imported data will only be visible to users with matching user_id.

## Cost Savings

By deprecating and recreating as needed, you avoid ongoing database costs when the app isn't in active use. The complete recovery takes less than 5 minutes.
