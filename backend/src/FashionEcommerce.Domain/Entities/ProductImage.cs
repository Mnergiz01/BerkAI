using FashionEcommerce.Domain.Common;

namespace FashionEcommerce.Domain.Entities;

public class ProductImage : BaseEntity
{
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsMainImage { get; set; }

    // Foreign Key
    public Guid ProductId { get; set; }

    // Navigation property
    public Product Product { get; set; } = null!;
}
