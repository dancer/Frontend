using Betting.Models;
using Microsoft.EntityFrameworkCore;

namespace Betting.Data;

public class ApplicationDbContext : DbContext
{
    public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Bet> Bets { get; set; }
    public DbSet<Transaction> Transactions { get; set; }
    public DbSet<FavoriteTeam> FavoriteTeams { get; set; } = null!;
    public DbSet<League> Leagues { get; set; } = null!;
    public DbSet<Match> Matches { get; set; } = null!;

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // User configuration
        modelBuilder.Entity<User>(entity =>
        {
            entity.HasIndex(e => e.Username).IsUnique();
            entity.HasIndex(e => e.Email).IsUnique();
            
            entity.HasMany(e => e.Bets)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.Transactions)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasMany(e => e.FavoriteTeams)
                .WithOne(e => e.User)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Bet configuration
        modelBuilder.Entity<Bet>(entity =>
        {
            entity.HasOne(e => e.User)
                .WithMany(e => e.Bets)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        });

        // Transaction configuration
        modelBuilder.Entity<Transaction>(entity =>
        {
            entity.HasOne(e => e.User)
                .WithMany(e => e.Transactions)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasOne(e => e.Bet)
                .WithMany()
                .HasForeignKey(e => e.BetId)
                .OnDelete(DeleteBehavior.SetNull);
        });

        // FavoriteTeam configuration
        modelBuilder.Entity<FavoriteTeam>(entity =>
        {
            entity.HasOne(e => e.User)
                .WithMany(e => e.FavoriteTeams)
                .HasForeignKey(e => e.UserId)
                .OnDelete(DeleteBehavior.Cascade);

            entity.HasIndex(e => new { e.UserId, e.TeamId }).IsUnique();
        });

        // Seed initial leagues data
        modelBuilder.Entity<League>().HasData(
            new League { Id = "pl", Name = "Premier League", Country = "England", Logo = "/leagues/pl.svg", IsFeatured = true, Priority = 1 },
            new League { Id = "laliga", Name = "La Liga", Country = "Spain", Logo = "/leagues/laliga.svg", IsFeatured = true, Priority = 2 },
            new League { Id = "bundesliga", Name = "Bundesliga", Country = "Germany", Logo = "/leagues/bundesliga.svg", IsFeatured = true, Priority = 3 },
            new League { Id = "seriea", Name = "Serie A", Country = "Italy", Logo = "/leagues/seriea.svg", IsFeatured = true, Priority = 4 },
            new League { Id = "ligue1", Name = "Ligue 1", Country = "France", Logo = "/leagues/ligue1.svg", IsFeatured = true, Priority = 5 }
        );

        // Example match data
        modelBuilder.Entity<Match>().HasData(
            new Match
            {
                Id = "match1",
                LeagueId = "pl",
                HomeTeamId = "mci",
                HomeTeamName = "Manchester City",
                HomeTeamLogo = "/teams/mci.svg",
                AwayTeamId = "liv",
                AwayTeamName = "Liverpool",
                AwayTeamLogo = "/teams/liv.svg",
                KickoffTime = DateTime.UtcNow.AddHours(2),
                Status = "Scheduled",
                HomeWinOdds = 2.10m,
                DrawOdds = 3.50m,
                AwayWinOdds = 3.40m,
                IsFeatured = true
            },
            new Match
            {
                Id = "match2",
                LeagueId = "laliga",
                HomeTeamId = "mad",
                HomeTeamName = "Real Madrid",
                HomeTeamLogo = "/teams/mad.svg",
                AwayTeamId = "bar",
                AwayTeamName = "Barcelona",
                AwayTeamLogo = "/teams/bar.svg",
                KickoffTime = DateTime.UtcNow.AddHours(3),
                Status = "Scheduled",
                HomeWinOdds = 2.20m,
                DrawOdds = 3.30m,
                AwayWinOdds = 3.20m,
                IsFeatured = true
            }
        );
    }
} 