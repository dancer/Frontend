using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Betting.Models;

public class Transaction
{
    [Key]
    public Guid Id { get; set; }
    
    [Required(ErrorMessage = "UserId is required")]
    public Guid UserId { get; set; }
    
    [Required(ErrorMessage = "Transaction type is required")]
    public string Type { get; set; } = string.Empty; // bet, win, cashout, bonus
    
    [Required(ErrorMessage = "Amount is required")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal Amount { get; set; }
    
    [Required(ErrorMessage = "Balance after transaction is required")]
    [Column(TypeName = "decimal(18,2)")]
    public decimal BalanceAfter { get; set; }
    
    public Guid? BetId { get; set; }
    
    public string Description { get; set; } = string.Empty;
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public virtual User User { get; set; } = null!;
    public virtual Bet? Bet { get; set; }
} 