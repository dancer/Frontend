using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Betting.Data;
using Betting.Models;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using BC = BCrypt.Net.BCrypt;

namespace Betting.Services;

public class AuthService : IAuthService
{
    private readonly ApplicationDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(ApplicationDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<(User? user, string? error)> RegisterAsync(string email, string username, string password)
    {
        if (await _context.Users.AnyAsync(u => u.Email == email))
        {
            return (null, "Email already exists");
        }

        if (await _context.Users.AnyAsync(u => u.Username == username))
        {
            return (null, "Username already exists");
        }

        var user = new User
        {
            Email = email,
            Username = username,
            PasswordHash = BC.HashPassword(password),
            Balance = 100, // Initial balance of 100 coins
            CreatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return (user, null);
    }

    public async Task<(User? user, string? error)> LoginAsync(string email, string password)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);

        if (user == null)
        {
            return (null, "Invalid email or password");
        }

        if (!BC.Verify(password, user.PasswordHash))
        {
            return (null, "Invalid email or password");
        }

        return (user, null);
    }

    public async Task<User?> GetUserByIdAsync(Guid userId)
    {
        return await _context.Users.FindAsync(userId);
    }

    public string GenerateJwtToken(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Username)
        };

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.UtcNow.AddDays(Convert.ToDouble(_configuration["Jwt:ExpiryInDays"])),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
} 