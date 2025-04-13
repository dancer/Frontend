using Microsoft.VisualStudio.TestTools.UnitTesting;
using System;
using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;
using System.Linq;
using Betting.Models;

namespace Betting.Tests
{
    [TestClass]
    public class UserTests
    {
        [TestMethod]
        public void User_InitialBalance_ShouldBeDefaultValue()
        {
            // Arrange & Act
            var user = new User
            {
                Id = Guid.NewGuid(),
                Email = "test@example.com",
                Username = "testuser",
                PasswordHash = "hashedpassword",
                CreatedAt = DateTime.UtcNow
            };

            // Assert
            Assert.AreEqual(100m, user.Balance); // Default balance is 100
        }

        [TestMethod]
        public void User_WithValidData_ShouldBeCreatedCorrectly()
        {
            // Arrange
            var userId = Guid.NewGuid();
            var email = "test@example.com";
            var username = "testuser";

            // Act
            var user = new User
            {
                Id = userId,
                Email = email,
                Username = username,
                PasswordHash = "hashedpassword",
                Balance = 100m,
                CreatedAt = DateTime.UtcNow
            };

            // Assert
            Assert.IsNotNull(user);
            Assert.AreEqual(userId, user.Id);
            Assert.AreEqual(email, user.Email);
            Assert.AreEqual(username, user.Username);
            Assert.AreEqual(100m, user.Balance);
        }

        [TestMethod]
        public void User_Email_ShouldBeRequired()
        {
            // Arrange
            var user = new User
            {
                Id = Guid.NewGuid(),
                Username = "testuser",
                PasswordHash = "hashedpassword"
            };

            // Act & Assert
            var validationContext = new ValidationContext(user);
            var validationResults = new List<ValidationResult>();
            bool isValid = Validator.TryValidateObject(user, validationContext, validationResults, true);

            Assert.IsFalse(isValid);
            Assert.IsTrue(validationResults.Any(r => r.MemberNames.Contains("Email")));
        }
    }
} 