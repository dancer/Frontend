using System.Text.Json.Serialization;

namespace Betting.Models;

public class Match
{
    [JsonPropertyName("fixture")]
    public Fixture Fixture { get; set; } = new();

    [JsonPropertyName("league")]
    public League League { get; set; } = new();

    [JsonPropertyName("teams")]
    public Teams Teams { get; set; } = new();

    [JsonPropertyName("goals")]
    public Goals Goals { get; set; } = new();

    [JsonPropertyName("score")]
    public Score Score { get; set; } = new();
}

public class Fixture
{
    [JsonPropertyName("id")]
    public long Id { get; set; }

    [JsonPropertyName("date")]
    public DateTime Date { get; set; }

    [JsonPropertyName("timestamp")]
    public long Timestamp { get; set; }

    [JsonPropertyName("status")]
    public Status Status { get; set; } = new();
}

public class Status
{
    [JsonPropertyName("long")]
    public string Long { get; set; } = string.Empty;

    [JsonPropertyName("short")]
    public string Short { get; set; } = string.Empty;

    [JsonPropertyName("elapsed")]
    public int? Elapsed { get; set; }
}

public class League
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("country")]
    public string Country { get; set; } = string.Empty;

    [JsonPropertyName("logo")]
    public string Logo { get; set; } = string.Empty;

    [JsonPropertyName("flag")]
    public string Flag { get; set; } = string.Empty;

    [JsonPropertyName("season")]
    public int Season { get; set; }

    [JsonPropertyName("round")]
    public string Round { get; set; } = string.Empty;
}

public class Teams
{
    [JsonPropertyName("home")]
    public Team Home { get; set; } = new();

    [JsonPropertyName("away")]
    public Team Away { get; set; } = new();
}

public class Team
{
    [JsonPropertyName("id")]
    public int Id { get; set; }

    [JsonPropertyName("name")]
    public string Name { get; set; } = string.Empty;

    [JsonPropertyName("logo")]
    public string Logo { get; set; } = string.Empty;

    [JsonPropertyName("winner")]
    public bool? Winner { get; set; }
}

public class Goals
{
    [JsonPropertyName("home")]
    public int? Home { get; set; }

    [JsonPropertyName("away")]
    public int? Away { get; set; }
}

public class Score
{
    [JsonPropertyName("halftime")]
    public Goals Halftime { get; set; } = new();

    [JsonPropertyName("fulltime")]
    public Goals Fulltime { get; set; } = new();

    [JsonPropertyName("extratime")]
    public Goals? Extratime { get; set; }

    [JsonPropertyName("penalty")]
    public Goals? Penalty { get; set; }
} 