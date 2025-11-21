using FashionEcommerce.Domain.Common;
using FashionEcommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using System.Text.Json;

namespace FashionEcommerce.Infrastructure.Data;

public class FashionEcommerceDbContext : DbContext
{
    public FashionEcommerceDbContext(DbContextOptions<FashionEcommerceDbContext> options)
        : base(options)
    {
    }

    public DbSet<User> Users { get; set; }
    public DbSet<Admin> Admins { get; set; }
    public DbSet<Address> Addresses { get; set; }
    public DbSet<Category> Categories { get; set; }
    public DbSet<Brand> Brands { get; set; }
    public DbSet<Product> Products { get; set; }
    public DbSet<ProductImage> ProductImages { get; set; }
    public DbSet<ProductVariant> ProductVariants { get; set; }
    public DbSet<Cart> Carts { get; set; }
    public DbSet<CartItem> CartItems { get; set; }
    public DbSet<Order> Orders { get; set; }
    public DbSet<OrderItem> OrderItems { get; set; }
    public DbSet<SpecialCollectionProduct> SpecialCollectionProducts { get; set; }
    public DbSet<Favorite> Favorites { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Gender enum'ını string olarak sakla
        modelBuilder.Entity<User>()
            .Property(u => u.Gender)
            .HasConversion<string>();

        // SpecialCollectionProduct ImagePaths'i JSON olarak sakla
        modelBuilder.Entity<SpecialCollectionProduct>()
            .Property(p => p.ImagePaths)
            .HasConversion(
                v => JsonSerializer.Serialize(v, (JsonSerializerOptions)null),
                v => JsonSerializer.Deserialize<List<string>>(v, (JsonSerializerOptions)null) ?? new List<string>()
            );

        // Favorite - Bir kullanıcı bir ürünü sadece bir kez favorilere ekleyebilir
        modelBuilder.Entity<Favorite>()
            .HasIndex(f => new { f.UserId, f.ProductId })
            .IsUnique();

        // Apply all configurations from the current assembly
        modelBuilder.ApplyConfigurationsFromAssembly(typeof(FashionEcommerceDbContext).Assembly);
    }

    public override Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        // Automatically set CreatedAt and UpdatedAt timestamps
        var entries = ChangeTracker.Entries<BaseEntity>();

        foreach (var entry in entries)
        {
            if (entry.State == EntityState.Added)
            {
                entry.Entity.CreatedAt = DateTime.UtcNow;
            }
            else if (entry.State == EntityState.Modified)
            {
                entry.Entity.UpdatedAt = DateTime.UtcNow;
            }
        }

        return base.SaveChangesAsync(cancellationToken);
    }
}
