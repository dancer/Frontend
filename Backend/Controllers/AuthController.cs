using Microsoft.AspNetCore.Mvc;
using Backend.Services;

namespace Backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;

    public AuthController(IAuthService authService)
    {
        _authService = authService;
    }

    public record RegisterRequest(string Email, string Username, string Password);
    public record LoginRequest(string Email, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        var (user, error) = await _authService.RegisterAsync(request.Email, request.Username, request.Password);
        
        if (error != null)
        {
            return BadRequest(new { error });
        }

        return Ok(new
        {
            user.Id,
            user.Email,
            user.Username,
            user.Balance,
            user.CreatedAt
        });
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        var (token, error) = await _authService.LoginAsync(request.Email, request.Password);
        
        if (error != null)
        {
            return BadRequest(new { error });
        }

        return Ok(new { token });
    }
} 