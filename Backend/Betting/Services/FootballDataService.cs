using System.Text.Json;
using System.Net.Http.Json;
using Betting.Models;
using Microsoft.Extensions.Configuration;
using System.Text.Json.Serialization;

namespace Betting.Services;

public interface IFootballDataService
{
    Task<PlayerSearchResponse> SearchPlayersAsync(string searchTerm);
    Task<IEnumerable<MatchDto>> GetLiveMatchesAsync();
    Task<IEnumerable<MatchDto>> GetUpcomingMatchesAsync(string date = "today");
    Task<IEnumerable<TeamInfo>> GetAvailableTeamsAsync();
}

public class TeamInfo
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public string League { get; set; } = string.Empty;
    public string LeagueLogo { get; set; } = string.Empty;
}

public class FootballDataService : IFootballDataService
{
    private static readonly Dictionary<string, string> LeagueLogos = new()
    {
        ["Premier League"] = "https://media.api-sports.io/football/leagues/39.png",
        ["La Liga"] = "https://media.api-sports.io/football/leagues/140.png",
        ["Champions League"] = "https://media.api-sports.io/football/leagues/2.png",
        ["Serie A"] = "https://media.api-sports.io/football/leagues/135.png",
        ["Bundesliga"] = "https://media.api-sports.io/football/leagues/78.png"
    };

    private static readonly Dictionary<string, string> TeamLogos = new()
    {
        ["Manchester City"] = "https://media.api-sports.io/football/teams/50.png",
        ["Arsenal"] = "https://media.api-sports.io/football/teams/42.png",
        ["Liverpool"] = "https://media.api-sports.io/football/teams/40.png",
        ["Manchester United"] = "https://media.api-sports.io/football/teams/33.png",
        ["Chelsea"] = "https://media.api-sports.io/football/teams/49.png",
        ["Tottenham"] = "https://media.api-sports.io/football/teams/47.png",
        ["Newcastle"] = "https://media.api-sports.io/football/teams/34.png",
        ["Aston Villa"] = "https://media.api-sports.io/football/teams/66.png",
        ["Real Madrid"] = "https://media.api-sports.io/football/teams/541.png",
        ["Barcelona"] = "https://media.api-sports.io/football/teams/529.png",
        ["Atletico Madrid"] = "https://media.api-sports.io/football/teams/530.png",
        ["Sevilla"] = "https://media.api-sports.io/football/teams/536.png",
        ["Valencia"] = "https://media.api-sports.io/football/teams/532.png",
        ["Real Betis"] = "https://media.api-sports.io/football/teams/543.png",
        ["Bayern Munich"] = "https://media.api-sports.io/football/teams/157.png",
        ["PSG"] = "https://media.api-sports.io/football/teams/85.png",
        ["Inter"] = "https://media.api-sports.io/football/teams/505.png",
        ["AC Milan"] = "https://media.api-sports.io/football/teams/489.png",
        ["Juventus"] = "https://media.api-sports.io/football/teams/496.png",
        ["Napoli"] = "https://media.api-sports.io/football/teams/492.png",
        ["Borussia Dortmund"] = "https://media.api-sports.io/football/teams/165.png",
        ["RB Leipzig"] = "https://media.api-sports.io/football/teams/173.png",
        ["Bayer Leverkusen"] = "https://media.api-sports.io/football/teams/168.png"
    };

    private static readonly List<MatchDto> MockMatches = GenerateMockMatches();

    private static List<MatchDto> GenerateMockMatches()
    {
        var matches = new List<MatchDto>();
        var today = DateTime.Today;

        // Premier League Matches
        matches.AddRange(new[]
        {
            CreateMatch(
                "1", "Premier League", "England", today.ToString("yyyy-MM-dd"), "15:00",
                ("1", "Manchester City", 2), ("2", "Arsenal", 1),
                (1.85m, 3.40m, 4.50m), isLive: true, minute: 67),
            CreateMatch(
                "2", "Premier League", "England", today.ToString("yyyy-MM-dd"), "17:30",
                ("3", "Liverpool", null), ("4", "Manchester United", null),
                (1.75m, 3.60m, 4.80m)),
            CreateMatch(
                "3", "Premier League", "England", today.AddDays(1).ToString("yyyy-MM-dd"), "20:00",
                ("5", "Chelsea", null), ("6", "Tottenham", null),
                (2.10m, 3.30m, 3.50m)),
            CreateMatch(
                "4", "Premier League", "England", today.AddDays(2).ToString("yyyy-MM-dd"), "20:45",
                ("7", "Newcastle", null), ("8", "Aston Villa", null),
                (1.95m, 3.40m, 4.00m))
        });

        // La Liga Matches
        matches.AddRange(new[]
        {
            CreateMatch(
                "5", "La Liga", "Spain", today.ToString("yyyy-MM-dd"), "21:00",
                ("9", "Real Madrid", 0), ("10", "Barcelona", 0),
                (2.10m, 3.25m, 3.60m), isLive: true, minute: 23),
            CreateMatch(
                "6", "La Liga", "Spain", today.AddDays(1).ToString("yyyy-MM-dd"), "19:00",
                ("11", "Atletico Madrid", null), ("12", "Sevilla", null),
                (1.90m, 3.30m, 4.20m)),
            CreateMatch(
                "7", "La Liga", "Spain", today.AddDays(3).ToString("yyyy-MM-dd"), "20:00",
                ("13", "Valencia", null), ("14", "Real Betis", null),
                (2.30m, 3.20m, 3.10m))
        });

        // Champions League Matches
        matches.AddRange(new[]
        {
            CreateMatch(
                "8", "Champions League", "Europe", today.AddDays(7).ToString("yyyy-MM-dd"), "20:00",
                ("1", "Manchester City", null), ("9", "Real Madrid", null),
                (1.90m, 3.50m, 4.10m)),
            CreateMatch(
                "9", "Champions League", "Europe", today.AddDays(7).ToString("yyyy-MM-dd"), "20:00",
                ("15", "Bayern Munich", null), ("16", "PSG", null),
                (1.95m, 3.50m, 3.90m)),
            CreateMatch(
                "10", "Champions League", "Europe", today.AddDays(8).ToString("yyyy-MM-dd"), "20:00",
                ("3", "Liverpool", null), ("10", "Barcelona", null),
                (2.05m, 3.40m, 3.60m))
        });

        // Serie A Matches
        matches.AddRange(new[]
        {
            CreateMatch(
                "11", "Serie A", "Italy", today.AddDays(1).ToString("yyyy-MM-dd"), "20:45",
                ("17", "Inter", null), ("18", "AC Milan", null),
                (2.15m, 3.30m, 3.40m)),
            CreateMatch(
                "12", "Serie A", "Italy", today.AddDays(2).ToString("yyyy-MM-dd"), "18:00",
                ("19", "Juventus", null), ("20", "Napoli", null),
                (2.00m, 3.25m, 3.80m))
        });

        // Bundesliga Matches
        matches.AddRange(new[]
        {
            CreateMatch(
                "13", "Bundesliga", "Germany", today.AddDays(2).ToString("yyyy-MM-dd"), "15:30",
                ("15", "Bayern Munich", null), ("21", "Borussia Dortmund", null),
                (1.75m, 3.80m, 4.50m)),
            CreateMatch(
                "14", "Bundesliga", "Germany", today.AddDays(2).ToString("yyyy-MM-dd"), "17:30",
                ("22", "RB Leipzig", null), ("23", "Bayer Leverkusen", null),
                (2.20m, 3.40m, 3.20m))
        });

        return matches;
    }

    private static MatchDto CreateMatch(
        string id, string tournament, string region, string date, string time,
        (string id, string name, int? score) team1,
        (string id, string name, int? score) team2,
        (decimal team1Win, decimal draw, decimal team2Win) odds,
        bool isLive = false,
        int? minute = null)
    {
        return new MatchDto
        {
            Id = id,
            Tournament = tournament,
            TournamentLogo = LeagueLogos.TryGetValue(tournament, out var leagueLogo) ? leagueLogo : "https://media.api-sports.io/football/leagues/1.png",
            Region = region,
            Date = date,
            Time = time,
            Team1 = new TeamDto
            {
                Id = team1.id,
                Name = team1.name,
                Logo = TeamLogos.TryGetValue(team1.name, out var team1Logo) ? team1Logo : "https://media.api-sports.io/football/teams/1.png",
                Score = team1.score
            },
            Team2 = new TeamDto
            {
                Id = team2.id,
                Name = team2.name,
                Logo = TeamLogos.TryGetValue(team2.name, out var team2Logo) ? team2Logo : "https://media.api-sports.io/football/teams/1.png",
                Score = team2.score
            },
            Minute = minute,
            Odds = new MatchOddsDto
            {
                Team1Win = odds.team1Win,
                Draw = odds.draw,
                Team2Win = odds.team2Win
            }
        };
    }

    public Task<PlayerSearchResponse> SearchPlayersAsync(string searchTerm)
    {
        var mockPlayers = new List<Player>
        {
            new() { Id = 1, Name = "Erling Haaland", CommonName = "Haaland", Position = "Forward", CurrentTeam = "Manchester City" },
            new() { Id = 2, Name = "Jude Bellingham", CommonName = "Bellingham", Position = "Midfielder", CurrentTeam = "Real Madrid" },
            new() { Id = 3, Name = "Kylian Mbappé", CommonName = "Mbappé", Position = "Forward", CurrentTeam = "PSG" },
            new() { Id = 4, Name = "Mohamed Salah", CommonName = "Salah", Position = "Forward", CurrentTeam = "Liverpool" },
            new() { Id = 5, Name = "Kevin De Bruyne", CommonName = "De Bruyne", Position = "Midfielder", CurrentTeam = "Manchester City" },
            new() { Id = 6, Name = "Harry Kane", CommonName = "Kane", Position = "Forward", CurrentTeam = "Bayern Munich" }
        };

        var filteredPlayers = mockPlayers
            .Where(p => p.Name.Contains(searchTerm, StringComparison.OrdinalIgnoreCase) || 
                       (p.CommonName != null && p.CommonName.Contains(searchTerm, StringComparison.OrdinalIgnoreCase)))
            .ToList();

        return Task.FromResult(new PlayerSearchResponse
        {
            Success = true,
            Players = filteredPlayers
        });
    }

    public Task<IEnumerable<MatchDto>> GetLiveMatchesAsync()
    {
        var liveMatches = MockMatches
            .Where(m => !string.IsNullOrEmpty(m.Date) && 
                       DateTime.Parse(m.Date).Date == DateTime.Today &&
                       m.Minute.HasValue)
            .ToList();

        return Task.FromResult(liveMatches.AsEnumerable());
    }

    public Task<IEnumerable<MatchDto>> GetUpcomingMatchesAsync(string date = "today")
    {
        var targetDate = date.ToLower() switch
        {
            "today" => DateTime.Today,
            "tomorrow" => DateTime.Today.AddDays(1),
            "week" => DateTime.Today.AddDays(7),
            "month" => DateTime.Today.AddMonths(1),
            _ => DateTime.Today
        };

        var upcomingMatches = MockMatches
            .Where(m => !string.IsNullOrEmpty(m.Date) && 
                       DateTime.Parse(m.Date).Date >= DateTime.Today &&
                       DateTime.Parse(m.Date).Date <= targetDate &&
                       !m.Minute.HasValue)
            .OrderBy(m => DateTime.Parse(m.Date))
            .ThenBy(m => m.Time)
            .ToList();

        return Task.FromResult(upcomingMatches.AsEnumerable());
    }

    public Task<IEnumerable<TeamInfo>> GetAvailableTeamsAsync()
    {
        var teams = TeamLogos.Select(t => new TeamInfo
        {
            Id = t.Key.ToLower().Replace(" ", "-"),
            Name = t.Key,
            Logo = t.Value,
            League = GetTeamLeague(t.Key),
            LeagueLogo = GetLeagueLogo(GetTeamLeague(t.Key))
        });

        return Task.FromResult(teams.AsEnumerable());
    }

    private string GetTeamLeague(string teamName) => teamName switch
    {
        "Manchester City" or "Arsenal" or "Liverpool" or "Manchester United" or "Chelsea" or "Tottenham" or "Newcastle" or "Aston Villa" => "Premier League",
        "Real Madrid" or "Barcelona" or "Atletico Madrid" or "Sevilla" or "Valencia" or "Real Betis" => "La Liga",
        "Bayern Munich" or "Borussia Dortmund" or "RB Leipzig" or "Bayer Leverkusen" => "Bundesliga",
        "Inter" or "AC Milan" or "Juventus" or "Napoli" => "Serie A",
        "PSG" => "Ligue 1",
        _ => "Unknown"
    };

    private string GetLeagueLogo(string league) => LeagueLogos.TryGetValue(league, out var logo) ? logo : "https://media.api-sports.io/football/leagues/1.png";
} 