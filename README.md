# Street Patrol Management System

A comprehensive web application for managing and tracking street patrol activities, built with React, TypeScript, and Supabase.

![Street Patrol Dashboard](https://images.unsplash.com/photo-1517048676732-d65bc937f952?auto=format&fit=crop&q=80&w=1200)

## Overview

The Street Patrol Management System is designed to help volunteer teams coordinate and document their street patrol activities. It provides real-time tracking of patrol statistics, contact logging, and comprehensive reporting features.

### Key Features

- **Real-time Patrol Management**
  - Start and manage active patrols
  - Track team locations and activities
  - Record interactions and statistics in real-time
  - Monitor patrol status and duration

- **Contact Tracking**
  - Detailed demographic data collection
  - Interactive contact matrix
  - Age, gender, and ethnicity tracking
  - Statistical analysis and reporting

- **Comprehensive Statistics**
  - Track conversations, prayers, and assistance provided
  - Monitor water bottle distribution
  - Record first aid incidents
  - Log transport assistance
  - Track vulnerable people encounters
  - Environmental impact tracking (bottles/glass collected)

- **Advanced Reporting**
  - Generate detailed patrol reports
  - Export data in CSV and HTML formats
  - Filter by date ranges
  - Aggregate statistics and trends.

## Technical Specifications

### Frontend Stack
- React 18.3
- TypeScript 5.5
- Vite 5.4
- TailwindCSS 3.4
- Lucide React (for icons)
- React Router DOM 6.22
- Date-fns (date formatting)

### Backend & Database
- Supabase (PostgreSQL)
- Row Level Security (RLS)
- Real-time subscriptions
- User authentication

### Authentication
- Email/password authentication
- Session management
- Protected routes
- User-specific data access

## Page Functionality

### Home (`/`)
- User authentication gateway
- Dashboard overview
- Quick access to key features
- Active patrol status

### New Patrol (`/new-patrol`)
- Patrol initialization
- Team member assignment
- Location recording
- Police notification integration

### Active Patrol (`/active-patrol/:id`)
- Real-time statistics tracking
- Contact matrix updates
- Notes and observations
- Team management
- End patrol functionality

### Patrol History (`/history`)
- Historical patrol records
- Detailed statistics view
- Contact matrices
- Patrol notes and documentation

### Reports (`/reports`)
- Customizable date ranges
- Statistical aggregation
- Export functionality (CSV/HTML)
- Contact matrix analysis

### Settings (`/settings`)
- User profile management
- Password updates
- Application preferences
- Notification settings

## Database Schema

### Patrols Table
```sql
CREATE TABLE patrols (
  id uuid PRIMARY KEY,
  user_id uuid REFERENCES users(id),
  location text NOT NULL,
  team_leader text NOT NULL,
  team_members text NOT NULL,
  start_time timestamptz NOT NULL,
  end_time timestamptz,
  notified_police boolean DEFAULT false,
  police_cad_number text,
  status text CHECK (status IN ('active', 'completed')),
  statistics jsonb DEFAULT '{}',
  contact_statistics jsonb,
  notes text,
  created_at timestamptz DEFAULT now()
);
```

## Security Features

- Row Level Security (RLS) policies
- User-specific data access
- Secure authentication
- Environment variable protection
- CORS configuration

## Getting Started

1. Clone the repository
```bash
git clone <repository-url>
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```
Edit `.env` with your Supabase credentials:
```
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

4. Start the development server
```bash
npm run dev
```

## Deployment

The application can be deployed to any static hosting service. Build the application using:

```bash
npm run build
```

The built files will be in the `dist` directory.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

MIT License - see LICENSE file for details