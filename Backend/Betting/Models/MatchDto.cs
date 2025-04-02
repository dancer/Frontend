using System.Text.Json.Serialization;

namespace Betting.Models;

public class MatchDto
{
    public string Id { get; set; } = string.Empty;
    public string Tournament { get; set; } = string.Empty;
    public string TournamentLogo { get; set; } = string.Empty;
    public string Region { get; set; } = string.Empty;
    public string Date { get; set; } = string.Empty;
    public string Time { get; set; } = string.Empty;
    public TeamDto Team1 { get; set; } = new();
    public TeamDto Team2 { get; set; } = new();
    public int? Minute { get; set; }
    public MatchOddsDto Odds { get; set; } = new();
}

public class TeamDto
{
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public int? Score { get; set; }
}

public class MatchOddsDto
{
    [JsonPropertyName("team1Win")]
    public decimal Team1Win { get; set; } = 1.5m;

    public decimal Draw { get; set; } = 3.5m;

    [JsonPropertyName("team2Win")]
    public decimal Team2Win { get; set; } = 1.5m;
} 