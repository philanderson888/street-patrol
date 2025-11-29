-- Street Patrol Database Schema Creation
-- This script creates the basic database schema and extensions

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Create custom types for better data integrity
DO $$ BEGIN
    CREATE TYPE patrol_status AS ENUM ('active', 'completed');
EXCEPTION
    WHEN duplicate_object THEN null;
END $$;

-- Create schema if it doesn't exist (for non-Supabase deployments)
-- CREATE SCHEMA IF NOT EXISTS public;

-- Grant usage on schema
-- GRANT USAGE ON SCHEMA public TO authenticated;
-- GRANT USAGE ON SCHEMA public TO anon;