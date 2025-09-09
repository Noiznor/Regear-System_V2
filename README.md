# Regear-System_V2

A comprehensive guild management system for Maharlika with role-based gear presets, tier limitations, and member management.

## Features

- **Thread Management**: Create, view, and modify regear threads
- **Role-Based System**: Tank, DPS, Support, Healer, Villager, and BSquad roles
- **Tier Limitations**: Automatic gear restrictions based on player tiers
- **Member Management**: View and update member roles and tiers
- **Gear Presets**: Predefined and custom gear configurations
- **Real-time Updates**: Changes are synchronized across all users (with backend)

## Setup Options

### Option 1: Frontend Only (Current)
```bash
npm install
npm run dev
```

### Option 2: Full Stack with Backend
```bash
# Install dependencies
npm install

# Build the frontend
npm run build

# Start the full-stack server
npm run dev:server
```

## Backend Setup

The backend server provides:
- **Persistent member updates** across all users
- **API endpoints** for member management
- **Real-time synchronization** of role and tier changes

### API Endpoints

- `GET /api/members` - Get all members with updated roles/tiers
- `POST /api/members/:memberName` - Update a member's role and tier
- `GET /api/members/stats` - Get role and tier statistics

### Environment Variables

Create a `.env` file for production:
```
NODE_ENV=production
PORT=3001
```

## Deployment

### Frontend Only
Deploy the `dist` folder to any static hosting service (Netlify, Vercel, etc.)

### Full Stack
Deploy to services that support Node.js (Railway, Render, Heroku, etc.)

## File Structure

```
├── src/
│   ├── components/     # React components
│   ├── utils/         # Utility functions
│   ├── types/         # TypeScript types
│   └── data/          # Static data and presets
├── public/
│   ├── members.csv    # Member data
│   └── mahaLogo.png   # Guild logo
├── server.js          # Backend server
└── member-updates.json # Persistent member updates
```

## Technologies Used

- **Frontend**: React, TypeScript, Tailwind CSS, Vite
- **Backend**: Node.js, Express, CSV parsing
- **Storage**: localStorage (frontend-only) or JSON file (full-stack)
- **Icons**: Lucide React
