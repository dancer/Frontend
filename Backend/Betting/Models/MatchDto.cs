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


public class TeamStatsDto
{
    public string TeamName { get; set; } = string.Empty;
    public string League { get; set; } = string.Empty;
    public int MP { get; set; }
    public int W { get; set; }
    public int D { get; set; }
    public int L { get; set; }
    public int GF { get; set; }
    public int GA { get; set; }
    public int CS { get; set; }
    public List<string> Form { get; set; } = new();
}
