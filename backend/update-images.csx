#!/usr/bin/env dotnet-script
#r "nuget: Npgsql, 9.0.1"

using System;
using Npgsql;

var connectionString = "Host=localhost;Database=fashionecommerce;Username=postgres;Password=Muzaffer7980";

var updates = new Dictionary<string, string>
{
    // Women's Dresses
    {"Siyah Midi Elbise", "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800"},
    {"Çiçek Desenli Maxi Elbise", "https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800"},
    {"Kırmızı Kokteyl Elbise", "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=800"},
    // Women's Blouses
    {"Beyaz Saten Bluz", "https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800"},
    {"Çizgili Gömlek Bluz", "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?w=800"},
    // Women's Pants
    {"Yüksek Bel Jean Pantolon", "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=800"},
    {"Wide Leg Kumaş Pantolon", "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=800"},
    // Women's Skirts
    {"Pileli Midi Etek", "https://images.unsplash.com/photo-1583496661160-fb5886a0aaaa?w=800"},
    {"Deri Mini Etek", "https://images.unsplash.com/photo-1580657018950-c7f7d6a6d990?w=800"},
    // Women's Jackets
    {"Blazer Ceket Kadın", "https://images.unsplash.com/photo-1591047139829-d91aecb6caea?w=800"},
    // Women's Shoes
    {"Topuklu Ayakkabı Siyah", "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800"},
    // Men's T-Shirts
    {"Basic Beyaz T-Shirt", "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800"},
    {"Siyah Baskılı T-Shirt", "https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?w=800"},
    {"Polo Yaka T-Shirt", "https://images.unsplash.com/photo-1586790170083-2f9ceadc732d?w=800"},
    // Men's Shirts
    {"Slim Fit Beyaz Gömlek", "https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=800"},
    {"Kareli Gömlek", "https://images.unsplash.com/photo-1596755094514-f87e34085b2c?w=800"},
    // Men's Pants
    {"Slim Fit Chino Pantolon", "https://images.unsplash.com/photo-1473966968600-fa801b869a1a?w=800"},
    {"Slim Fit Jean Pantolon", "https://images.unsplash.com/photo-1542272604-787c3835535d?w=800"},
    // Men's Jackets
    {"Deri Bomber Ceket", "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=800"},
    {"Kot Ceket", "https://images.unsplash.com/photo-1576871337632-b9aef4c17ab9?w=800"},
    // Men's Sweaters
    {"Boğazlı Triko Kazak", "https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=800"},
    {"V Yaka Kazak", "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?w=800"},
    // Men's Shoes
    {"Klasik Siyah Ayakkabı", "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=800"},
    // Bags
    {"Deri Omuz Çantası", "https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800"},
    {"Sırt Çantası", "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800"},
    // Watches
    {"Minimal Kol Saati", "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=800"},
    {"Dijital Spor Saati", "https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800"},
    // Sunglasses
    {"Güneş Gözlüğü Aviator", "https://images.unsplash.com/photo-1511499767150-a48a237f0083?w=800"},
    {"Wayfarer Güneş Gözlüğü", "https://images.unsplash.com/photo-1473496169904-658ba7c44d8a?w=800"}
};

using var connection = new NpgsqlConnection(connectionString);
await connection.OpenAsync();

Console.WriteLine("Starting product image updates...");
int totalUpdated = 0;

foreach (var (productName, imageUrl) in updates)
{
    var command = new NpgsqlCommand(@"UPDATE ""Products"" SET ""ImageUrl"" = @imageUrl WHERE ""Name"" = @name", connection);
    command.Parameters.AddWithValue("imageUrl", imageUrl);
    command.Parameters.AddWithValue("name", productName);
    var affected = await command.ExecuteNonQueryAsync();
    if (affected > 0)
    {
        Console.WriteLine($"✓ Updated {productName}");
        totalUpdated++;
    }
    else
    {
        Console.WriteLine($"✗ Not found: {productName}");
    }
}

Console.WriteLine($"\nTotal updated: {totalUpdated}/{updates.Count} products");
