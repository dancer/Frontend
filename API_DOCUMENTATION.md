# API Documentation and Code Snippets

This document contains all the API endpoints used in the project along with their implementation code in both frontend and backend.

## Table of Contents

1. [Player Search](#player-search)
2. [Popular Leagues](#popular-leagues)
3. [Countries](#countries)
4. [Seasons](#seasons)
5. [Live Matches](#live-matches)
6. [Matches by Date](#matches-by-date)
7. [League Matches by Date](#league-matches-by-date)
8. [All Matches by League](#all-matches-by-league)
9. [All Leagues](#all-leagues)
10. [Leagues with Countries](#leagues-with-countries)
11. [League Details](#league-details)
12. [League Logo](#league-logo)
13. [Teams by League](#teams-by-league)
14. [Home Teams by League](#home-teams-by-league)
15. [Away Teams by League](#away-teams-by-league)
16. [Team Details](#team-details)
17. [Team Logo](#team-logo)
18. [Team Players](#team-players)
19. [Player Details](#player-details)
20. [Player Image](#player-image)
21. [Match Details](#match-details)
22. [Match Score](#match-score)
23. [Match Status](#match-status)
24. [Match Highlights](#match-highlights)
25. [Match Location](#match-location)
26. [Match Stats](#match-stats)
27. [Match First Half Stats](#match-first-half-stats)
28. [Match Second Half Stats](#match-second-half-stats)
29. [Match Referee](#match-referee)
30. [Match Odds](#match-odds)
31. [Match Odds Poll](#match-odds-poll)
32. [Match Odds Vote Result](#match-odds-vote-result)
33. [Match Lineups](#match-lineups)
34. [Head to Head](#head-to-head)
35. [League Standings](#league-standings)
36. [League Rounds](#league-rounds)
37. [League Trophies](#league-trophies)
38. [League Top Players](#league-top-players)
39. [Transfers](#transfers)
40. [News](#news)
41. [Search](#search)

## Player Search

### Backend Endpoint (C#)

```csharp
// Controller: FootballController.cs
[HttpGet("players/search")]
public async Task<ActionResult<PlayerSearchResponse>> SearchPlayers([FromQuery] string query)
{
    if (string.IsNullOrWhiteSpace(query))
        return BadRequest("Search query cannot be empty");

    var result = await _footballDataService.SearchPlayersAsync(query);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<PlayerSearchResponse> SearchPlayersAsync(string searchTerm)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-players-search?search={Uri.EscapeDataString(searchTerm)}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PlayerSearchResponse>(content);
        return result ?? new PlayerSearchResponse();
    }
    catch (Exception ex)
    {
        // Log the exception here
        return new PlayerSearchResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
// In header.tsx
const handleSearch = async (query: string) => {
  setSearchQuery(query);
  setShowResults(true);

  if (query.trim().length < 2) {
    setSearchResults([]);
    return;
  }

  try {
    setIsSearching(true);
    const response = await fetch(
      `http://localhost:5000/api/football/players/search?query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    setSearchResults(data.players || []);
  } catch (error) {
    console.error("Search failed:", error);
    setSearchResults([]);
  } finally {
    setIsSearching(false);
  }
};
```

### API Response Type

```typescript
type Player = {
  id: number;
  name: string;
  commonName?: string;
  position?: string;
  currentTeam?: string;
  imageUrl?: string;
};

type PlayerSearchResponse = {
  success: boolean;
  players: Player[];
};
```

### Example Response

```json
{
  "success": true,
  "players": [
    {
      "id": 1,
      "name": "Lionel Messi",
      "commonName": "Messi",
      "position": "Forward",
      "currentTeam": "Inter Miami",
      "imageUrl": "https://example.com/messi.jpg"
    }
  ]
}
```

### Endpoint Details

- **URL**: `/api/football/players/search`
- **Method**: GET
- **Query Parameters**:
  - `query` (string, required): The search term for player names
- **Success Response Code**: 200 OK
- **Error Response Code**: 400 Bad Request (if query is empty)

---

## Popular Leagues

### Backend Endpoint (C#)

```csharp
// Controller: FootballController.cs
[HttpGet("leagues/popular")]
public async Task<ActionResult<LeagueResponse>> GetPopularLeagues()
{
    var result = await _footballDataService.GetPopularLeaguesAsync();
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<LeagueResponse> GetPopularLeaguesAsync()
{
    try
    {
        var response = await _httpClient.GetAsync("/football-popular-leagues");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<LeagueResponse>(content);
        return result ?? new LeagueResponse { Success = false };
    }
    catch (Exception ex)
    {
        // Log the exception here
        return new LeagueResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchPopularLeagues = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/football/leagues/popular"
    );
    const data = await response.json();
    if (data.success) {
      return data.leagues;
    }
    throw new Error("Failed to fetch leagues");
  } catch (error) {
    console.error("Failed to fetch popular leagues:", error);
    return [];
  }
};
```

### API Response Type

```typescript
type League = {
  id: number;
  name: string;
  country: string;
  logo?: string;
  season?: string;
  standings_available: boolean;
};

type LeagueResponse = {
  success: boolean;
  leagues: League[];
};
```

### Example Response

```json
{
  "success": true,
  "leagues": [
    {
      "id": 1,
      "name": "Premier League",
      "country": "England",
      "logo": "https://example.com/premier-league.png",
      "season": "2023/2024",
      "standings_available": true
    },
    {
      "id": 2,
      "name": "La Liga",
      "country": "Spain",
      "logo": "https://example.com/la-liga.png",
      "season": "2023/2024",
      "standings_available": true
    }
  ]
}
```

### Endpoint Details

- **URL**: `/api/football/leagues/popular`
- **Method**: GET
- **Query Parameters**: None
- **Success Response Code**: 200 OK
- **Error Response Code**: 500 Internal Server Error (if RapidAPI request fails)
- **RapidAPI Details**:
  - Host: `free-api-live-football-data.p.rapidapi.com`
  - Endpoint: `/football-popular-leagues`
  - Required Headers:
    - `x-rapidapi-host: free-api-live-football-data.p.rapidapi.com`
    - `x-rapidapi-key: [your-api-key]`

---

## Countries

### Backend Endpoint (C#)

```csharp
// Controller: FootballController.cs
[HttpGet("countries")]
public async Task<ActionResult<CountryResponse>> GetAllCountries()
{
    var result = await _footballDataService.GetAllCountriesAsync();
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<CountryResponse> GetAllCountriesAsync()
{
    try
    {
        var response = await _httpClient.GetAsync("/football-get-all-countries");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<CountryResponse>(content);
        return result ?? new CountryResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new CountryResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchCountries = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/football/countries"
    );
    const data = await response.json();
    if (data.success) {
      return data.countries;
    }
    throw new Error("Failed to fetch countries");
  } catch (error) {
    console.error("Failed to fetch countries:", error);
    return [];
  }
};
```

### API Response Type

```typescript
type Country = {
  id: number;
  name: string;
  code: string;
  flag?: string;
};

type CountryResponse = {
  success: boolean;
  countries: Country[];
};
```

### Endpoint Details

- **URL**: `/api/football/countries`
- **Method**: GET
- **Query Parameters**: None
- **Success Response Code**: 200 OK
- **Error Response Code**: 500 Internal Server Error
- **RapidAPI Details**:
  - Host: `free-api-live-football-data.p.rapidapi.com`
  - Endpoint: `/football-get-all-countries`

## Seasons

### Backend Endpoint (C#)

```csharp
[HttpGet("seasons")]
public async Task<ActionResult<SeasonResponse>> GetAllSeasons()
{
    var result = await _footballDataService.GetAllSeasonsAsync();
    return Ok(result);
}

public async Task<SeasonResponse> GetAllSeasonsAsync()
{
    try
    {
        var response = await _httpClient.GetAsync("/football-league-all-seasons");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<SeasonResponse>(content);
        return result ?? new SeasonResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new SeasonResponse { Success = false };
    }
}
```

### API Response Type

```typescript
type SeasonResponse = {
  success: boolean;
  seasons: string[];
};
```

## Live Matches

### Backend Endpoint (C#)

```csharp
[HttpGet("matches/live")]
public async Task<ActionResult<LiveMatchesResponse>> GetLiveMatches()
{
    var result = await _footballDataService.GetLiveMatchesAsync();
    return Ok(result);
}
```

### API Response Type

```typescript
type LiveMatch = {
  id: string;
  league: {
    id: number;
    name: string;
    country: string;
  };
  homeTeam: {
    id: number;
    name: string;
    score: number;
  };
  awayTeam: {
    id: number;
    name: string;
    score: number;
  };
  status: string;
  minute: number;
  events: MatchEvent[];
};

type LiveMatchesResponse = {
  success: boolean;
  matches: LiveMatch[];
};
```

## Matches by Date

### Backend Endpoint (C#)

```csharp
[HttpGet("matches/by-date")]
public async Task<ActionResult<MatchesResponse>> GetMatchesByDate([FromQuery] string date)
{
    if (!DateTime.TryParseExact(date, "yyyyMMdd", null, DateTimeStyles.None, out _))
        return BadRequest("Invalid date format. Use yyyyMMdd");

    var result = await _footballDataService.GetMatchesByDateAsync(date);
    return Ok(result);
}
```

### API Response Type

```typescript
type Match = {
  id: string;
  league: {
    id: number;
    name: string;
  };
  homeTeam: Team;
  awayTeam: Team;
  date: string;
  status: string;
};

type MatchesResponse = {
  success: boolean;
  matches: Match[];
};
```

## League Matches by Date

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues/{leagueId}/matches")]
public async Task<ActionResult<MatchesResponse>> GetLeagueMatchesByDate(
    [FromRoute] int leagueId,
    [FromQuery] string date)
{
    if (!DateTime.TryParseExact(date, "yyyyMMdd", null, DateTimeStyles.None, out _))
        return BadRequest("Invalid date format. Use yyyyMMdd");

    var result = await _footballDataService.GetLeagueMatchesByDateAsync(leagueId, date);
    return Ok(result);
}
```

## All Matches by League

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues/{leagueId}/all-matches")]
public async Task<ActionResult<MatchesResponse>> GetAllMatchesByLeague([FromRoute] int leagueId)
{
    var result = await _footballDataService.GetAllMatchesByLeagueAsync(leagueId);
    return Ok(result);
}
```

## All Leagues

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues")]
public async Task<ActionResult<LeaguesResponse>> GetAllLeagues()
{
    var result = await _footballDataService.GetAllLeaguesAsync();
    return Ok(result);
}
```

## Leagues with Countries

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues/with-countries")]
public async Task<ActionResult<LeaguesWithCountriesResponse>> GetLeaguesWithCountries()
{
    var result = await _footballDataService.GetLeaguesWithCountriesAsync();
    return Ok(result);
}
```

## League Details

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues/{leagueId}")]
public async Task<ActionResult<LeagueDetailResponse>> GetLeagueDetails([FromRoute] int leagueId)
{
    var result = await _footballDataService.GetLeagueDetailsAsync(leagueId);
    return Ok(result);
}
```

## League Logo

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues/{leagueId}/logo")]
public async Task<ActionResult<LeagueLogoResponse>> GetLeagueLogo([FromRoute] int leagueId)
{
    var result = await _footballDataService.GetLeagueLogoAsync(leagueId);
    return Ok(result);
}
```

### Common RapidAPI Details

All endpoints require the following headers:

```typescript
headers: {
    'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
    'x-rapidapi-key': 'YOUR_API_KEY'
}
```

---

## Teams by League

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues/{leagueId}/teams")]
public async Task<ActionResult<TeamsResponse>> GetTeamsByLeague([FromRoute] int leagueId)
{
    var result = await _footballDataService.GetTeamsByLeagueAsync(leagueId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<TeamsResponse> GetTeamsByLeagueAsync(int leagueId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-list-all-team?leagueid={leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TeamsResponse>(content);
        return result ?? new TeamsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TeamsResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchTeamsByLeague = async (leagueId: number) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/leagues/${leagueId}/teams`
    );
    const data = await response.json();
    if (data.success) {
      return data.teams;
    }
    throw new Error("Failed to fetch teams");
  } catch (error) {
    console.error("Failed to fetch teams:", error);
    return [];
  }
};
```

### API Response Type

```typescript
type Team = {
  id: number;
  name: string;
  shortName?: string;
  country: string;
  founded?: number;
  logo?: string;
  venue?: {
    name: string;
    capacity?: number;
    city: string;
  };
};

type TeamsResponse = {
  success: boolean;
  teams: Team[];
};
```

### Endpoint Details

- **URL**: `/api/football/leagues/{leagueId}/teams`
- **Method**: GET
- **Parameters**:
  - `leagueId` (path parameter): ID of the league
- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if league doesn't exist)

## Home Teams by League

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues/{leagueId}/teams/home")]
public async Task<ActionResult<TeamsResponse>> GetHomeTeamsByLeague([FromRoute] int leagueId)
{
    var result = await _footballDataService.GetHomeTeamsByLeagueAsync(leagueId);
    return Ok(result);
}
```

### Endpoint Details

- **URL**: `/api/football/leagues/{leagueId}/teams/home`
- **Method**: GET
- **Parameters**:
  - `leagueId` (path parameter): ID of the league
- **RapidAPI Endpoint**: `/football-get-list-home-team`

## Away Teams by League

### Backend Endpoint (C#)

```csharp
[HttpGet("leagues/{leagueId}/teams/away")]
public async Task<ActionResult<TeamsResponse>> GetAwayTeamsByLeague([FromRoute] int leagueId)
{
    var result = await _footballDataService.GetAwayTeamsByLeagueAsync(leagueId);
    return Ok(result);
}
```

### Endpoint Details

- **URL**: `/api/football/leagues/{leagueId}/teams/away`
- **Method**: GET
- **Parameters**:
  - `leagueId` (path parameter): ID of the league
- **RapidAPI Endpoint**: `/football-get-list-away-team`

## Team Details

### Backend Endpoint (C#)

```csharp
[HttpGet("teams/{teamId}")]
public async Task<ActionResult<TeamDetailResponse>> GetTeamDetails([FromRoute] int teamId)
{
    var result = await _footballDataService.GetTeamDetailsAsync(teamId);
    return Ok(result);
}
```

### API Response Type

```typescript
type TeamDetail = {
  id: number;
  name: string;
  country: string;
  founded: number;
  national: boolean;
  logo: string;
  venue: {
    id: number;
    name: string;
    address: string;
    city: string;
    capacity: number;
    surface: string;
    image: string;
  };
  coach?: {
    id: number;
    name: string;
    nationality: string;
    age: number;
  };
  squad?: Player[];
};

type TeamDetailResponse = {
  success: boolean;
  team: TeamDetail;
};
```

### Endpoint Details

- **URL**: `/api/football/teams/{teamId}`
- **Method**: GET
- **Parameters**:
  - `teamId` (path parameter): ID of the team
- **RapidAPI Endpoint**: `/football-league-team`

## Team Logo

### Backend Endpoint (C#)

```csharp
[HttpGet("teams/{teamId}/logo")]
public async Task<ActionResult<TeamLogoResponse>> GetTeamLogo([FromRoute] int teamId)
{
    var result = await _footballDataService.GetTeamLogoAsync(teamId);
    return Ok(result);
}
```

### API Response Type

```typescript
type TeamLogoResponse = {
  success: boolean;
  logo: string;
};
```

### Endpoint Details

- **URL**: `/api/football/teams/{teamId}/logo`
- **Method**: GET
- **Parameters**:
  - `teamId` (path parameter): ID of the team
- **RapidAPI Endpoint**: `/football-team-logo`

### Common RapidAPI Details

All endpoints require the following headers:

```typescript
headers: {
    'x-rapidapi-host': 'free-api-live-football-data.p.rapidapi.com',
    'x-rapidapi-key': 'YOUR_API_KEY'
}
```

---

## Team Players

### Backend Endpoint (C#)

```csharp
[HttpGet("teams/{teamId}/players")]
public async Task<ActionResult<TeamPlayersResponse>> GetTeamPlayers([FromRoute] int teamId)
{
    var result = await _footballDataService.GetTeamPlayersAsync(teamId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<TeamPlayersResponse> GetTeamPlayersAsync(int teamId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-list-player?teamid={teamId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TeamPlayersResponse>(content);
        return result ?? new TeamPlayersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TeamPlayersResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchTeamPlayers = async (teamId: number) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/teams/${teamId}/players`
    );
    const data = await response.json();
    if (data.success) {
      return data.players;
    }
    throw new Error("Failed to fetch team players");
  } catch (error) {
    console.error("Failed to fetch team players:", error);
    return [];
  }
};
```

### API Response Type

```typescript
type TeamPlayer = {
  id: number;
  name: string;
  firstName?: string;
  lastName?: string;
  number?: number;
  position: string;
  age: number;
  nationality: string;
  height?: string;
  weight?: string;
  injured: boolean;
  imageUrl?: string;
};

type TeamPlayersResponse = {
  success: boolean;
  players: TeamPlayer[];
};
```

### Endpoint Details

- **URL**: `/api/football/teams/{teamId}/players`
- **Method**: GET
- **Parameters**:
  - `teamId` (path parameter): ID of the team
- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if team doesn't exist)
- **RapidAPI Endpoint**: `/football-get-list-player`

## Player Details

### Backend Endpoint (C#)

```csharp
[HttpGet("players/{playerId}")]
public async Task<ActionResult<PlayerDetailResponse>> GetPlayerDetails([FromRoute] int playerId)
{
    var result = await _footballDataService.GetPlayerDetailsAsync(playerId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<PlayerDetailResponse> GetPlayerDetailsAsync(int playerId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-player-detail?playerid={playerId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PlayerDetailResponse>(content);
        return result ?? new PlayerDetailResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new PlayerDetailResponse { Success = false };
    }
}
```

### API Response Type

```typescript
type PlayerDetail = {
  id: number;
  name: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  nationality: string;
  birthCountry: string;
  birthPlace?: string;
  position: string;
  height?: string;
  weight?: string;
  injured: boolean;
  team: {
    id: number;
    name: string;
    logo?: string;
  };
  statistics?: {
    appearances: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
};

type PlayerDetailResponse = {
  success: boolean;
  player: PlayerDetail;
};
```

### Endpoint Details

- **URL**: `/api/football/players/{playerId}`
- **Method**: GET
- **Parameters**:
  - `playerId` (path parameter): ID of the player
- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if player doesn't exist)
- **RapidAPI Endpoint**: `/football-get-player-detail`

## Player Image

### Backend Endpoint (C#)

```csharp
[HttpGet("players/{playerId}/image")]
public async Task<ActionResult<PlayerImageResponse>> GetPlayerImage([FromRoute] int playerId)
{
    var result = await _footballDataService.GetPlayerImageAsync(playerId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<PlayerImageResponse> GetPlayerImageAsync(int playerId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-player-logo?playerid={playerId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PlayerImageResponse>(content);
        return result ?? new PlayerImageResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new PlayerImageResponse { Success = false };
    }
}
```

### API Response Type

```typescript
type PlayerImageResponse = {
  success: boolean;
  imageUrl: string;
};
```

### Endpoint Details

- **URL**: `/api/football/players/{playerId}/image`
- **Method**: GET
- **Parameters**:
  - `playerId` (path parameter): ID of the player
- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if player doesn't exist)
- **RapidAPI Endpoint**: `/football-get-player-logo`

### Example Usage

```typescript
// Fetching player details with image
const getPlayerWithImage = async (playerId: number) => {
  try {
    const [playerDetails, playerImage] = await Promise.all([
      fetch(`http://localhost:5000/api/football/players/${playerId}`),
      fetch(`http://localhost:5000/api/football/players/${playerId}/image`),
    ]);

    const [detailsData, imageData] = await Promise.all([
      playerDetails.json(),
      playerImage.json(),
    ]);

    return {
      ...detailsData.player,
      imageUrl: imageData.success ? imageData.imageUrl : null,
    };
  } catch (error) {
    console.error("Failed to fetch player data:", error);
    return null;
  }
};
```

---

## Match Details

### Backend Endpoint (C#)

```csharp
[HttpGet("matches/{eventId}/details")]
public async Task<ActionResult<MatchDetailResponse>> GetMatchDetails([FromRoute] string eventId)
{
    var result = await _footballDataService.GetMatchDetailsAsync(eventId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<MatchDetailResponse> GetMatchDetailsAsync(string eventId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-match-detail?eventid={eventId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<MatchDetailResponse>(content);
        return result ?? new MatchDetailResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new MatchDetailResponse { Success = false };
    }
}
```

### API Response Type

```typescript
type MatchDetail = {
  id: string;
  league: {
    id: number;
    name: string;
    country: string;
    season: string;
  };
  homeTeam: {
    id: number;
    name: string;
    logo: string;
    score: number;
    coach?: {
      id: number;
      name: string;
    };
    formation?: string;
  };
  awayTeam: {
    id: number;
    name: string;
    logo: string;
    score: number;
    coach?: {
      id: number;
      name: string;
    };
    formation?: string;
  };
  status: string;
  minute?: number;
  date: string;
  venue: {
    id: number;
    name: string;
    city: string;
  };
  referee?: {
    id: number;
    name: string;
    nationality: string;
  };
};

type MatchDetailResponse = {
  success: boolean;
  match: MatchDetail;
};
```

### Endpoint Details

- **URL**: `/api/football/matches/{eventId}/details`
- **Method**: GET
- **Parameters**:
  - `eventId` (path parameter): ID of the match/event
- **RapidAPI Endpoint**: `/football-get-match-detail`

## Match Score

### Backend Endpoint (C#)

```csharp
[HttpGet("matches/{eventId}/score")]
public async Task<ActionResult<MatchScoreResponse>> GetMatchScore([FromRoute] string eventId)
{
    var result = await _footballDataService.GetMatchScoreAsync(eventId);
    return Ok(result);
}
```

### API Response Type

```typescript
type MatchScore = {
  homeTeam: {
    score: number;
    halfTimeScore: number;
    fullTimeScore: number;
    extraTimeScore?: number;
    penaltyScore?: number;
  };
  awayTeam: {
    score: number;
    halfTimeScore: number;
    fullTimeScore: number;
    extraTimeScore?: number;
    penaltyScore?: number;
  };
};

type MatchScoreResponse = {
  success: boolean;
  score: MatchScore;
};
```

## Match Status

### Backend Endpoint (C#)

```csharp
[HttpGet("matches/{eventId}/status")]
public async Task<ActionResult<MatchStatusResponse>> GetMatchStatus([FromRoute] string eventId)
{
    var result = await _footballDataService.GetMatchStatusAsync(eventId);
    return Ok(result);
}
```

### API Response Type

```typescript
type MatchStatusResponse = {
  success: boolean;
  status: {
    long: string;
    short: string;
    elapsed?: number;
  };
};
```

## Match Stats

### Backend Endpoint (C#)

```csharp
// Full Match Statistics
[HttpGet("matches/{eventId}/stats")]
public async Task<ActionResult<MatchStatsResponse>> GetMatchStats([FromRoute] string eventId)
{
    var result = await _footballDataService.GetMatchStatsAsync(eventId);
    return Ok(result);
}

// First Half Statistics
[HttpGet("matches/{eventId}/stats/first-half")]
public async Task<ActionResult<MatchStatsResponse>> GetFirstHalfStats([FromRoute] string eventId)
{
    var result = await _footballDataService.GetFirstHalfStatsAsync(eventId);
    return Ok(result);
}

// Second Half Statistics
[HttpGet("matches/{eventId}/stats/second-half")]
public async Task<ActionResult<MatchStatsResponse>> GetSecondHalfStats([FromRoute] string eventId)
{
    var result = await _footballDataService.GetSecondHalfStatsAsync(eventId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<MatchStatsResponse> GetMatchStatsAsync(string eventId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-match-event-all-stats?eventid={eventId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<MatchStatsResponse>(content);
        return result ?? new MatchStatsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new MatchStatsResponse { Success = false };
    }
}

public async Task<MatchStatsResponse> GetFirstHalfStatsAsync(string eventId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-match-event-firstHalf-stats?eventid={eventId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<MatchStatsResponse>(content);
        return result ?? new MatchStatsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new MatchStatsResponse { Success = false };
    }
}

public async Task<MatchStatsResponse> GetSecondHalfStatsAsync(string eventId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-match-event-secondhalf-stats?eventid={eventId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<MatchStatsResponse>(content);
        return result ?? new MatchStatsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new MatchStatsResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchMatchStats = async (
  eventId: string,
  period?: "full" | "first-half" | "second-half"
) => {
  try {
    let endpoint = `http://localhost:5000/api/football/matches/${eventId}/stats`;
    if (period === "first-half") {
      endpoint += "/first-half";
    } else if (period === "second-half") {
      endpoint += "/second-half";
    }

    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.success) {
      return data.stats;
    }
    throw new Error("Failed to fetch match statistics");
  } catch (error) {
    console.error("Failed to fetch match statistics:", error);
    return null;
  }
};
```

### API Response Type

```typescript
type MatchStats = {
  possession: {
    home: number;
    away: number;
  };
  shots: {
    home: {
      total: number;
      onTarget: number;
      offTarget: number;
      blocked: number;
      insideBox: number;
      outsideBox: number;
    };
    away: {
      total: number;
      onTarget: number;
      offTarget: number;
      blocked: number;
      insideBox: number;
      outsideBox: number;
    };
  };
  passes: {
    home: {
      total: number;
      accurate: number;
      percentage: number;
    };
    away: {
      total: number;
      accurate: number;
      percentage: number;
    };
  };
  corners: {
    home: number;
    away: number;
  };
  fouls: {
    home: number;
    away: number;
  };
  cards: {
    home: {
      yellow: number;
      red: number;
    };
    away: {
      yellow: number;
      red: number;
    };
  };
  offsides: {
    home: number;
    away: number;
  };
  attacks: {
    home: {
      dangerous: number;
      total: number;
    };
    away: {
      dangerous: number;
      total: number;
    };
  };
};

type MatchStatsResponse = {
  success: boolean;
  stats: MatchStats;
  period?: "full" | "first-half" | "second-half";
};
```

### Example Usage

```typescript
// Fetching all match statistics (full match, first half, and second half)
const getAllMatchStats = async (eventId: string) => {
  try {
    const [fullMatch, firstHalf, secondHalf] = await Promise.all([
      fetchMatchStats(eventId, "full"),
      fetchMatchStats(eventId, "first-half"),
      fetchMatchStats(eventId, "second-half"),
    ]);

    return {
      fullMatch,
      firstHalf,
      secondHalf,
    };
  } catch (error) {
    console.error("Failed to fetch all match statistics:", error);
    return null;
  }
};

// Example React component for displaying match statistics
const MatchStatistics: React.FC<{ eventId: string }> = ({ eventId }) => {
  const [stats, setStats] = useState<{
    fullMatch: MatchStats | null;
    firstHalf: MatchStats | null;
    secondHalf: MatchStats | null;
  } | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      const result = await getAllMatchStats(eventId);
      setStats(result);
    };
    fetchStats();
  }, [eventId]);

  if (!stats) return <div>Loading statistics...</div>;

  return (
    <div>
      <h2>Match Statistics</h2>
      <Tabs defaultValue="full">
        <TabsList>
          <TabsTrigger value="full">Full Match</TabsTrigger>
          <TabsTrigger value="first">First Half</TabsTrigger>
          <TabsTrigger value="second">Second Half</TabsTrigger>
        </TabsList>
        <TabsContent value="full">
          <StatsDisplay stats={stats.fullMatch} />
        </TabsContent>
        <TabsContent value="first">
          <StatsDisplay stats={stats.firstHalf} />
        </TabsContent>
        <TabsContent value="second">
          <StatsDisplay stats={stats.secondHalf} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### Endpoint Details

- **Full Match Statistics**

  - **URL**: `/api/football/matches/{eventId}/stats`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-match-event-all-stats`

- **First Half Statistics**

  - **URL**: `/api/football/matches/{eventId}/stats/first-half`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-match-event-firstHalf-stats`

- **Second Half Statistics**
  - **URL**: `/api/football/matches/{eventId}/stats/second-half`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-match-event-secondhalf-stats`

Common Parameters:

- `eventId` (path parameter): ID of the match/event
- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if match doesn't exist)

## Match Odds

### Backend Endpoint (C#)

```csharp
[HttpGet("matches/{eventId}/odds")]
public async Task<ActionResult<MatchOddsResponse>> GetMatchOdds(
    [FromRoute] string eventId,
    [FromQuery] string countryCode)
{
    var result = await _footballDataService.GetMatchOddsAsync(eventId, countryCode);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<MatchOddsResponse> GetMatchOddsAsync(string eventId, string countryCode)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-event-odds?eventid={eventId}&countrycode={countryCode}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<MatchOddsResponse>(content);
        return result ?? new MatchOddsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new MatchOddsResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchMatchOdds = async (eventId: string, countryCode: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/matches/${eventId}/odds?countryCode=${countryCode}`
    );
    const data = await response.json();
    if (data.success) {
      return data.odds;
    }
    throw new Error("Failed to fetch match odds");
  } catch (error) {
    console.error("Failed to fetch match odds:", error);
    return null;
  }
};
```

### API Response Type

```typescript
type Bookmaker = {
  id: number;
  name: string;
  odds: {
    homeWin: number;
    draw: number;
    awayWin: number;
    overUnder?: {
      over2_5: number;
      under2_5: number;
    };
    bothTeamsToScore?: {
      yes: number;
      no: number;
    };
  };
};

type MatchOddsResponse = {
  success: boolean;
  odds: {
    matchId: string;
    bookmakers: Bookmaker[];
    lastUpdated: string;
  };
};
```

### Endpoint Details

- **URL**: `/api/football/matches/{eventId}/odds`
- **Method**: GET
- **Parameters**:
  - `eventId` (path parameter): ID of the match/event
  - `countryCode` (query parameter): Country code for odds (e.g., "BR", "UK")
- **RapidAPI Endpoint**: `/football-event-odds`

## Match Odds Poll

### Backend Endpoint (C#)

```csharp
[HttpGet("matches/{eventId}/odds-poll")]
public async Task<ActionResult<MatchOddsPollResponse>> GetMatchOddsPoll([FromRoute] string eventId)
{
    var result = await _footballDataService.GetMatchOddsPollAsync(eventId);
    return Ok(result);
}
```

### API Response Type

```typescript
type OddsPoll = {
  totalVotes: number;
  homeWinPercentage: number;
  drawPercentage: number;
  awayWinPercentage: number;
  lastUpdated: string;
};

type MatchOddsPollResponse = {
  success: boolean;
  poll: OddsPoll;
};
```

### Endpoint Details

- **URL**: `/api/football/matches/{eventId}/odds-poll`
- **Method**: GET
- **Parameters**:
  - `eventId` (path parameter): ID of the match/event
- **RapidAPI Endpoint**: `/football-get-match-oddspoll`

## Match Odds Vote Result

### Backend Endpoint (C#)

```csharp
[HttpGet("matches/{eventId}/odds-vote-result")]
public async Task<ActionResult<MatchOddsVoteResultResponse>> GetMatchOddsVoteResult([FromRoute] string eventId)
{
    var result = await _footballDataService.GetMatchOddsVoteResultAsync(eventId);
    return Ok(result);
}
```

### API Response Type

```typescript
type OddsVoteResult = {
  totalVotes: number;
  results: {
    homeWin: {
      votes: number;
      percentage: number;
    };
    draw: {
      votes: number;
      percentage: number;
    };
    awayWin: {
      votes: number;
      percentage: number;
    };
  };
  lastUpdated: string;
};

type MatchOddsVoteResultResponse = {
  success: boolean;
  voteResult: OddsVoteResult;
};
```

### Example Usage

```typescript
// Fetching complete match odds information
const getMatchOddsInfo = async (eventId: string, countryCode: string) => {
  try {
    const [odds, poll, voteResult] = await Promise.all([
      fetch(
        `http://localhost:5000/api/football/matches/${eventId}/odds?countryCode=${countryCode}`
      ),
      fetch(`http://localhost:5000/api/football/matches/${eventId}/odds-poll`),
      fetch(
        `http://localhost:5000/api/football/matches/${eventId}/odds-vote-result`
      ),
    ]);

    const [oddsData, pollData, voteResultData] = await Promise.all([
      odds.json(),
      poll.json(),
      voteResult.json(),
    ]);

    return {
      bookmakerOdds: oddsData.odds,
      publicPoll: pollData.poll,
      voteResult: voteResultData.voteResult,
    };
  } catch (error) {
    console.error("Failed to fetch match odds information:", error);
    return null;
  }
};
```

### Endpoint Details

- **URL**: `/api/football/matches/{eventId}/odds-vote-result`
- **Method**: GET
- **Parameters**:
  - `eventId` (path parameter): ID of the match/event
- **RapidAPI Endpoint**: `/football-get-match-odds-voteresult`

## League Standings

### Backend Endpoint (C#)

```csharp
// Overall Standings
[HttpGet("leagues/{leagueId}/standings")]
public async Task<ActionResult<StandingsResponse>> GetLeagueStandings([FromRoute] string leagueId)
{
    var result = await _footballDataService.GetLeagueStandingsAsync(leagueId);
    return Ok(result);
}

// Home Standings
[HttpGet("leagues/{leagueId}/standings/home")]
public async Task<ActionResult<StandingsResponse>> GetHomeStandings([FromRoute] string leagueId)
{
    var result = await _footballDataService.GetHomeStandingsAsync(leagueId);
    return Ok(result);
}

// Away Standings
[HttpGet("leagues/{leagueId}/standings/away")]
public async Task<ActionResult<StandingsResponse>> GetAwayStandings([FromRoute] string leagueId)
{
    var result = await _footballDataService.GetAwayStandingsAsync(leagueId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<StandingsResponse> GetLeagueStandingsAsync(string leagueId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-standing-all?leagueid={leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<StandingsResponse>(content);
        return result ?? new StandingsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new StandingsResponse { Success = false };
    }
}

public async Task<StandingsResponse> GetHomeStandingsAsync(string leagueId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-standing-home?leagueid={leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<StandingsResponse>(content);
        return result ?? new StandingsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new StandingsResponse { Success = false };
    }
}

public async Task<StandingsResponse> GetAwayStandingsAsync(string leagueId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-standing-away?leagueid={leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<StandingsResponse>(content);
        return result ?? new StandingsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new StandingsResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchLeagueStandings = async (
  leagueId: string,
  type: "overall" | "home" | "away" = "overall"
) => {
  try {
    let endpoint = `http://localhost:5000/api/football/leagues/${leagueId}/standings`;
    if (type === "home") {
      endpoint += "/home";
    } else if (type === "away") {
      endpoint += "/away";
    }

    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.success) {
      return data.standings;
    }
    throw new Error("Failed to fetch standings");
  } catch (error) {
    console.error("Failed to fetch standings:", error);
    return null;
  }
};

// Example React component for displaying league standings
const LeagueStandings: React.FC<{ leagueId: string }> = ({ leagueId }) => {
  const [standings, setStandings] = useState<{
    overall: TeamStanding[] | null;
    home: TeamStanding[] | null;
    away: TeamStanding[] | null;
  } | null>(null);

  useEffect(() => {
    const fetchStandings = async () => {
      const [overall, home, away] = await Promise.all([
        fetchLeagueStandings(leagueId, "overall"),
        fetchLeagueStandings(leagueId, "home"),
        fetchLeagueStandings(leagueId, "away"),
      ]);
      setStandings({ overall, home, away });
    };
    fetchStandings();
  }, [leagueId]);

  if (!standings) return <div>Loading standings...</div>;

  return (
    <div>
      <Tabs defaultValue="overall">
        <TabsList>
          <TabsTrigger value="overall">Overall</TabsTrigger>
          <TabsTrigger value="home">Home</TabsTrigger>
          <TabsTrigger value="away">Away</TabsTrigger>
        </TabsList>
        <TabsContent value="overall">
          <StandingsTable standings={standings.overall} />
        </TabsContent>
        <TabsContent value="home">
          <StandingsTable standings={standings.home} />
        </TabsContent>
        <TabsContent value="away">
          <StandingsTable standings={standings.away} />
        </TabsContent>
      </Tabs>
    </div>
  );
};
```

### API Response Type

```typescript
type TeamStanding = {
  position: number;
  teamId: string;
  teamName: string;
  teamLogo: string;
  played: number;
  won: number;
  drawn: number;
  lost: number;
  goalsFor: number;
  goalsAgainst: number;
  goalDifference: number;
  points: number;
  form: string[];
};

type StandingsResponse = {
  success: boolean;
  standings: TeamStanding[];
};
```

### Endpoint Details

- **Overall Standings**

  - **URL**: `/api/football/leagues/{leagueId}/standings`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-standing-all`

- **Home Standings**

  - **URL**: `/api/football/leagues/{leagueId}/standings/home`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-standing-home`

- **Away Standings**
  - **URL**: `/api/football/leagues/{leagueId}/standings/away`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-standing-away`

Common Parameters:

- `leagueId` (path parameter): ID of the league
- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if league doesn't exist)

## League Rounds

### Backend Endpoint (C#)

```csharp
// Get All Rounds
[HttpGet("leagues/{leagueId}/rounds")]
public async Task<ActionResult<RoundsResponse>> GetLeagueRounds([FromRoute] string leagueId)
{
    var result = await _footballDataService.GetLeagueRoundsAsync(leagueId);
    return Ok(result);
}

// Get Round Details
[HttpGet("rounds/{roundId}")]
public async Task<ActionResult<RoundDetailsResponse>> GetRoundDetails([FromRoute] string roundId)
{
    var result = await _footballDataService.GetRoundDetailsAsync(roundId);
    return Ok(result);
}

// Get Round Players
[HttpGet("leagues/{leagueId}/rounds/players")]
public async Task<ActionResult<RoundPlayersResponse>> GetRoundPlayers([FromRoute] string leagueId)
{
    var result = await _footballDataService.GetRoundPlayersAsync(leagueId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<RoundsResponse> GetLeagueRoundsAsync(string leagueId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-all-rounds?leagueid={leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<RoundsResponse>(content);
        return result ?? new RoundsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new RoundsResponse { Success = false };
    }
}

public async Task<RoundDetailsResponse> GetRoundDetailsAsync(string roundId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-rounds-detail?roundid={roundId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<RoundDetailsResponse>(content);
        return result ?? new RoundDetailsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new RoundDetailsResponse { Success = false };
    }
}

public async Task<RoundPlayersResponse> GetRoundPlayersAsync(string leagueId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-rounds-players?leagueid={leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<RoundPlayersResponse>(content);
        return result ?? new RoundPlayersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new RoundPlayersResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchLeagueRounds = async (leagueId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/leagues/${leagueId}/rounds`
    );
    const data = await response.json();
    if (data.success) {
      return data.rounds;
    }
    throw new Error("Failed to fetch rounds");
  } catch (error) {
    console.error("Failed to fetch rounds:", error);
    return null;
  }
};

const fetchRoundDetails = async (roundId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/rounds/${roundId}`
    );
    const data = await response.json();
    if (data.success) {
      return data.details;
    }
    throw new Error("Failed to fetch round details");
  } catch (error) {
    console.error("Failed to fetch round details:", error);
    return null;
  }
};

const fetchRoundPlayers = async (leagueId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/leagues/${leagueId}/rounds/players`
    );
    const data = await response.json();
    if (data.success) {
      return data.players;
    }
    throw new Error("Failed to fetch round players");
  } catch (error) {
    console.error("Failed to fetch round players:", error);
    return null;
  }
};

// Example React component for displaying league rounds
const LeagueRounds: React.FC<{ leagueId: string }> = ({ leagueId }) => {
  const [rounds, setRounds] = useState<Round[] | null>(null);
  const [selectedRound, setSelectedRound] = useState<string | null>(null);
  const [roundDetails, setRoundDetails] = useState<RoundDetails | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const roundsData = await fetchLeagueRounds(leagueId);
      setRounds(roundsData);
      if (roundsData?.length > 0) {
        setSelectedRound(roundsData[0].id);
      }
    };
    fetchData();
  }, [leagueId]);

  useEffect(() => {
    if (selectedRound) {
      const fetchDetails = async () => {
        const details = await fetchRoundDetails(selectedRound);
        setRoundDetails(details);
      };
      fetchDetails();
    }
  }, [selectedRound]);

  if (!rounds) return <div>Loading rounds...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {rounds.map((round) => (
          <Button
            key={round.id}
            variant={selectedRound === round.id ? "default" : "outline"}
            onClick={() => setSelectedRound(round.id)}
          >
            {round.name}
          </Button>
        ))}
      </div>
      {roundDetails && (
        <div className="space-y-4">
          <h3>Matches</h3>
          <div className="grid gap-4">
            {roundDetails.matches.map((match) => (
              <MatchCard key={match.id} match={match} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
```

### API Response Type

```typescript
type Round = {
  id: string;
  name: string;
  startDate: string;
  endDate: string;
};

type RoundMatch = {
  id: string;
  date: string;
  status: string;
  homeTeam: {
    id: string;
    name: string;
    logo: string;
    score: number;
  };
  awayTeam: {
    id: string;
    name: string;
    logo: string;
    score: number;
  };
};

type RoundDetails = {
  id: string;
  name: string;
  matches: RoundMatch[];
};

type RoundPlayer = {
  id: string;
  name: string;
  team: string;
  position: string;
  goals: number;
  assists: number;
  minutesPlayed: number;
};

type RoundsResponse = {
  success: boolean;
  rounds: Round[];
};

type RoundDetailsResponse = {
  success: boolean;
  details: RoundDetails;
};

type RoundPlayersResponse = {
  success: boolean;
  players: RoundPlayer[];
};
```

### Endpoint Details

- **All Rounds**

  - **URL**: `/api/football/leagues/{leagueId}/rounds`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-all-rounds`

- **Round Details**

  - **URL**: `/api/football/rounds/{roundId}`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-rounds-detail`

- **Round Players**
  - **URL**: `/api/football/leagues/{leagueId}/rounds/players`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-rounds-players`

Common Parameters:

- `leagueId` (path parameter): ID of the league
- `roundId` (path parameter): ID of the specific round
- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if league/round doesn't exist)

## League Trophies

### Backend Endpoint (C#)

```csharp
// Get All Seasons Trophies
[HttpGet("leagues/{leagueId}/trophies")]
public async Task<ActionResult<TrophiesResponse>> GetLeagueTrophies([FromRoute] string leagueId)
{
    var result = await _footballDataService.GetLeagueTrophiesAsync(leagueId);
    return Ok(result);
}

// Get Season Trophy Details
[HttpGet("leagues/{leagueId}/trophies/{season}")]
public async Task<ActionResult<TrophyDetailsResponse>> GetTrophyDetails(
    [FromRoute] string leagueId,
    [FromRoute] string season)
{
    var result = await _footballDataService.GetTrophyDetailsAsync(leagueId, season);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<TrophiesResponse> GetLeagueTrophiesAsync(string leagueId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-trophies-all-seasons?leagueid={leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TrophiesResponse>(content);
        return result ?? new TrophiesResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TrophiesResponse { Success = false };
    }
}

public async Task<TrophyDetailsResponse> GetTrophyDetailsAsync(string leagueId, string season)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-trophies-detail?leagueid={leagueId}&season={Uri.EscapeDataString(season)}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TrophyDetailsResponse>(content);
        return result ?? new TrophyDetailsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TrophyDetailsResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchLeagueTrophies = async (leagueId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/leagues/${leagueId}/trophies`
    );
    const data = await response.json();
    if (data.success) {
      return data.trophies;
    }
    throw new Error("Failed to fetch trophies");
  } catch (error) {
    console.error("Failed to fetch trophies:", error);
    return null;
  }
};

const fetchTrophyDetails = async (leagueId: string, season: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/leagues/${leagueId}/trophies/${encodeURIComponent(
        season
      )}`
    );
    const data = await response.json();
    if (data.success) {
      return data.details;
    }
    throw new Error("Failed to fetch trophy details");
  } catch (error) {
    console.error("Failed to fetch trophy details:", error);
    return null;
  }
};

// Example React component for displaying league trophies
const LeagueTrophies: React.FC<{ leagueId: string }> = ({ leagueId }) => {
  const [seasons, setSeasons] = useState<string[] | null>(null);
  const [selectedSeason, setSelectedSeason] = useState<string | null>(null);
  const [trophyDetails, setTrophyDetails] = useState<TrophyDetails | null>(
    null
  );

  useEffect(() => {
    const fetchData = async () => {
      const trophiesData = await fetchLeagueTrophies(leagueId);
      setSeasons(trophiesData?.seasons);
      if (trophiesData?.seasons?.length > 0) {
        setSelectedSeason(trophiesData.seasons[0]);
      }
    };
    fetchData();
  }, [leagueId]);

  useEffect(() => {
    if (selectedSeason) {
      const fetchDetails = async () => {
        const details = await fetchTrophyDetails(leagueId, selectedSeason);
        setTrophyDetails(details);
      };
      fetchDetails();
    }
  }, [leagueId, selectedSeason]);

  if (!seasons) return <div>Loading trophies...</div>;

  return (
    <div className="space-y-4">
      <div className="flex gap-2 overflow-x-auto">
        {seasons.map((season) => (
          <Button
            key={season}
            variant={selectedSeason === season ? "default" : "outline"}
            onClick={() => setSelectedSeason(season)}
          >
            {season}
          </Button>
        ))}
      </div>
      {trophyDetails && (
        <div className="space-y-4">
          <h3>Trophy Winners</h3>
          <div className="grid gap-4">
            <div className="flex items-center gap-4">
              <Image
                src={trophyDetails.winner.logo}
                alt={trophyDetails.winner.name}
                width={64}
                height={64}
              />
              <div>
                <h4 className="font-bold">{trophyDetails.winner.name}</h4>
                <p className="text-sm text-gray-500">Champions</p>
              </div>
            </div>
            {trophyDetails.runnerUp && (
              <div className="flex items-center gap-4">
                <Image
                  src={trophyDetails.runnerUp.logo}
                  alt={trophyDetails.runnerUp.name}
                  width={64}
                  height={64}
                />
                <div>
                  <h4 className="font-bold">{trophyDetails.runnerUp.name}</h4>
                  <p className="text-sm text-gray-500">Runners-up</p>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
```

### API Response Type

```typescript
type Trophy = {
  season: string;
  winner: {
    id: string;
    name: string;
    logo: string;
  };
  runnerUp?: {
    id: string;
    name: string;
    logo: string;
  };
};

type TrophiesResponse = {
  success: boolean;
  seasons: string[];
};

type TrophyDetails = {
  season: string;
  winner: {
    id: string;
    name: string;
    logo: string;
    points: number;
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
  runnerUp?: {
    id: string;
    name: string;
    logo: string;
    points: number;
    gamesPlayed: number;
    wins: number;
    draws: number;
    losses: number;
    goalsFor: number;
    goalsAgainst: number;
  };
};

type TrophyDetailsResponse = {
  success: boolean;
  details: TrophyDetails;
};
```

### Endpoint Details

- **All Seasons Trophies**

  - **URL**: `/api/football/leagues/{leagueId}/trophies`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-trophies-all-seasons`

- **Season Trophy Details**
  - **URL**: `/api/football/leagues/{leagueId}/trophies/{season}`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-trophies-detail`

Common Parameters:

- `leagueId` (path parameter): ID of the league
- `season` (path parameter): Season in format "YYYY/YYYY" (e.g., "2023/2024")
- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if league doesn't exist)

## Transfers

### Backend Endpoint (C#)

```csharp
// Get All Transfers
[HttpGet("transfers")]
public async Task<ActionResult<TransfersResponse>> GetAllTransfers([FromQuery] int page = 1)
{
    var result = await _footballDataService.GetAllTransfersAsync(page);
    return Ok(result);
}

// Get Top Transfers
[HttpGet("transfers/top")]
public async Task<ActionResult<TransfersResponse>> GetTopTransfers([FromQuery] int page = 1)
{
    var result = await _footballDataService.GetTopTransfersAsync(page);
    return Ok(result);
}

// Get Top Market Value Transfers
[HttpGet("transfers/market-value")]
public async Task<ActionResult<TransfersResponse>> GetMarketValueTransfers([FromQuery] int page = 1)
{
    var result = await _footballDataService.GetMarketValueTransfersAsync(page);
    return Ok(result);
}

// Get League Transfers
[HttpGet("leagues/{leagueId}/transfers")]
public async Task<ActionResult<TransfersResponse>> GetLeagueTransfers([FromRoute] string leagueId)
{
    var result = await _footballDataService.GetLeagueTransfersAsync(leagueId);
    return Ok(result);
}

// Get Team Contract Extensions
[HttpGet("teams/{teamId}/transfers/contract-extensions")]
public async Task<ActionResult<TransfersResponse>> GetTeamContractExtensions([FromRoute] string teamId)
{
    var result = await _footballDataService.GetTeamContractExtensionsAsync(teamId);
    return Ok(result);
}

// Get Team Incoming Transfers
[HttpGet("teams/{teamId}/transfers/in")]
public async Task<ActionResult<TransfersResponse>> GetTeamIncomingTransfers([FromRoute] string teamId)
{
    var result = await _footballDataService.GetTeamIncomingTransfersAsync(teamId);
    return Ok(result);
}

// Get Team Outgoing Transfers
[HttpGet("teams/{teamId}/transfers/out")]
public async Task<ActionResult<TransfersResponse>> GetTeamOutgoingTransfers([FromRoute] string teamId)
{
    var result = await _footballDataService.GetTeamOutgoingTransfersAsync(teamId);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<TransfersResponse> GetAllTransfersAsync(int page)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-all-transfers?page={page}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TransfersResponse>(content);
        return result ?? new TransfersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TransfersResponse { Success = false };
    }
}

public async Task<TransfersResponse> GetTopTransfersAsync(int page)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-top-transfers?page={page}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TransfersResponse>(content);
        return result ?? new TransfersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TransfersResponse { Success = false };
    }
}

public async Task<TransfersResponse> GetMarketValueTransfersAsync(int page)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-market-value-transfers?page={page}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TransfersResponse>(content);
        return result ?? new TransfersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TransfersResponse { Success = false };
    }
}

public async Task<TransfersResponse> GetLeagueTransfersAsync(string leagueId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-league-transfers?leagueid={leagueId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TransfersResponse>(content);
        return result ?? new TransfersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TransfersResponse { Success = false };
    }
}

public async Task<TransfersResponse> GetTeamContractExtensionsAsync(string teamId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-team-contract-extension-transfers?teamid={teamId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TransfersResponse>(content);
        return result ?? new TransfersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TransfersResponse { Success = false };
    }
}

public async Task<TransfersResponse> GetTeamIncomingTransfersAsync(string teamId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-team-players-in-transfers?teamid={teamId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TransfersResponse>(content);
        return result ?? new TransfersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TransfersResponse { Success = false };
    }
}

public async Task<TransfersResponse> GetTeamOutgoingTransfersAsync(string teamId)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-team-players-out-transfers?teamid={teamId}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TransfersResponse>(content);
        return result ?? new TransfersResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TransfersResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchTransfers = async (
  type: "all" | "top" | "market-value",
  page: number = 1
) => {
  try {
    let endpoint = `http://localhost:5000/api/football/transfers`;
    if (type === "top") {
      endpoint += "/top";
    } else if (type === "market-value") {
      endpoint += "/market-value";
    }
    endpoint += `?page=${page}`;

    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.success) {
      return data.transfers;
    }
    throw new Error("Failed to fetch transfers");
  } catch (error) {
    console.error("Failed to fetch transfers:", error);
    return null;
  }
};

const fetchLeagueTransfers = async (leagueId: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/leagues/${leagueId}/transfers`
    );
    const data = await response.json();
    if (data.success) {
      return data.transfers;
    }
    throw new Error("Failed to fetch league transfers");
  } catch (error) {
    console.error("Failed to fetch league transfers:", error);
    return null;
  }
};

const fetchTeamTransfers = async (
  teamId: string,
  type: "in" | "out" | "contract-extensions"
) => {
  try {
    const endpoint = `http://localhost:5000/api/football/teams/${teamId}/transfers/${type}`;
    const response = await fetch(endpoint);
    const data = await response.json();
    if (data.success) {
      return data.transfers;
    }
    throw new Error(`Failed to fetch team ${type} transfers`);
  } catch (error) {
    console.error(`Failed to fetch team ${type} transfers:`, error);
    return null;
  }
};

// Example React component for displaying transfers
const TransfersList: React.FC<{
  type: "all" | "top" | "market-value";
  page: number;
}> = ({ type, page }) => {
  const [transfers, setTransfers] = useState<Transfer[] | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      const data = await fetchTransfers(type, page);
      setTransfers(data);
      setLoading(false);
    };
    fetchData();
  }, [type, page]);

  if (loading) return <div>Loading transfers...</div>;
  if (!transfers) return <div>No transfers found</div>;

  return (
    <div className="space-y-4">
      {transfers.map((transfer) => (
        <div
          key={transfer.id}
          className="bg-zinc-900/50 p-4 rounded-lg space-y-2"
        >
          <div className="flex items-center gap-4">
            <Image
              src={transfer.player.photo}
              alt={transfer.player.name}
              width={48}
              height={48}
              className="rounded-full"
            />
            <div>
              <h4 className="font-bold">{transfer.player.name}</h4>
              <p className="text-sm text-gray-500">
                {transfer.player.position}
              </p>
            </div>
            <div className="ml-auto text-right">
              <div className="font-bold">
                {transfer.fee
                  ? `€${transfer.fee.toLocaleString()}`
                  : "Free Transfer"}
              </div>
              <div className="text-sm text-gray-500">{transfer.date}</div>
            </div>
          </div>
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Image
                src={transfer.fromTeam.logo}
                alt={transfer.fromTeam.name}
                width={24}
                height={24}
              />
              {transfer.fromTeam.name}
            </div>
            <ChevronRight className="h-4 w-4" />
            <div className="flex items-center gap-2">
              {transfer.toTeam.name}
              <Image
                src={transfer.toTeam.logo}
                alt={transfer.toTeam.name}
                width={24}
                height={24}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Example React component for displaying team transfers
const TeamTransfers: React.FC<{ teamId: string }> = ({ teamId }) => {
  const [activeTab, setActiveTab] = useState<"in" | "out" | "extensions">("in");
  const [transfers, setTransfers] = useState<Transfer[] | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      let type: "in" | "out" | "contract-extensions";
      switch (activeTab) {
        case "in":
          type = "in";
          break;
        case "out":
          type = "out";
          break;
        case "extensions":
          type = "contract-extensions";
          break;
      }
      const data = await fetchTeamTransfers(teamId, type);
      setTransfers(data);
    };
    fetchData();
  }, [teamId, activeTab]);

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <Button
          variant={activeTab === "in" ? "default" : "outline"}
          onClick={() => setActiveTab("in")}
        >
          Incoming
        </Button>
        <Button
          variant={activeTab === "out" ? "default" : "outline"}
          onClick={() => setActiveTab("out")}
        >
          Outgoing
        </Button>
        <Button
          variant={activeTab === "extensions" ? "default" : "outline"}
          onClick={() => setActiveTab("extensions")}
        >
          Contract Extensions
        </Button>
      </div>
      {transfers ? (
        <TransfersList transfers={transfers} />
      ) : (
        <div>Loading transfers...</div>
      )}
    </div>
  );
};
```

### API Response Type

```typescript
type Transfer = {
  id: string;
  player: {
    id: string;
    name: string;
    photo: string;
    position: string;
    nationality: string;
  };
  fromTeam: {
    id: string;
    name: string;
    logo: string;
  };
  toTeam: {
    id: string;
    name: string;
    logo: string;
  };
  type: "Permanent" | "Loan" | "Free" | "Contract Extension";
  fee?: number;
  date: string;
  contractUntil?: string;
  marketValue?: number;
};

type TransfersResponse = {
  success: boolean;
  transfers: Transfer[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};
```

### Endpoint Details

- **All Transfers**

  - **URL**: `/api/football/transfers`
  - **Method**: GET
  - **Query Parameters**: `page` (optional, default: 1)
  - **RapidAPI Endpoint**: `/football-get-all-transfers`

- **Top Transfers**

  - **URL**: `/api/football/transfers/top`
  - **Method**: GET
  - **Query Parameters**: `page` (optional, default: 1)
  - **RapidAPI Endpoint**: `/football-get-top-transfers`

- **Market Value Transfers**

  - **URL**: `/api/football/transfers/market-value`
  - **Method**: GET
  - **Query Parameters**: `page` (optional, default: 1)
  - **RapidAPI Endpoint**: `/football-get-market-value-transfers`

- **League Transfers**

  - **URL**: `/api/football/leagues/{leagueId}/transfers`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-league-transfers`

- **Team Contract Extensions**

  - **URL**: `/api/football/teams/{teamId}/transfers/contract-extensions`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-team-contract-extension-transfers`

- **Team Incoming Transfers**

  - **URL**: `/api/football/teams/{teamId}/transfers/in`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-team-players-in-transfers`

- **Team Outgoing Transfers**
  - **URL**: `/api/football/teams/{teamId}/transfers/out`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-team-players-out-transfers`

Common Parameters:

- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if team/league doesn't exist)

## News

### Backend Endpoint (C#)

```csharp
// Get Trending News
[HttpGet("news/trending")]
public async Task<ActionResult<NewsResponse>> GetTrendingNews()
{
    var result = await _footballDataService.GetTrendingNewsAsync();
    return Ok(result);
}

// Get League News
[HttpGet("leagues/{leagueId}/news")]
public async Task<ActionResult<NewsResponse>> GetLeagueNews(
    [FromRoute] string leagueId,
    [FromQuery] int page = 1)
{
    var result = await _footballDataService.GetLeagueNewsAsync(leagueId, page);
    return Ok(result);
}

// Get Team News
[HttpGet("teams/{teamId}/news")]
public async Task<ActionResult<NewsResponse>> GetTeamNews(
    [FromRoute] string teamId,
    [FromQuery] int page = 1)
{
    var result = await _footballDataService.GetTeamNewsAsync(teamId, page);
    return Ok(result);
}

// Get Player News
[HttpGet("players/{playerId}/news")]
public async Task<ActionResult<NewsResponse>> GetPlayerNews(
    [FromRoute] string playerId,
    [FromQuery] int page = 1)
{
    var result = await _footballDataService.GetPlayerNewsAsync(playerId, page);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<NewsResponse> GetTrendingNewsAsync()
{
    try
    {
        var response = await _httpClient.GetAsync("/football-get-trendingnews");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<NewsResponse>(content);
        return result ?? new NewsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new NewsResponse { Success = false };
    }
}

public async Task<NewsResponse> GetLeagueNewsAsync(string leagueId, int page)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-league-news?leagueid={leagueId}&page={page}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<NewsResponse>(content);
        return result ?? new NewsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new NewsResponse { Success = false };
    }
}

public async Task<NewsResponse> GetTeamNewsAsync(string teamId, int page)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-team-news?teamid={teamId}&page={page}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<NewsResponse>(content);
        return result ?? new NewsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new NewsResponse { Success = false };
    }
}

public async Task<NewsResponse> GetPlayerNewsAsync(string playerId, int page)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-get-player-news?playerid={playerId}&page={page}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<NewsResponse>(content);
        return result ?? new NewsResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new NewsResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const fetchTrendingNews = async () => {
  try {
    const response = await fetch(
      "http://localhost:5000/api/football/news/trending"
    );
    const data = await response.json();
    if (data.success) {
      return data.articles;
    }
    throw new Error("Failed to fetch trending news");
  } catch (error) {
    console.error("Failed to fetch trending news:", error);
    return null;
  }
};

const fetchLeagueNews = async (leagueId: string, page: number = 1) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/leagues/${leagueId}/news?page=${page}`
    );
    const data = await response.json();
    if (data.success) {
      return data.articles;
    }
    throw new Error("Failed to fetch league news");
  } catch (error) {
    console.error("Failed to fetch league news:", error);
    return null;
  }
};

const fetchTeamNews = async (teamId: string, page: number = 1) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/teams/${teamId}/news?page=${page}`
    );
    const data = await response.json();
    if (data.success) {
      return data.articles;
    }
    throw new Error("Failed to fetch team news");
  } catch (error) {
    console.error("Failed to fetch team news:", error);
    return null;
  }
};

const fetchPlayerNews = async (playerId: string, page: number = 1) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/players/${playerId}/news?page=${page}`
    );
    const data = await response.json();
    if (data.success) {
      return data.articles;
    }
    throw new Error("Failed to fetch player news");
  } catch (error) {
    console.error("Failed to fetch player news:", error);
    return null;
  }
};

// Example React component for displaying news articles
const NewsArticlesList: React.FC<{
  articles: NewsArticle[];
}> = ({ articles }) => {
  return (
    <div className="grid gap-6">
      {articles.map((article) => (
        <div
          key={article.id}
          className="bg-zinc-900/50 rounded-lg overflow-hidden hover:border-red-500/30 transition-all duration-300 group"
        >
          {article.image && (
            <div className="relative h-48 w-full">
              <Image
                src={article.image}
                alt={article.title}
                fill
                className="object-cover"
              />
            </div>
          )}
          <div className="p-4 space-y-2">
            <div className="flex items-center gap-2 text-xs text-zinc-400">
              <span>{article.source}</span>
              <span>•</span>
              <span>{article.publishedAt}</span>
            </div>
            <h3 className="font-bold text-lg">{article.title}</h3>
            <p className="text-sm text-zinc-400 line-clamp-2">
              {article.summary}
            </p>
            <a
              href={article.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1 text-sm text-red-500 hover:text-red-400"
            >
              Read more <ChevronRight className="h-4 w-4" />
            </a>
          </div>
        </div>
      ))}
    </div>
  );
};

// Example React component for displaying news with pagination
const NewsFeed: React.FC<{
  type: "trending" | "league" | "team" | "player";
  id?: string;
}> = ({ type, id }) => {
  const [articles, setArticles] = useState<NewsArticle[] | null>(null);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      setLoading(true);
      let data = null;

      switch (type) {
        case "trending":
          data = await fetchTrendingNews();
          break;
        case "league":
          if (id) data = await fetchLeagueNews(id, page);
          break;
        case "team":
          if (id) data = await fetchTeamNews(id, page);
          break;
        case "player":
          if (id) data = await fetchPlayerNews(id, page);
          break;
      }

      setArticles(data);
      setLoading(false);
    };

    fetchNews();
  }, [type, id, page]);

  if (loading) return <div>Loading news...</div>;
  if (!articles) return <div>No news found</div>;

  return (
    <div className="space-y-6">
      <NewsArticlesList articles={articles} />
      <div className="flex justify-center gap-2">
        <Button
          variant="outline"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Previous
        </Button>
        <Button
          variant="outline"
          onClick={() => setPage((p) => p + 1)}
          disabled={articles.length === 0}
        >
          Next
        </Button>
      </div>
    </div>
  );
};
```

### API Response Type

```typescript
type NewsArticle = {
  id: string;
  title: string;
  summary: string;
  content: string;
  url: string;
  image?: string;
  source: string;
  author?: string;
  publishedAt: string;
  category: string;
  tags: string[];
};

type NewsResponse = {
  success: boolean;
  articles: NewsArticle[];
  pagination?: {
    currentPage: number;
    totalPages: number;
    totalItems: number;
  };
};
```

### Endpoint Details

- **Trending News**

  - **URL**: `/api/football/news/trending`
  - **Method**: GET
  - **RapidAPI Endpoint**: `/football-get-trendingnews`

- **League News**

  - **URL**: `/api/football/leagues/{leagueId}/news`
  - **Method**: GET
  - **Parameters**:
    - `leagueId` (path parameter): ID of the league
    - `page` (query parameter, optional): Page number for pagination
  - **RapidAPI Endpoint**: `/football-get-league-news`

- **Team News**

  - **URL**: `/api/football/teams/{teamId}/news`
  - **Method**: GET
  - **Parameters**:
    - `teamId` (path parameter): ID of the team
    - `page` (query parameter, optional): Page number for pagination
  - **RapidAPI Endpoint**: `/football-get-team-news`

- **Player News**
  - **URL**: `/api/football/players/{playerId}/news`
  - **Method**: GET
  - **Parameters**:
    - `playerId` (path parameter): ID of the player
    - `page` (query parameter, optional): Page number for pagination
  - **RapidAPI Endpoint**: `/football-get-player-news`

Common Parameters:

- **Success Response Code**: 200 OK
- **Error Response Code**: 404 Not Found (if entity doesn't exist)

## Search

### Backend Endpoint (C#)

```csharp
// Search Players
[HttpGet("search/players")]
public async Task<ActionResult<PlayerSearchResponse>> SearchPlayers([FromQuery] string query)
{
    var result = await _footballDataService.SearchPlayersAsync(query);
    return Ok(result);
}

// Search Teams
[HttpGet("search/teams")]
public async Task<ActionResult<TeamSearchResponse>> SearchTeams([FromQuery] string query)
{
    var result = await _footballDataService.SearchTeamsAsync(query);
    return Ok(result);
}

// Search Leagues
[HttpGet("search/leagues")]
public async Task<ActionResult<LeagueSearchResponse>> SearchLeagues([FromQuery] string query)
{
    var result = await _footballDataService.SearchLeaguesAsync(query);
    return Ok(result);
}

// Search Matches
[HttpGet("search/matches")]
public async Task<ActionResult<MatchSearchResponse>> SearchMatches([FromQuery] string query)
{
    var result = await _footballDataService.SearchMatchesAsync(query);
    return Ok(result);
}

// Search All
[HttpGet("search/all")]
public async Task<ActionResult<GlobalSearchResponse>> SearchAll([FromQuery] string query)
{
    var result = await _footballDataService.SearchAllAsync(query);
    return Ok(result);
}

// Service: FootballDataService.cs
public async Task<PlayerSearchResponse> SearchPlayersAsync(string query)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-players-search?search={Uri.EscapeDataString(query)}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<PlayerSearchResponse>(content);
        return result ?? new PlayerSearchResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new PlayerSearchResponse { Success = false };
    }
}

public async Task<TeamSearchResponse> SearchTeamsAsync(string query)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-teams-search?search={Uri.EscapeDataString(query)}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<TeamSearchResponse>(content);
        return result ?? new TeamSearchResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new TeamSearchResponse { Success = false };
    }
}

public async Task<LeagueSearchResponse> SearchLeaguesAsync(string query)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-leagues-search?search={Uri.EscapeDataString(query)}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<LeagueSearchResponse>(content);
        return result ?? new LeagueSearchResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new LeagueSearchResponse { Success = false };
    }
}

public async Task<MatchSearchResponse> SearchMatchesAsync(string query)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-matches-search?search={Uri.EscapeDataString(query)}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<MatchSearchResponse>(content);
        return result ?? new MatchSearchResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new MatchSearchResponse { Success = false };
    }
}

public async Task<GlobalSearchResponse> SearchAllAsync(string query)
{
    try
    {
        var response = await _httpClient.GetAsync($"/football-all-search?search={Uri.EscapeDataString(query)}");
        response.EnsureSuccessStatusCode();

        var content = await response.Content.ReadAsStringAsync();
        var result = JsonSerializer.Deserialize<GlobalSearchResponse>(content);
        return result ?? new GlobalSearchResponse { Success = false };
    }
    catch (Exception ex)
    {
        return new GlobalSearchResponse { Success = false };
    }
}
```

### Frontend Implementation (React/TypeScript)

```typescript
const searchPlayers = async (query: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/search/players?query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    if (data.success) {
      return data.players;
    }
    throw new Error("Failed to search players");
  } catch (error) {
    console.error("Failed to search players:", error);
    return null;
  }
};

const searchTeams = async (query: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/search/teams?query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    if (data.success) {
      return data.teams;
    }
    throw new Error("Failed to search teams");
  } catch (error) {
    console.error("Failed to search teams:", error);
    return null;
  }
};

const searchLeagues = async (query: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/search/leagues?query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    if (data.success) {
      return data.leagues;
    }
    throw new Error("Failed to search leagues");
  } catch (error) {
    console.error("Failed to search leagues:", error);
    return null;
  }
};

const searchMatches = async (query: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/search/matches?query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    if (data.success) {
      return data.matches;
    }
    throw new Error("Failed to search matches");
  } catch (error) {
    console.error("Failed to search matches:", error);
    return null;
  }
};

const searchAll = async (query: string) => {
  try {
    const response = await fetch(
      `http://localhost:5000/api/football/search/all?query=${encodeURIComponent(
        query
      )}`
    );
    const data = await response.json();
    if (data.success) {
      return data;
    }
    throw new Error("Failed to search");
  } catch (error) {
    console.error("Failed to search:", error);
    return null;
  }
};

// Example React component for global search
const GlobalSearch: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<GlobalSearchResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<
    "all" | "players" | "teams" | "leagues" | "matches"
  >("all");

  const handleSearch = useCallback(
    debounce(async (searchQuery: string) => {
      if (searchQuery.length < 2) {
        setResults(null);
        return;
      }

      setLoading(true);
      try {
        let data;
        switch (activeTab) {
          case "players":
            data = await searchPlayers(searchQuery);
            setResults({ players: data });
            break;
          case "teams":
            data = await searchTeams(searchQuery);
            setResults({ teams: data });
            break;
          case "leagues":
            data = await searchLeagues(searchQuery);
            setResults({ leagues: data });
            break;
          case "matches":
            data = await searchMatches(searchQuery);
            setResults({ matches: data });
            break;
          default:
            data = await searchAll(searchQuery);
            setResults(data);
        }
      } catch (error) {
        console.error("Search failed:", error);
        setResults(null);
      } finally {
        setLoading(false);
      }
    }, 300),
    [activeTab]
  );

  useEffect(() => {
    if (query) {
      handleSearch(query);
    }
  }, [query, activeTab]);

  return (
    <div className="space-y-4">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search football..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="w-full"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <Spinner className="h-4 w-4" />
          </div>
        )}
      </div>

      <Tabs
        value={activeTab}
        onValueChange={(value: any) => setActiveTab(value)}
      >
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="players">Players</TabsTrigger>
          <TabsTrigger value="teams">Teams</TabsTrigger>
          <TabsTrigger value="leagues">Leagues</TabsTrigger>
          <TabsTrigger value="matches">Matches</TabsTrigger>
        </TabsList>

        <TabsContent value="all">
          {results && (
            <div className="space-y-6">
              {results.players && (
                <SearchResultsList type="players" items={results.players} />
              )}
              {results.teams && (
                <SearchResultsList type="teams" items={results.teams} />
              )}
              {results.leagues && (
                <SearchResultsList type="leagues" items={results.leagues} />
              )}
              {results.matches && (
                <SearchResultsList type="matches" items={results.matches} />
              )}
            </div>
          )}
        </TabsContent>

        <TabsContent value="players">
          {results?.players && (
            <SearchResultsList type="players" items={results.players} />
          )}
        </TabsContent>

        <TabsContent value="teams">
          {results?.teams && (
            <SearchResultsList type="teams" items={results.teams} />
          )}
        </TabsContent>

        <TabsContent value="leagues">
          {results?.leagues && (
            <SearchResultsList type="leagues" items={results.leagues} />
          )}
        </TabsContent>

        <TabsContent value="matches">
          {results?.matches && (
            <SearchResultsList type="matches" items={results.matches} />
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Example component for displaying search results
const SearchResultsList: React.FC<{
  type: "players" | "teams" | "leagues" | "matches";
  items: any[];
}> = ({ type, items }) => {
  if (!items.length) return null;

  return (
    <div className="space-y-2">
      <h3 className="font-semibold capitalize">{type}</h3>
      <div className="grid gap-2">
        {items.map((item) => {
          switch (type) {
            case "players":
              return <PlayerSearchResult key={item.id} player={item} />;
            case "teams":
              return <TeamSearchResult key={item.id} team={item} />;
            case "leagues":
              return <LeagueSearchResult key={item.id} league={item} />;
            case "matches":
              return <MatchSearchResult key={item.id} match={item} />;
            default:
              return null;
          }
        })}
      </div>
    </div>
  );
};
```

### API Response Types

```typescript
type PlayerSearchResult = {
  id: string;
  name: string;
  position?: string;
  nationality?: string;
  currentTeam?: {
    id: string;
    name: string;
    logo?: string;
  };
  photo?: string;
};

type TeamSearchResult = {
  id: string;
  name: string;
  country: string;
  logo?: string;
  venue?: {
    name: string;
    city: string;
  };
};

type LeagueSearchResult = {
  id: string;
  name: string;
  country: string;
  logo?: string;
  type: string;
};

type MatchSearchResult = {
  id: string;
  date: string;
  status: string;
  league: {
    id: string;
    name: string;
    country: string;
  };
  homeTeam: {
    id: string;
    name: string;
    logo?: string;
    score?: number;
  };
  awayTeam: {
    id: string;
    name: string;
    logo?: string;
    score?: number;
  };
};

type PlayerSearchResponse = {
  success: boolean;
  players: PlayerSearchResult[];
};

type TeamSearchResponse = {
  success: boolean;
  teams: TeamSearchResult[];
};

type LeagueSearchResponse = {
  success: boolean;
  leagues: LeagueSearchResult[];
};

type MatchSearchResponse = {
  success: boolean;
  matches: MatchSearchResult[];
};

type GlobalSearchResponse = {
  success: boolean;
  players?: PlayerSearchResult[];
  teams?: TeamSearchResult[];
  leagues?: LeagueSearchResult[];
  matches?: MatchSearchResult[];
};
```

### Endpoint Details

- **Search Players**

  - **URL**: `/api/football/search/players`
  - **Method**: GET
  - **Query Parameters**:
    - `query` (string, required): Search term for players
  - **RapidAPI Endpoint**: `/football-players-search`

- **Search Teams**

  - **URL**: `/api/football/search/teams`
  - **Method**: GET
  - **Query Parameters**:
    - `query` (string, required): Search term for teams
  - **RapidAPI Endpoint**: `/football-teams-search`

- **Search Leagues**

  - **URL**: `/api/football/search/leagues`
  - **Method**: GET
  - **Query Parameters**:
    - `query` (string, required): Search term for leagues
  - **RapidAPI Endpoint**: `/football-leagues-search`

- **Search Matches**

  - **URL**: `/api/football/search/matches`
  - **Method**: GET
  - **Query Parameters**:
    - `query` (string, required): Search term for matches
  - **RapidAPI Endpoint**: `/football-matches-search`

- **Search All**
  - **URL**: `/api/football/search/all`
  - **Method**: GET
  - **Query Parameters**:
    - `query` (string, required): Global search term
  - **RapidAPI Endpoint**: `/football-all-search`

Common Parameters:

- **Success Response Code**: 200 OK
- **Error Response Code**: 400 Bad Request (if query is empty)
- **Minimum Query Length**: 2 characters
