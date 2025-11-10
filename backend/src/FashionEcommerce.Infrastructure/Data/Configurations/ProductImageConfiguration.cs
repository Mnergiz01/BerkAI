using FashionEcommerce.Domain.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace FashionEcommerce.Infrastructure.Data.Configurations;

public class ProductImageConfiguration : IEntityTypeConfiguration<ProductImage>
{
    public void Configure(EntityTypeBuilder<ProductImage> builder)
    {
        builder.HasKey(pi => pi.Id);

        builder.Property(pi => pi.ImageUrl)
            .IsRequired()
            .HasMaxLength(500);

        builder.Property(pi => pi.ThumbnailUrl)
            .HasMaxLength(500);

        builder.Property(pi => pi.AltText)
            .HasMaxLength(255);

        builder.Property(pi => pi.DisplayOrder)
            .IsRequired();

        // Query filter for soft delete
        builder.HasQueryFilter(pi => !pi.IsDeleted);
    }
}
