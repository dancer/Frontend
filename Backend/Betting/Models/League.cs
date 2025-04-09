using System.ComponentModel.DataAnnotations;

namespace Betting.Models;

public class League
{
    [Key]
    public string Id { get; set; } = string.Empty;
    public string Name { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string Logo { get; set; } = string.Empty;
    public bool IsFeatured { get; set; }
    public int Priority { get; set; }
    public ICollection<Match> Matches { get; set; } = new List<Match>();
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; } = DateTime.UtcNow;
} 