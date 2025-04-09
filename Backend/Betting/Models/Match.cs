using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Betting.Models;

public class Match
{
    [Key]
    public string Id { get; set; } = string.Empty;
    
    public string LeagueId { get; set; } = string.Empty;
    [ForeignKey("LeagueId")]
    public League? League { get; set; }
    
    public string HomeTeamId { get; set; } = string.Empty;
    public string HomeTeamName { get; set; } = string.Empty;
    public string HomeTeamLogo { get; set; } = string.Empty;
    public int? HomeTeamScore { get; set; }
    
    public string AwayTeamId { get; set; } = string.Empty;
    public string AwayTeamName { get; set; } = string.Empty;
    public string AwayTeamLogo { get; set; } = string.Empty;
    public int? AwayTeamScore { get; set; }
    
    public DateTime KickoffTime { get; set; }
    public string Status { get; set; } = "Scheduled"; // Scheduled, Live, Finished, Postponed, Cancelled
    public int? Minute { get; set; }
    
    public decimal HomeWinOdds { get; set; }
    public decimal DrawOdds { get; set; }
    public decimal AwayWinOdds { get; set; }
    
    public bool IsFeatured { get; set; }
    public bool IsLive { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
}