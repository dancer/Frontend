using Microsoft.AspNetCore.Mvc;
using Betting.Services;
using Betting.Models;
using Microsoft.Extensions.Logging;

namespace Betting.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IAuthService _authService;
    private readonly ILogger<AuthController> _logger;

    public AuthController(IAuthService authService, ILogger<AuthController> logger)
    {
        _authService = authService;
        _logger = logger;
    }

    public record RegisterRequest(string Email, string Username, string Password);
    public record LoginRequest(string Email, string Password);

    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Username) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { error = "Email, username, and password are required" });
            }

            var (user, error) = await _authService.RegisterAsync(request.Email, request.Username, request.Password);
            
            if (error != null || user == null)
            {
                _logger.LogWarning("Registration failed: {Error}", error);
                return BadRequest(new { error = error ?? "Registration failed" });
            }

            var token = _authService.GenerateJwtToken(user);
            _logger.LogInformation("User registered successfully: {Username}", user.Username);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.Username,
                    user.Balance,
                    user.CreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during registration");
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }

    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginRequest request)
    {
        try
        {
            if (string.IsNullOrWhiteSpace(request.Email) || string.IsNullOrWhiteSpace(request.Password))
            {
                return BadRequest(new { error = "Email and password are required" });
            }

            var (user, error) = await _authService.LoginAsync(request.Email, request.Password);
            
            if (error != null || user == null)
            {
                _logger.LogWarning("Login failed: {Error}", error);
                return BadRequest(new { error = error ?? "Login failed" });
            }

            var token = _authService.GenerateJwtToken(user);
            _logger.LogInformation("User logged in successfully: {Username}", user.Username);

            return Ok(new
            {
                token,
                user = new
                {
                    user.Id,
                    user.Email,
                    user.Username,
                    user.Balance,
                    user.CreatedAt
                }
            });
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Error during login");
            return StatusCode(500, new { error = "An unexpected error occurred" });
        }
    }
} 