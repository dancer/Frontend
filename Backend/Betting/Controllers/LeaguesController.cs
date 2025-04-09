using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Betting.Data;
using Betting.Models;

namespace Betting.Controllers;

[ApiController]
[Route("api/leagues")]
public class LeaguesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<LeaguesController> _logger;

    public LeaguesController(ApplicationDbContext context, ILogger<LeaguesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetLeagues()
    {
        try
        {
            var leagues = await _context.Leagues
                .OrderBy(l => l.Priority)
                .Select(l => new
                {
                    l.Id,
                    l.Name,
                    l.Country,
                    l.Logo,
                    l.IsFeatured,
                    ActiveMatches = l.Matches.Count(m => m.Status == "Live" || m.Status == "Scheduled")
                })
                .ToListAsync();

            return Ok(leagues);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting leagues");
            return StatusCode(500, new { error = "Failed to get leagues" });
        }
    }

    [HttpGet("{leagueId}/matches")]
    public async Task<IActionResult> GetLeagueMatches(string leagueId, [FromQuery] string? status = null)
    {
        try
        {
            var query = _context.Matches
                .Where(m => m.LeagueId == leagueId);

            if (!string.IsNullOrEmpty(status))
            {
                query = query.Where(m => m.Status == status);
            }

            var matches = await query
                .OrderBy(m => m.KickoffTime)
                .Select(m => new
                {
                    m.Id,
                    m.HomeTeamId,
                    m.HomeTeamName,
                    m.HomeTeamLogo,
                    m.HomeTeamScore,
                    m.AwayTeamId,
                    m.AwayTeamName,
                    m.AwayTeamLogo,
                    m.AwayTeamScore,
                    m.KickoffTime,
                    m.Status,
                    m.Minute,
                    m.HomeWinOdds,
                    m.DrawOdds,
                    m.AwayWinOdds,
                    m.IsFeatured,
                    m.IsLive,
                    League = new
                    {
                        m.League.Id,
                        m.League.Name,
                        m.League.Logo
                    }
                })
                .ToListAsync();

            return Ok(matches);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting league matches");
            return StatusCode(500, new { error = "Failed to get league matches" });
        }
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedLeagues()
    {
        try
        {
            var leagues = await _context.Leagues
                .Where(l => l.IsFeatured)
                .OrderBy(l => l.Priority)
                .Select(l => new
                {
                    l.Id,
                    l.Name,
                    l.Country,
                    l.Logo,
                    ActiveMatches = l.Matches.Count(m => m.Status == "Live" || m.Status == "Scheduled")
                })
                .ToListAsync();

            return Ok(leagues);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting featured leagues");
            return StatusCode(500, new { error = "Failed to get featured leagues" });
        }
    }
} 