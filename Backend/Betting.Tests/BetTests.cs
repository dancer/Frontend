using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.ComponentModel.DataAnnotations;
using Betting.Models;
using System.Collections.Generic;
using System.Linq;
using Microsoft.Extensions.DependencyInjection;

namespace Betting.Tests
{
    [TestClass]
    public class BetTests
    {
        [TestMethod]
        public void CreateBet_WithValidData_ShouldSetPropertiesCorrectly()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var matchId = "match1";
            decimal odds = 2.5m;
            decimal stake = 100m;

            // Act
            var bet = new Bet
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                MatchId = matchId,
                Selection = "HomeWin",
                Odds = odds,
                Stake = stake,
                PotentialWin = odds * stake,
                IsLive = false,
                MatchName = "Team A vs Team B",
                Tournament = "Premier League",
                MatchDate = DateTime.UtcNow.AddDays(1)
            };

            // Assert
            Assert.IsNotNull(bet);
            Assert.AreEqual(userId, bet.UserId);
            Assert.AreEqual(matchId, bet.MatchId);
            Assert.AreEqual(odds, bet.Odds);
            Assert.AreEqual(stake, bet.Stake);
            Assert.AreEqual(odds * stake, bet.PotentialWin);
            Assert.AreEqual("active", bet.Status); // Default status should be "active"
            Assert.IsFalse(bet.IsLive);
        }

        [TestMethod]
        public void CanCashout_ShouldBeTrueForActiveBetThatIsNotLive()
        {
            // Arrange
            var bet = new Bet
            {
                Status = "active",
                IsLive = false
            };

            // Assert
            Assert.IsTrue(bet.CanCashout);
        }

        [TestMethod]
        public void CanCashout_ShouldBeFalseForLiveBet()
        {
            // Arrange
            var bet = new Bet
            {
                Status = "active",
                IsLive = true
            };

            // Assert
            Assert.IsFalse(bet.CanCashout);
        }

        [TestMethod]
        public void CanCashout_ShouldBeFalseForNonActiveBet()
        {
            // Arrange
            var bet = new Bet
            {
                Status = "won",
                IsLive = false
            };

            // Assert
            Assert.IsFalse(bet.CanCashout);
        }

        [TestMethod]
        public void RequiredFields_ShouldBeValidated()
        {
            // Arrange
            var bet = new Bet(); // Empty bet
            bet.MatchId = string.Empty; // Ensure string properties are empty, not just default
            bet.Selection = string.Empty;

            // Act
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(bet);
            bool isValid = Validator.TryValidateObject(bet, validationContext, validationResults, validateAllProperties: true);

            // Assert
            Assert.IsFalse(isValid, "Validation should fail for an empty Bet object");
            Assert.IsTrue(validationResults.Count > 0, "There should be validation errors");
            
            // Output errors for debugging
            foreach (var error in validationResults)
            {
                Console.WriteLine($"Error: {error.ErrorMessage}, Property: {string.Join(", ", error.MemberNames)}");
            }
        }
    }
}