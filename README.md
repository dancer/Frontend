# **Football betting**

In this repo, we have our project, the backend (written in C#) and the frontend.

The backend can be started by `cd` ing into the `Frontend/Backend/Betting` and running `dotnet run`

The frontend can be run by installing node.js and then after installing the dependencies, `npm run`


**Previously, the development was in another repo:** [old-repo](https://github.com/iokitpusher/backend)

# Betting App

A full-stack betting application with real-time match tracking and odds.

## Setup Requirements

- Node.js (v18 or higher)
- .NET 8.0 SDK
- SQLite

## First Time Setup

1. Clone the repository:
```bash
git clone <your-repo-url>
cd <repo-name>
```

2. Install all dependencies (both frontend and backend):
```bash
npm run install-deps
```

3. Start both servers:
```bash
npm run dev
```

The app will be available at:
- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## After Pulling Updates

When you pull updates from the main branch, you might need to:

1. Install any new dependencies:
```bash
npm run install-deps
```

2. Update the database with new migrations:
```bash
cd Backend/Betting
dotnet ef database update
```

3. If you encounter database errors, you can reset the database:
```bash
# Remove existing database files
rm -f *.db*
# Apply migrations again
dotnet ef database update
```

## Development

- Run both frontend and backend:
```bash
npm run dev
```

- Run frontend only:
```bash
npm run frontend
```

- Run backend only:
```bash
npm run backend
```

## Project Structure

- `/Frontend` - Next.js frontend application
- `/Backend` - .NET backend application
  - `/Backend/Betting` - Main backend project
  - `/Backend/Betting/Controllers` - API endpoints
  - `/Backend/Betting/Models` - Database models and DTOs
  - `/Backend/Betting/Services` - Business logic
  - `/Backend/Betting/Data` - Database context and migrations
