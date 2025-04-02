using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;
using Microsoft.EntityFrameworkCore;
using Betting.Data;
using Betting.Models;
using System.Security.Claims;

namespace Betting.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class BetsController : ControllerBase
{
    private readonly ApplicationDbContext _context;
    private readonly ILogger<BetsController> _logger;

    public BetsController(ApplicationDbContext context, ILogger<BetsController> logger)
    {
        _context = context;
        _logger = logger;
    }

    [HttpGet("user")]
    public async Task<IActionResult> GetUserBets()
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var userIdGuid = Guid.Parse(userId);
            var bets = await _context.Bets
                .Where(b => b.UserId == userIdGuid)
                .OrderByDescending(b => b.CreatedAt)
                .ToListAsync();

            // If user has no bets, add a mock active bet for testing
            if (!bets.Any())
            {
                var mockBet = new Bet
                {
                    Id = Guid.NewGuid(),
                    UserId = userIdGuid,
                    MatchId = "mock-match-1",
                    MatchName = "Manchester City vs Arsenal",
                    Tournament = "Premier League",
                    MatchDate = DateTime.UtcNow.AddDays(1),
                    Selection = "Manchester City",
                    Odds = 1.85m,
                    Stake = 50,
                    PotentialWin = 92.5m,
                    Status = "active",
                    IsLive = false,
                    CreatedAt = DateTime.UtcNow,
                    User = await _context.Users.FindAsync(userIdGuid)
                };

                _context.Bets.Add(mockBet);
                await _context.SaveChangesAsync();
                bets = new List<Bet> { mockBet };
            }

            return Ok(bets);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error getting user bets");
            return StatusCode(500, new { error = "Failed to get bets" });
        }
    }

    [HttpPost]
    public async Task<IActionResult> PlaceBet([FromBody] PlaceBetRequest request)
    {
        try
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            var userIdGuid = Guid.Parse(userId);
            var user = await _context.Users.FindAsync(userIdGuid);
            if (user == null)
            {
                return NotFound(new { error = "User not found" });
            }

            if (user.Balance < request.Stake)
            {
                return BadRequest(new { error = "Insufficient balance" });
            }

            // Create new bet
            var bet = new Bet
            {
                UserId = userIdGuid,
                MatchId = request.MatchId,
                MatchName = request.MatchName,
                Selection = request.Selection,
                Odds = request.Odds,
                Stake = request.Stake,
                PotentialWin = request.Stake * request.Odds,
                Status = "active",
                IsLive = request.IsLive,
                CreatedAt = DateTime.UtcNow
            };

            // Update user balance
            user.Balance -= request.Stake;

            // Create transaction record
            var transaction = new Transaction
            {
                UserId = userIdGuid,
                Type = "bet",
                Amount = -request.Stake,
                BalanceAfter = user.Balance,
                BetId = bet.Id,
                Description = $"Bet placed on {request.MatchName}",
                CreatedAt = DateTime.UtcNow
            };

            _context.Bets.Add(bet);
            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            return Ok(bet);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error placing bet");
            return StatusCode(500, new { error = "Failed to place bet" });
        }
    }

    [HttpPost("{id}/cashout")]
    public async Task<IActionResult> CashoutBet(string id)
    {
        try
        {
            _logger.LogInformation($"Attempting to cashout bet {id}");
            
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                _logger.LogWarning("Unauthorized cashout attempt - no user ID found");
                return Unauthorized();
            }

            var userIdGuid = Guid.Parse(userId);
            if (!Guid.TryParse(id, out var betId))
            {
                _logger.LogWarning($"Invalid bet ID format: {id}");
                return BadRequest(new { error = "Invalid bet ID format" });
            }

            var bet = await _context.Bets
                .Include(b => b.User)
                .FirstOrDefaultAsync(b => b.Id == betId);

            if (bet == null)
            {
                _logger.LogWarning($"Bet not found: {id}");
                return NotFound(new { error = "Bet not found" });
            }

            if (bet.UserId != userIdGuid)
            {
                _logger.LogWarning($"Unauthorized cashout attempt for bet {id} by user {userId}");
                return Unauthorized(new { error = "You are not authorized to cashout this bet" });
            }

            if (bet.Status != "active")
            {
                _logger.LogWarning($"Cannot cashout bet {id} - status is {bet.Status}");
                return BadRequest(new { error = "Bet cannot be cashed out" });
            }

            if (bet.IsLive)
            {
                _logger.LogWarning($"Cannot cashout live bet {id}");
                return BadRequest(new { error = "Live bets cannot be cashed out" });
            }

            // Calculate cashout amount (75% of potential win)
            var cashoutAmount = bet.PotentialWin * 0.75m;
            bet.Status = "cashout";
            bet.CashoutAmount = cashoutAmount;
            bet.SettledAt = DateTime.UtcNow;

            // Update user balance
            bet.User.Balance += cashoutAmount;

            // Create transaction record
            var transaction = new Transaction
            {
                UserId = userIdGuid,
                Type = "cashout",
                Amount = cashoutAmount,
                BalanceAfter = bet.User.Balance,
                BetId = bet.Id,
                Description = $"Cashout from bet on {bet.MatchName}",
                CreatedAt = DateTime.UtcNow
            };

            _context.Transactions.Add(transaction);
            await _context.SaveChangesAsync();

            _logger.LogInformation($"Successfully cashed out bet {id} for amount {cashoutAmount}");
            
            // Return both updated bet and user data
            return Ok(new
            {
                bet = new
                {
                    bet.Id,
                    bet.MatchId,
                    bet.MatchName,
                    bet.Selection,
                    bet.Odds,
                    bet.Stake,
                    bet.PotentialWin,
                    bet.Status,
                    bet.CashoutAmount,
                    bet.CreatedAt,
                    bet.SettledAt,
                    bet.IsLive
                },
                user = new
                {
                    bet.User.Id,
                    bet.User.Email,
                    bet.User.Username,
                    bet.User.Balance,
                    bet.User.CreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, $"Error cashing out bet {id}");
            return StatusCode(500, new { error = "Failed to cashout bet" });
        }
    }
}

public class PlaceBetRequest
{
    public string MatchId { get; set; } = string.Empty;
    public string MatchName { get; set; } = string.Empty;
    public string Selection { get; set; } = string.Empty;
    public decimal Odds { get; set; }
    public decimal Stake { get; set; }
    public bool IsLive { get; set; }
} 