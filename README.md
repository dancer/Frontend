# Football Betting Application

A full-stack betting application that provides real-time match tracking, live odds, and secure betting functionality. Built with Next.js for the frontend and .NET 8.0 for the backend.

## Features

- Real-time match tracking and odds updates
- Secure betting system with transaction management
- User authentication and account management
- Live match statistics and updates
- Coverage of major football leagues (Premier League, La Liga, etc.)
- Balance management and transaction history
- Favorite teams tracking

## Technology Stack

### Frontend

- Next.js 13+
- React
- TypeScript
- Tailwind CSS
- Real-time WebSocket connections

### Backend

- .NET 8.0
- Entity Framework Core
- SQLite Database
- WebSocket for real-time updates
- JWT Authentication

## API Documentation

The API documentation is available via Swagger UI at:

- Development: http://localhost:5000/swagger

The Swagger UI provides interactive documentation for all API endpoints, including:

- Request/response schemas
- Authentication requirements
- Example requests
- Test functionality

## Database Schema

The database schema can be found in two locations:

1. `SQL.txt` in the root directory - Contains raw SQL statements for creating the database
2. `Backend/Betting/Migrations` - Contains Entity Framework migration files

## Setup Requirements

- Node.js (v18 or higher)
- .NET 8.0 SDK
- SQLite

## Installation

1. Clone the repository:

```bash
git clone https://github.com/dancer/Frontend.git
cd Frontend
```

2. Install all dependencies (both frontend and backend):

```bash
npm run install-deps
```

3. Start both servers:

```bash
npm run dev
```

The application will be available at:

- Frontend: http://localhost:3000
- Backend: http://localhost:5000

## Development Commands

All commands should be run from the root directory:

```bash
# Run both frontend and backend
npm run dev

# Run frontend only
npm run frontend

# Run backend only
npm run backend

# Install all dependencies
npm run install-deps

# Update database after pulling changes
cd Backend/Betting && dotnet ef database update
```

## Project Structure

```
/
├── Frontend/                # Next.js frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── pages/         # Next.js pages
│   │   └── styles/        # CSS styles
│   └── public/            # Static assets
│
├── Backend/
│   └── Betting/
│       ├── Controllers/   # API endpoints
│       ├── Models/        # Database models and DTOs
│       ├── Services/      # Business logic
│       ├── Data/          # Database context
│       └── Migrations/    # Database migrations
│
├── SQL.txt               # Raw SQL database schema
└── README.md
```

## Database Management

To reset the database (if needed):

```bash
cd Backend/Betting
rm -f *.db*
dotnet ef database update
```

## Contributing

1. Create a feature branch from main
2. Make your changes
3. Run tests and ensure all pass
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

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
git clone https://github.com/dancer/Frontend.git
cd Frontend
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
root folder for all these commands
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

## Compilation Instructions

### Backend (.NET)

```bash
cd Backend/Betting
dotnet build              # Compile the application
dotnet test              # Run unit tests
dotnet run               # Run the application
```

### Frontend (Next.js)

```bash
cd Frontend
npm install              # Install dependencies
npm run build           # Create production build
npm run test            # Run unit tests
npm start               # Start production server
```

## Testing

The project uses MSTest for unit testing. Tests are located in the `Backend/Betting.Tests` directory.

### Test Coverage

- **Bet Model Tests**:

  - Validation of required fields
  - Bet creation with valid data
  - Cashout eligibility rules
  - Status management

- **Transaction Model Tests**:
  - Validation of required fields
  - Bet placement transactions
  - Deposit transactions
  - Balance management

### Running Tests

```bash
# Run all tests
cd Backend/Betting.Tests
dotnet test

# Run tests with coverage report
dotnet test /p:CollectCoverage=true /p:CoverletOutputFormat=lcov
```

### Test Architecture

- Uses MSTest framework
- Implements data validation testing
- Follows AAA (Arrange, Act, Assert) pattern
- Includes both positive and negative test cases

## Detailed Usage Instructions

1. **User Registration/Login**

   - Navigate to /auth/register or /auth/login
   - Provide required information
   - System will authenticate and create session

2. **Placing Bets**

   - Browse available matches
   - Click on desired odds
   - Enter stake amount
   - Confirm bet placement

3. **Managing Account**

   - View bet history
   - Check transaction history
   - Update profile information
   - Manage favorite teams

4. **Admin Functions**
   - Access admin panel at /admin
   - Manage matches and odds
   - View system statistics
   - Handle user management
