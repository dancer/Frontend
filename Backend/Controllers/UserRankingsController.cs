using Microsoft.AspNetCore.Mvc;
using Backend.Data;
using Backend.Models;
using Microsoft.EntityFrameworkCore;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserRankingsController : ControllerBase
{
    private readonly ApplicationDbContext _context;

    public UserRankingsController(ApplicationDbContext context)
    {
        _context = context;
    }

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

    [HttpGet("sorted")]
    public async Task<IActionResult> GetSortedUsers()
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
} 