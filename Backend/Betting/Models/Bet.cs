using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Betting.Models;

public class Bet
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    public Guid UserId { get; set; }
    
    [Required]
    public string MatchId { get; set; } = string.Empty;
    
    [Required]
    public string Selection { get; set; } = string.Empty; // team1Win, draw, team2Win
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Odds { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Stake { get; set; }
    
    [Required]
    [Column(TypeName = "decimal(18,2)")]
    public decimal PotentialWin { get; set; }
    
    public bool IsLive { get; set; }
    
    public string Status { get; set; } = "active"; // active, won, lost, cashout
    
    [Column(TypeName = "decimal(18,2)")]
    public decimal? CashoutAmount { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public DateTime? SettledAt { get; set; }
    
    // Match details for historical reference
    public string MatchName { get; set; } = string.Empty;
    public string Tournament { get; set; } = string.Empty;
    public DateTime MatchDate { get; set; }
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    
    // Calculated property
    [NotMapped]
    public bool CanCashout => Status == "active" && !IsLive;
} 