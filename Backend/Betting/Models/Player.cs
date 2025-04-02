namespace Betting.Models;

public class Player
{
    public int Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string? CommonName { get; set; }
    public string? Position { get; set; }
    public string? Nationality { get; set; }
    public string? CurrentTeam { get; set; }
    public int? Age { get; set; }
    public string? ImageUrl { get; set; }
}

public class PlayerSearchResponse
{
    public bool Success { get; set; }
    public List<Player> Players { get; set; } = new();
} 