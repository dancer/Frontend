using Betting.Models;
using Betting.Services;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;

namespace Betting.Controllers;

[ApiController]
[Route("api/[controller]")]
public class FootballController : ControllerBase
{
    private readonly IFootballDataService _footballDataService;
    private readonly ILogger<FootballController> _logger;

    public FootballController(IFootballDataService footballDataService, ILogger<FootballController> logger)
    {
        _footballDataService = footballDataService;
        _logger = logger;
    }

    [HttpGet("players/search")]
    public async Task<ActionResult<PlayerSearchResponse>> SearchPlayers([FromQuery] string query)
    {
        if (string.IsNullOrWhiteSpace(query))
            return BadRequest("Search query cannot be empty");

        try
        {
            var result = await _footballDataService.SearchPlayersAsync(query);
            return Ok(result);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error searching for players with query: {Query}", query);
            return StatusCode(500, "An error occurred while searching for players");
        }
    }

    [HttpGet("live")]
    public async Task<IActionResult> GetLiveMatches()
    {
        try
        {
            var matches = await _footballDataService.GetLiveMatchesAsync();
            return Ok(matches);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching live matches");
            return StatusCode(500, "An error occurred while fetching live matches");
        }
    }

    [HttpGet("upcoming")]
    public async Task<IActionResult> GetUpcomingMatches([FromQuery] string date = "today")
    {
        try
        {
            var matches = await _footballDataService.GetUpcomingMatchesAsync(date);
            return Ok(matches);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching upcoming matches");
            return StatusCode(500, "An error occurred while fetching upcoming matches");
        }
    }

    [HttpGet("teams")]
    public async Task<IActionResult> GetAvailableTeams()
    {
        try
        {
            var teams = await _footballDataService.GetAvailableTeamsAsync();
            return Ok(teams);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching available teams");
            return StatusCode(500, "An error occurred while fetching available teams");
        }
    }

    [HttpGet("stats")]
    public async Task<IActionResult> GetTeamStats()
    {
        try
        {
            var stats = await _footballDataService.GetTeamStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching team stats");
            return StatusCode(500, "An error occurred while fetching team stats");
        }
    }

    [HttpGet("playerstats")]
    public async Task<IActionResult> GetPlayerStats()
    {
        try
        {
            var stats = await _footballDataService.GetPlayerStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching player stats");
            return StatusCode(500, "An error occurred while fetching player stats");
        }
    }

    [HttpGet("leaguestats")]
    public async Task<IActionResult> GetLeagueStats()
    {
        try
        {
            var stats = await _footballDataService.GetLeagueStatsAsync();
            return Ok(stats);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error fetching league stats");
            return StatusCode(500, "An error occurred while fetching league stats");
        }
    }




} 