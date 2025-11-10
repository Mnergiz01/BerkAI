using FashionEcommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FashionEcommerce.Infrastructure.Data.Configurations;

public class ProductVariantConfiguration : IEntityTypeConfiguration<ProductVariant>
{
    public void Configure(EntityTypeBuilder<ProductVariant> builder)
    {
        builder.HasKey(pv => pv.Id);

        builder.Property(pv => pv.Size)
            .HasMaxLength(20);

        builder.Property(pv => pv.Color)
            .HasMaxLength(50);

        builder.Property(pv => pv.ColorHex)
            .HasMaxLength(7);

        builder.Property(pv => pv.StockQuantity)
            .IsRequired();

        builder.Property(pv => pv.SKU)
            .IsRequired()
            .HasMaxLength(100);

        builder.HasIndex(pv => pv.SKU)
            .IsUnique();

        builder.Property(pv => pv.PriceAdjustment)
            .HasPrecision(18, 2);

        // Query filter for soft delete
        builder.HasQueryFilter(pv => !pv.IsDeleted);
    }
}
