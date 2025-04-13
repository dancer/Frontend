using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using Betting.Models;
using Microsoft.Extensions.DependencyInjection;

namespace Betting.Tests
{
    [TestClass]
    public class TransactionTests
    {
        [TestMethod]
        public void Transaction_BetPlacement_ShouldBeCreatedCorrectly()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var betId = Guid.NewGuid();
            decimal amount = -100m;
            decimal balanceAfter = 900m;

            // Act
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = "bet",
                Amount = amount,
                BalanceAfter = balanceAfter,
                BetId = betId,
                Description = "Bet placed on Match A",
                CreatedAt = DateTime.UtcNow
            };

            // Assert
            Assert.IsNotNull(transaction);
            Assert.AreEqual(userId, transaction.UserId);
            Assert.AreEqual("bet", transaction.Type);
            Assert.AreEqual(amount, transaction.Amount);
            Assert.AreEqual(balanceAfter, transaction.BalanceAfter);
            Assert.AreEqual(betId, transaction.BetId);
        }

        [TestMethod]
        public void Transaction_Deposit_ShouldBeCreatedCorrectly()
        {
            // Arrange
            var userId = Guid.NewGuid();
            decimal amount = 100m;
            decimal balanceAfter = 1100m;

            // Act
            var transaction = new Transaction
            {
                Id = Guid.NewGuid(),
                UserId = userId,
                Type = "deposit",
                Amount = amount,
                BalanceAfter = balanceAfter,
                Description = "Deposit via Credit Card",
                CreatedAt = DateTime.UtcNow
            };

            // Assert
            Assert.IsNotNull(transaction);
            Assert.AreEqual(userId, transaction.UserId);
            Assert.AreEqual("deposit", transaction.Type);
            Assert.AreEqual(amount, transaction.Amount);
            Assert.AreEqual(balanceAfter, transaction.BalanceAfter);
            Assert.IsNull(transaction.BetId);
        }

        [TestMethod]
        public void Transaction_WithoutRequiredFields_ShouldBeInvalid()
        {
            // Arrange
            var transaction = new Transaction(); // Empty transaction
            transaction.Type = string.Empty; // Ensure string property is empty, not just default

            // Act
            var validationResults = new List<ValidationResult>();
            var validationContext = new ValidationContext(transaction);
            bool isValid = Validator.TryValidateObject(transaction, validationContext, validationResults, validateAllProperties: true);

            // Assert
            Assert.IsFalse(isValid, "Validation should fail for an empty Transaction object");
            Assert.IsTrue(validationResults.Count > 0, "There should be validation errors");
            
            // Output errors for debugging
            foreach (var error in validationResults)
            {
                Console.WriteLine($"Error: {error.ErrorMessage}, Property: {string.Join(", ", error.MemberNames)}");
            }
        }
    }
} 