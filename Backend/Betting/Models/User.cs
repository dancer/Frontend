using System.ComponentModel.DataAnnotations;

namespace Betting.Models;

public class User
{
    [Key]
    public Guid Id { get; set; }
    
    [Required]
    [EmailAddress]
    public string Email { get; set; } = string.Empty;
    
    [Required]
    public string Username { get; set; } = string.Empty;
    
    [Required]
    public string PasswordHash { get; set; } = string.Empty;
    
    public decimal Balance { get; set; } = 100; // Initial balance for new users
    
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    
    // Navigation properties
    public List<Bet> Bets { get; set; } = new();
    public List<Transaction> Transactions { get; set; } = new();
    public List<FavoriteTeam> FavoriteTeams { get; set; } = new();
} 