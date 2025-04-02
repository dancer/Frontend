using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Bet
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [ForeignKey("UserId")]
    public User? User { get; set; }
    
    [Required]
    public string MatchId { get; set; } = string.Empty;
    
    [Required]
    public string Selection { get; set; } = string.Empty; // "team1Win", "draw", "team2Win"
    
    [Required]
    public decimal Stake { get; set; }
    
    [Required]
    public decimal Odds { get; set; }
    
    public decimal? PotentialWin { get; set; }
    
    public string Status { get; set; } = "Pending"; // Pending, Won, Lost, Cashed Out
    
    public decimal? CashoutAmount { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? SettledAt { get; set; }
    
    // Match details for reference
    public string MatchName { get; set; } = string.Empty;
    public DateTime MatchDate { get; set; }
    public bool IsLive { get; set; }
} 