using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Models;

public class Transaction
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    public string UserId { get; set; } = string.Empty;
    
    [ForeignKey("UserId")]
    public User? User { get; set; }
    
    [Required]
    public decimal Amount { get; set; }
    
    [Required]
    public string Type { get; set; } = string.Empty; // "Deposit", "Withdraw", "Bet", "Win", "Cashout"
    
    public string? BetId { get; set; }
    
    [ForeignKey("BetId")]
    public Bet? Bet { get; set; }
    
    public string Status { get; set; } = "Completed";
    
    public decimal BalanceAfter { get; set; }
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public string Description { get; set; } = string.Empty;
} 