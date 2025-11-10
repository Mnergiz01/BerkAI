using FashionEcommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FashionEcommerce.Infrastructure.Data.Configurations;

public class OrderConfiguration : IEntityTypeConfiguration<Order>
{
    public void Configure(EntityTypeBuilder<Order> builder)
    {
        builder.HasKey(o => o.Id);

        builder.Property(o => o.OrderNumber)
            .IsRequired()
            .HasMaxLength(50);

        builder.HasIndex(o => o.OrderNumber)
            .IsUnique();

        builder.Property(o => o.SubTotal)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(o => o.ShippingCost)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(o => o.Tax)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(o => o.Total)
            .IsRequired()
            .HasPrecision(18, 2);

        builder.Property(o => o.Status)
            .IsRequired();

        builder.Property(o => o.PaymentStatus)
            .IsRequired();

        builder.Property(o => o.PaymentMethod)
            .IsRequired();

        builder.Property(o => o.PaymentTransactionId)
            .HasMaxLength(255);

        builder.Property(o => o.TrackingNumber)
            .HasMaxLength(100);

        builder.Property(o => o.Notes)
            .HasMaxLength(1000);

        // Relationships
        builder.HasOne(o => o.ShippingAddress)
            .WithMany()
            .HasForeignKey(o => o.ShippingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasOne(o => o.BillingAddress)
            .WithMany()
            .HasForeignKey(o => o.BillingAddressId)
            .OnDelete(DeleteBehavior.Restrict);

        builder.HasMany(o => o.OrderItems)
            .WithOne(oi => oi.Order)
            .HasForeignKey(oi => oi.OrderId)
            .OnDelete(DeleteBehavior.Cascade);

        // Query filter for soft delete
        builder.HasQueryFilter(o => !o.IsDeleted);
    }
}
