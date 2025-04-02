# FootballX - Premium Football Betting Platform Documentation

_Last Updated: 02/03/2025_

## Table of Contents

1. [Overview](#overview)
2. [Architecture](#architecture)
3. [Core Features](#core-features)
4. [Components](#components)
5. [Pages](#pages)
6. [State Management](#state-management)
7. [User Interface](#user-interface)
8. [Betting System](#betting-system)
9. [Technical Stack](#technical-stack)

## Overview

FootballX is a modern football betting platform that offers users a comprehensive betting experience with virtual currency. Upon registration, users receive 100 coins to engage in risk-free betting on real football matches and tournaments.

## Architecture

### Directory Structure

```
Frontend/
├── app/                    # Next.js pages and routing
├── components/            # Reusable UI components
├── context/              # React Context providers
├── hooks/               # Custom React hooks
├── lib/                # Utility functions
├── public/            # Static assets
└── styles/           # Global styles and themes
```

## Core Features

1. **Live Betting**

   - Real-time match updates
   - Dynamic odds adjustment
   - Live statistics
   - In-play betting options

2. **Pre-match Betting**

   - Upcoming matches
   - Tournament predictions
   - League-specific bets
   - Special event markets

3. **User Account System**

   - Virtual currency (100 coins on registration)
   - Bet history tracking
   - Profile management
   - Favorites/Bookmarks

4. **Statistics and Analysis**
   - Match statistics
   - Team performance metrics
   - Player statistics
   - League standings

## Components

### Match-Related Components

1. **FeaturedMatch**

   - Hero section display
   - Enhanced odds presentation
   - Match countdown
   - Quick betting options

2. **LiveMatches**

   ```typescript
   type LiveMatch = {
     id: string;
     tournament: string;
     minute: number;
     team1: {
       name: string;
       score: number;
     };
     team2: {
       name: string;
       score: number;
     };
     odds: {
       team1Win: number;
       draw: number;
       team2Win: number;
     };
   };
   ```

3. **UpcomingMatches**
   - Future match schedules
   - Pre-match odds
   - Tournament context
   - Quick bet placement

### Betting Components

1. **BettingSlip**

   - Active bets management
   - Stake input
   - Quick stake buttons ($1, $5, $10, $20)
   - Potential winnings calculator
   - Multi-bet support

   ```typescript
   type Bet = {
     id: string;
     matchId: string;
     match: string;
     selection: string;
     odds: number;
     stake: number;
     potentialWin: number;
     isLive?: boolean;
   };
   ```

2. **MyBets**
   - Bet history
   - Active bets
   - Settled bets
   - Cashout options

### Tournament Components

1. **TournamentBracket**

   - Competition structure
   - Match progression
   - Winner predictions

2. **LeagueStats**
   - Team standings
   - Form guide
   - Goal statistics
   - Points table

## Pages

### Main Routes

1. **Home** (`/`)

   - Featured matches
   - Live matches
   - Popular leagues
   - Quick bets

2. **Live** (`/live`)

   - Active matches
   - Real-time updates
   - Live statistics
   - In-play betting

3. **Tournaments** (`/tournaments`)

   - Competition overview
   - Match schedules
   - Team listings
   - Tournament statistics

4. **Profile** (`/profile`)
   - User information
   - Balance history
   - Betting history
   - Preferences

### Authentication

1. **Login** (`/login`)
2. **Register** (`/register`)
3. **Password Recovery** (`/forgot-password`)

## State Management

### Context Providers

1. **BettingSlipContext**

   - Manages active bets
   - Calculates stakes and winnings
   - Handles bet operations

2. **AuthContext**
   - User authentication
   - Session management
   - Permission control

## User Interface

### Design System

1. **Theme**

   - Dark mode optimized
   - Red accent colors
   - Modern gradients
   - Responsive layout

2. **Components**
   - Custom buttons
   - Betting cards
   - Statistics tables
   - Loading states

### Layout

1. **Header**

   - Navigation
   - User menu
   - Balance display
   - Quick actions

2. **Sidebar**

   - Sports categories
   - Popular leagues
   - Quick navigation
   - Promotional content

3. **BettingSlip**
   - Persistent sidebar
   - Collapsible interface
   - Real-time updates

## Betting System

### Features

1. **Bet Types**

   - Match winner
   - Draw
   - Live betting
   - Tournament winners

2. **Stake Management**

   - Virtual currency
   - Minimum/maximum stakes
   - Quick stake options
   - Balance protection

3. **Cashout System**
   - Early settlement
   - Partial cashout
   - Dynamic pricing

### Virtual Currency

- Initial balance: 100 coins
- Win/loss tracking
- Transaction history
- Balance protection

## Technical Stack

### Frontend Technologies

1. **Framework**

   - Next.js 14
   - React 18
   - TypeScript 5

2. **Styling**

   - Tailwind CSS
   - CSS Modules
   - Custom UI components

3. **State Management**

   - React Context
   - Custom hooks
   - Local storage

4. **Performance**
   - Server components
   - Dynamic imports
   - Image optimization
   - Route prefetching

### Development Tools

- ESLint
- Prettier
- TypeScript
- PostCSS
- Tailwind

### Deployment

- Vercel platform
- Edge functions
- CDN optimization
- Asset compression

## Future Enhancements

1. Mobile application
2. Additional sports markets
3. Social betting features
4. Enhanced statistics
5. Virtual matches
6. Tournament predictions
7. Achievement system
8. Leaderboards
