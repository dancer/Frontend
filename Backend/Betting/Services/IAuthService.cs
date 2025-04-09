using Betting.Models;

namespace Betting.Services;

public interface IAuthService
{
    Task<(User? user, string? error)> RegisterAsync(string email, string username, string password);
    Task<(User? user, string? error)> LoginAsync(string email, string password);
    Task<User?> GetUserByIdAsync(Guid userId);
    string GenerateJwtToken(User user);
    Task<string?> ChangePasswordAsync(Guid userId, string currentPassword, string newPassword);
} 