using System.ComponentModel.DataAnnotations;

namespace Backend.Models;

public class User
{
    [Key]
    public string Id { get; set; } = Guid.NewGuid().ToString();
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public decimal Balance { get; set; } = 100; // Default balance of 100 coins for new users
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    public List<Bet> Bets { get; set; } = new();
    
    public List<Transaction> Transactions { get; set; } = new();
} 