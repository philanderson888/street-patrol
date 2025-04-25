# Firebase Migration Guide

## Overview

This guide outlines the process of migrating the Street Patrol application from Supabase to Firebase.

## Why Firebase?

- **Cost Efficiency**: Firebase's free tier (Spark plan) offers generous limits:
  - 1GB database storage
  - 10GB/month data transfer
  - 50,000 authentications per month
  - Free hosting
  - Real-time database capabilities

## Migration Components

1. **Authentication Migration**
   - Export Supabase user data
   - Import users into Firebase Authentication
   - Update authentication context and hooks
   - Maintain existing email/password flow

2. **Database Migration**
   - Migrate to Cloud Firestore (recommended)
   - Convert current schema:
     ```javascript
     // Current Supabase Schema        // Firestore Collection Structure
     patrols                          patrols/
       ├── id                           ├── {patrolId}/
       ├── user_id                      │   ├── userId
       ├── location                     │   ├── location
       ├── team_leader                  │   ├── teamLeader
       ├── team_members                 │   ├── teamMembers
       ├── start_time                   │   ├── startTime
       ├── end_time                     │   ├── endTime
       ├── notified_police             │   ├── notifiedPolice
       ├── police_cad_number           │   ├── policeCadNumber
       ├── status                      │   ├── status
       ├── statistics                  │   ├── statistics
       ├── contact_statistics          │   ├── contactStatistics
       ├── notes                       │   ├── notes
       └── created_at                  │   └── createdAt
     ```

3. **Real-time Features**
   - Replace Supabase subscriptions with Firestore listeners
   - Update components:
     - ActivePatrolBanner
     - ContactStatistics
     - ActivePatrol

## Security Implementation

1. **Firebase Security Rules**
   ```javascript
   rules_version = '2';
   service cloud.firestore {
     match /databases/{database}/documents {
       match /patrols/{patrolId} {
         allow read, write: if request.auth != null 
                           && request.auth.uid == resource.data.userId;
       }
     }
   }
   ```

2. **Authentication Rules**
   - Maintain email/password authentication
   - Implement Firebase session management
   - Update protected routes

## Migration Steps

1. **Preparation**
   - Set up Firebase project
   - Install Firebase SDK
   - Create Firebase configuration
   - Update environment variables

2. **Authentication Migration**
   - Export Supabase users
   - Import users to Firebase
   - Update authentication context
   - Test user login flow

3. **Database Migration**
   - Export Supabase data
   - Transform data structure
   - Import to Firestore
   - Update database queries
   - Test data integrity

4. **Real-time Features**
   - Implement Firestore listeners
   - Update subscription logic
   - Test real-time updates

5. **Testing**
   - Verify authentication flow
   - Test data access patterns
   - Validate real-time updates
   - Check security rules
   - Performance testing

## Timeline and Resources

- **Estimated Timeline**: 2-3 days
- **Team Requirements**:
  - 1 Frontend Developer
  - 1 Backend Developer/DevOps

## Post-Migration Tasks

1. **Monitoring**
   - Set up Firebase monitoring
   - Configure error tracking
   - Monitor performance metrics

2. **Documentation**
   - Update API documentation
   - Update deployment guides
   - Document new Firebase structure

3. **Cleanup**
   - Remove Supabase dependencies
   - Clean up environment variables
   - Archive Supabase project