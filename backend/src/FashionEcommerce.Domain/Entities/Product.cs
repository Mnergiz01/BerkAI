using FashionEcommerce.Domain.Common;
using FashionEcommerce.Domain.Enums;

namespace FashionEcommerce.Domain.Entities;

public class Product : BaseEntity
{
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string Description { get; set; } = string.Empty;
    public string? ShortDescription { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string SKU { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public Gender Gender { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public int ViewCount { get; set; }
    // Foreign Keys
    public Guid CategoryId { get; set; }
    public Guid BrandId { get; set; }

    // Navigation properties
    public Category Category { get; set; } = null!;
    public Brand Brand { get; set; } = null!;
    public ICollection<ProductImage> Images { get; set; } = new List<ProductImage>();
    public ICollection<ProductVariant> Variants { get; set; } = new List<ProductVariant>();
}
