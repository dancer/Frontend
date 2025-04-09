using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace Betting.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Leagues",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    Name = table.Column<string>(type: "TEXT", nullable: false),
                    Country = table.Column<string>(type: "TEXT", nullable: false),
                    Logo = table.Column<string>(type: "TEXT", nullable: false),
                    IsFeatured = table.Column<bool>(type: "INTEGER", nullable: false),
                    Priority = table.Column<int>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Leagues", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    Email = table.Column<string>(type: "TEXT", nullable: false),
                    Username = table.Column<string>(type: "TEXT", nullable: false),
                    PasswordHash = table.Column<string>(type: "TEXT", nullable: false),
                    Balance = table.Column<decimal>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Matches",
                columns: table => new
                {
                    Id = table.Column<string>(type: "TEXT", nullable: false),
                    LeagueId = table.Column<string>(type: "TEXT", nullable: false),
                    HomeTeamId = table.Column<string>(type: "TEXT", nullable: false),
                    HomeTeamName = table.Column<string>(type: "TEXT", nullable: false),
                    HomeTeamLogo = table.Column<string>(type: "TEXT", nullable: false),
                    HomeTeamScore = table.Column<int>(type: "INTEGER", nullable: true),
                    AwayTeamId = table.Column<string>(type: "TEXT", nullable: false),
                    AwayTeamName = table.Column<string>(type: "TEXT", nullable: false),
                    AwayTeamLogo = table.Column<string>(type: "TEXT", nullable: false),
                    AwayTeamScore = table.Column<int>(type: "INTEGER", nullable: true),
                    KickoffTime = table.Column<DateTime>(type: "TEXT", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    Minute = table.Column<int>(type: "INTEGER", nullable: true),
                    HomeWinOdds = table.Column<decimal>(type: "TEXT", nullable: false),
                    DrawOdds = table.Column<decimal>(type: "TEXT", nullable: false),
                    AwayWinOdds = table.Column<decimal>(type: "TEXT", nullable: false),
                    IsFeatured = table.Column<bool>(type: "INTEGER", nullable: false),
                    IsLive = table.Column<bool>(type: "INTEGER", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    UpdatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Matches", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Matches_Leagues_LeagueId",
                        column: x => x.LeagueId,
                        principalTable: "Leagues",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Bets",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    MatchId = table.Column<string>(type: "TEXT", nullable: false),
                    Selection = table.Column<string>(type: "TEXT", nullable: false),
                    Odds = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    Stake = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    PotentialWin = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    IsLive = table.Column<bool>(type: "INTEGER", nullable: false),
                    Status = table.Column<string>(type: "TEXT", nullable: false),
                    CashoutAmount = table.Column<decimal>(type: "decimal(18,2)", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false),
                    SettledAt = table.Column<DateTime>(type: "TEXT", nullable: true),
                    MatchName = table.Column<string>(type: "TEXT", nullable: false),
                    Tournament = table.Column<string>(type: "TEXT", nullable: false),
                    MatchDate = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Bets", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Bets_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "FavoriteTeams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    TeamId = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FavoriteTeams", x => x.Id);
                    table.ForeignKey(
                        name: "FK_FavoriteTeams_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "Transactions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "TEXT", nullable: false),
                    UserId = table.Column<Guid>(type: "TEXT", nullable: false),
                    Type = table.Column<string>(type: "TEXT", nullable: false),
                    Amount = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BalanceAfter = table.Column<decimal>(type: "decimal(18,2)", nullable: false),
                    BetId = table.Column<Guid>(type: "TEXT", nullable: true),
                    Description = table.Column<string>(type: "TEXT", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "TEXT", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Transactions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Transactions_Bets_BetId",
                        column: x => x.BetId,
                        principalTable: "Bets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.SetNull);
                    table.ForeignKey(
                        name: "FK_Transactions_Users_UserId",
                        column: x => x.UserId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Leagues",
                columns: new[] { "Id", "Country", "CreatedAt", "IsFeatured", "Logo", "Name", "Priority", "UpdatedAt" },
                values: new object[,]
                {
                    { "bundesliga", "Germany", new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460), true, "https://media.api-sports.io/football/leagues/78.png", "Bundesliga", 3, new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460) },
                    { "laliga", "Spain", new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460), true, "https://media.api-sports.io/football/leagues/140.png", "La Liga", 2, new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460) },
                    { "ligue1", "France", new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460), true, "https://media.api-sports.io/football/leagues/61.png", "Ligue 1", 5, new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460) },
                    { "pl", "England", new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460), true, "https://media.api-sports.io/football/leagues/39.png", "Premier League", 1, new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460) },
                    { "seriea", "Italy", new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460), true, "https://media.api-sports.io/football/leagues/135.png", "Serie A", 4, new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6460) }
                });

            migrationBuilder.InsertData(
                table: "Matches",
                columns: new[] { "Id", "AwayTeamId", "AwayTeamLogo", "AwayTeamName", "AwayTeamScore", "AwayWinOdds", "CreatedAt", "DrawOdds", "HomeTeamId", "HomeTeamLogo", "HomeTeamName", "HomeTeamScore", "HomeWinOdds", "IsFeatured", "IsLive", "KickoffTime", "LeagueId", "Minute", "Status", "UpdatedAt" },
                values: new object[,]
                {
                    { "match1", "liv", "https://media.api-sports.io/football/teams/40.png", "Liverpool", null, 3.40m, new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6510), 3.50m, "mci", "https://media.api-sports.io/football/teams/50.png", "Manchester City", null, 2.10m, true, false, new DateTime(2025, 4, 9, 7, 37, 51, 62, DateTimeKind.Utc).AddTicks(6510), "pl", null, "Scheduled", new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6510) },
                    { "match2", "bar", "https://media.api-sports.io/football/teams/529.png", "Barcelona", null, 3.20m, new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6520), 3.30m, "mad", "https://media.api-sports.io/football/teams/541.png", "Real Madrid", null, 2.20m, true, false, new DateTime(2025, 4, 9, 8, 37, 51, 62, DateTimeKind.Utc).AddTicks(6520), "laliga", null, "Scheduled", new DateTime(2025, 4, 9, 5, 37, 51, 62, DateTimeKind.Utc).AddTicks(6520) }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Bets_UserId",
                table: "Bets",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_FavoriteTeams_UserId_TeamId",
                table: "FavoriteTeams",
                columns: new[] { "UserId", "TeamId" },
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Matches_LeagueId",
                table: "Matches",
                column: "LeagueId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_BetId",
                table: "Transactions",
                column: "BetId");

            migrationBuilder.CreateIndex(
                name: "IX_Transactions_UserId",
                table: "Transactions",
                column: "UserId");

            migrationBuilder.CreateIndex(
                name: "IX_Users_Email",
                table: "Users",
                column: "Email",
                unique: true);

            migrationBuilder.CreateIndex(
                name: "IX_Users_Username",
                table: "Users",
                column: "Username",
                unique: true);
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FavoriteTeams");

            migrationBuilder.DropTable(
                name: "Matches");

            migrationBuilder.DropTable(
                name: "Transactions");

            migrationBuilder.DropTable(
                name: "Leagues");

            migrationBuilder.DropTable(
                name: "Bets");

            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
