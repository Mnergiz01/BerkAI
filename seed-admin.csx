#!/usr/bin/env dotnet-script
#r "nuget: Npgsql, 9.0.0"
#r "nuget: BCrypt.Net-Next, 4.0.3"

using Npgsql;
using BCrypt.Net;

var connectionString = "Host=localhost;Port=5432;Database=FashionEcommerceDb;Username=postgres;Password=123456";
var username = "admin";
var password = "123456";
var email = "admin@berkai.com";

// Hash password
var passwordHash = BCrypt.HashPassword(password);
var adminId = Guid.NewGuid();
var now = DateTime.UtcNow;

Console.WriteLine($"Creating admin user: {username}");
Console.WriteLine($"Password: {password}");
Console.WriteLine($"Email: {email}");

using var connection = new NpgsqlConnection(connectionString);
connection.Open();

// Check if admin already exists
using var checkCmd = new NpgsqlCommand(
    "SELECT COUNT(*) FROM \"Admins\" WHERE \"Username\" = @username AND NOT \"IsDeleted\"",
    connection);
checkCmd.Parameters.AddWithValue("username", username);
var count = Convert.ToInt32(checkCmd.ExecuteScalar());

if (count > 0)
{
    Console.WriteLine("Admin user already exists!");
}
else
{
    // Insert admin
    using var insertCmd = new NpgsqlCommand(
        @"INSERT INTO ""Admins"" (""Id"", ""Username"", ""PasswordHash"", ""Email"", ""CreatedAt"", ""IsDeleted"")
          VALUES (@id, @username, @passwordHash, @email, @createdAt, false)",
        connection);

    insertCmd.Parameters.AddWithValue("id", adminId);
    insertCmd.Parameters.AddWithValue("username", username);
    insertCmd.Parameters.AddWithValue("passwordHash", passwordHash);
    insertCmd.Parameters.AddWithValue("email", email);
    insertCmd.Parameters.AddWithValue("createdAt", now);

    insertCmd.ExecuteNonQuery();
    Console.WriteLine("✅ Admin user created successfully!");
}

connection.Close();
