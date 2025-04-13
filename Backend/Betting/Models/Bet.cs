using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Betting.Models;

public class Bet
{
    [Key]
    public Guid Id { get; set; }
    
    [Required(ErrorMessage = "UserId is required")]
    public Guid UserId { get; set; }
    
    [Required(ErrorMessage = "MatchId is required")]
    public string MatchId { get; set; } = string.Empty;
    
    [Required(ErrorMessage = "Selection is required")]
    public string Selection { get; set; } = string.Empty; // team1Win, draw, team2Win
    
    [Required(ErrorMessage = "Odds is required")]
    [Column(TypeName = "decimal(18,2)")]
    [Range(1.01, 1000.0, ErrorMessage = "Odds must be between 1.01 and 1000")]
    public decimal Odds { get; set; }
    
    [Required(ErrorMessage = "Stake is required")]
    [Column(TypeName = "decimal(18,2)")]
    [Range(0.01, 10000.0, ErrorMessage = "Stake must be between 0.01 and 10000")]
    public decimal Stake { get; set; }
    
    [Required(ErrorMessage = "PotentialWin is required")]
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