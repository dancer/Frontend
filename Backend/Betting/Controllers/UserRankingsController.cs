using Microsoft.AspNetCore.Mvc;
using Betting.Data;
using Betting.Models;
using Microsoft.EntityFrameworkCore;
using Swashbuckle.AspNetCore.Annotations;

namespace Betting.Controllers;

/// <summary>
/// Manages user rankings and leaderboard functionality
/// </summary>
[ApiController]
[Route("api/[controller]")]
[Produces("application/json")]
[Tags("Rankings")]
public class UserRankingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    /// <summary>
    /// Initializes a new instance of the UserRankingsController
    /// </summary>
    /// <param name="context">The database context</param>
    public UserRankingsController(ApplicationDbContext context)
    {
        _context = context;
    }

    /// <summary>
    /// Sorts users by their coin balance using bubble sort algorithm
    /// </summary>
    /// <param name="users">List of users to sort</param>
    private void BubbleSort(List<User> users)
    {
        int n = users.Count;
        for (int i = 0; i < n - 1; i++)
        {
            for (int j = 0; j < n - i - 1; j++)
            {
                if (users[j].Balance > users[j + 1].Balance)
                {
                    // Swap users[j] and users[j + 1]
                    var temp = users[j];
                    users[j] = users[j + 1];
                    users[j + 1] = temp;
                }
            }
        }
    }

    /// <summary>
    /// Gets all users sorted by their coin balance (lowest to highest)
    /// </summary>
    /// <remarks>
    /// Sample request:
    /// 
    ///     GET /api/userrankings/sorted
    ///     
    /// Sample response:
    /// 
    ///     [
    ///         {
    ///             "username": "player1",
    ///             "coins": 50
    ///         },
    ///         {
    ///             "username": "player2",
    ///             "coins": 100
    ///         }
    ///     ]
    /// </remarks>
    /// <returns>A list of users with their usernames and coin balances</returns>
    /// <response code="200">Returns the sorted list of users</response>
    /// <response code="500">If there was an internal server error</response>
    [HttpGet("sorted")]
    [SwaggerOperation(
        Summary = "Get sorted user rankings",
        Description = "Retrieves all users sorted by their coin balance from lowest to highest using bubble sort",
        OperationId = "GetSortedUsers",
        Tags = new[] { "Rankings" }
    )]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(StatusCodes.Status500InternalServerError)]
    public async Task<IActionResult> GetSortedUsers()
    {
        try
        {
            var users = await _context.Users.ToListAsync();
            
            // Apply bubble sort
            BubbleSort(users);
            
            // Map to simple response objects
            var rankings = users.Select(u => new
            {
                Username = u.Username,
                Coins = u.Balance
            }).ToList();

            return Ok(rankings);
        }
        catch (Exception ex)
        {
            return StatusCode(500, new { error = "An error occurred while retrieving rankings" });
        }
    }
} 