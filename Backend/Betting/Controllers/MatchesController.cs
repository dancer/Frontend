using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Betting.Data;
using Betting.Models;

namespace Betting.Controllers;

[ApiController]
[Route("api/matches")]
public class MatchesController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<MatchesController> _logger;

    public MatchesController(ApplicationDbContext context, ILogger<MatchesController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet]
    public async Task<IActionResult> GetMatches([FromQuery] string? status = null)
    {
        try
        {
            var query = _context.Matches.AsQueryable();

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
            _logger.LogError(ex, "Error getting matches");
            return StatusCode(500, new { error = "Failed to get matches" });
        }
    }

    [HttpGet("live")]
    public async Task<IActionResult> GetLiveMatches()
    {
        try
        {
            var matches = await _context.Matches
                .Where(m => m.IsLive)
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
            _logger.LogError(ex, "Error getting live matches");
            return StatusCode(500, new { error = "Failed to get live matches" });
        }
    }

    [HttpGet("featured")]
    public async Task<IActionResult> GetFeaturedMatches()
    {
        try
        {
            var matches = await _context.Matches
                .Where(m => m.IsFeatured)
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
            _logger.LogError(ex, "Error getting featured matches");
            return StatusCode(500, new { error = "Failed to get featured matches" });
        }
    }
} 