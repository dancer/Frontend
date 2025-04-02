using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Betting.Data;
using Betting.Models;
using System.Security.Claims;

namespace Betting.Controllers;

[ApiController]
[Route("api/users/favorites")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<FavoritesController> _logger;

    public class TeamInfo
    {
        public string Id { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public string Logo { get; set; } = string.Empty;
        public string League { get; set; } = string.Empty;
        public string LeagueLogo { get; set; } = string.Empty;
    }

    private static readonly Dictionary<string, TeamInfo> Teams = new()
    {
        ["mci"] = new TeamInfo { Id = "mci", Name = "Manchester City", Logo = "mci.svg", League = "Premier League", LeagueLogo = "pl.svg" },
        ["ars"] = new TeamInfo { Id = "ars", Name = "Arsenal", Logo = "ars.svg", League = "Premier League", LeagueLogo = "pl.svg" },
        ["liv"] = new TeamInfo { Id = "liv", Name = "Liverpool", Logo = "liv.svg", League = "Premier League", LeagueLogo = "pl.svg" },
        ["mad"] = new TeamInfo { Id = "mad", Name = "Real Madrid", Logo = "mad.svg", League = "La Liga", LeagueLogo = "laliga.svg" },
        ["bar"] = new TeamInfo { Id = "bar", Name = "Barcelona", Logo = "bar.svg", League = "La Liga", LeagueLogo = "laliga.svg" },
        ["bay"] = new TeamInfo { Id = "bay", Name = "Bayern Munich", Logo = "bay.svg", League = "Bundesliga", LeagueLogo = "bundesliga.svg" }
    };

    public FavoritesController(ApplicationDbContext context, ILogger<FavoritesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetFavorites()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var userIdGuid = Guid.Parse(userId);
            var user = await _context.Users
                .Include(u => u.FavoriteTeams)
                .FirstOrDefaultAsync(u => u.Id == userIdGuid);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            var favorites = user.FavoriteTeams
                .Select(ft => Teams.GetValueOrDefault(ft.TeamId))
                .Where(t => t != null)
                .ToList();

            return Ok(favorites);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting favorite teams");
            return StatusCode(500, new { error = "Failed to get favorite teams" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            if (!Teams.ContainsKey(request.TeamId))
            {
                return BadRequest(new { error = "Invalid team ID" });
            }

            var userIdGuid = Guid.Parse(userId);
            var user = await _context.Users
                .Include(u => u.FavoriteTeams)
                .FirstOrDefaultAsync(u => u.Id == userIdGuid);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            if (user.FavoriteTeams.Any(ft => ft.TeamId == request.TeamId))
            {
                return BadRequest(new { error = "Team already in favorites" });
            }

            var favorite = new FavoriteTeam
            {
                UserId = userIdGuid,
                TeamId = request.TeamId,
                CreatedAt = DateTime.UtcNow
            };

            user.FavoriteTeams.Add(favorite);
            await _context.SaveChangesAsync();

            return Ok(Teams[request.TeamId]);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error adding favorite team");
            return StatusCode(500, new { error = "Failed to add favorite team" });
        }
    }

    [HttpDelete("{teamId}")]
    public async Task<IActionResult> RemoveFavorite(string teamId)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var userIdGuid = Guid.Parse(userId);
            var user = await _context.Users
                .Include(u => u.FavoriteTeams)
                .FirstOrDefaultAsync(u => u.Id == userIdGuid);

            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            var favorite = user.FavoriteTeams.FirstOrDefault(ft => ft.TeamId == teamId);
            if (favorite == null)
            {
                return NotFound(new { error = "Team not found in favorites" });
            }

            user.FavoriteTeams.Remove(favorite);
            await _context.SaveChangesAsync();

            return Ok();
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error removing favorite team");
            return StatusCode(500, new { error = "Failed to remove favorite team" });
        }
    }
}

public class AddFavoriteRequest
{
    public string TeamId { get; set; } = string.Empty;
} 