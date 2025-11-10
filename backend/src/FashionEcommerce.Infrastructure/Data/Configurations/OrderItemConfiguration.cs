using FashionEcommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FashionEcommerce.Infrastructure.Data.Configurations;

public class OrderItemConfiguration : IEntityTypeConfiguration<OrderItem>
{
    public void Configure(EntityTypeBuilder<OrderItem> builder)
    {
        builder.HasKey(oi => oi.Id);

        builder.Property(oi => oi.Quantity)
            .IsRequired();

        builder.Property(oi => oi.UnitPrice)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(oi => oi.TotalPrice)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(oi => oi.ProductName)
            .IsRequired()
            .HasMaxLength(255);

        builder.Property(oi => oi.ProductSKU)
            .IsRequired()
            .HasMaxLength(100);

        builder.Property(oi => oi.Size)
            .HasMaxLength(20);

        builder.Property(oi => oi.Color)
            .HasMaxLength(50);

        // Relationships
        builder.HasOne(oi => oi.Product)
            .WithMany()
            .HasForeignKey(oi => oi.ProductId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(oi => oi.ProductVariant)
            .WithMany()
            .HasForeignKey(oi => oi.ProductVariantId)
            .OnDelete(DeleteBehavior.Restrict);

        // Query filter for soft delete
        builder.HasQueryFilter(oi => !oi.IsDeleted);
    }
}
