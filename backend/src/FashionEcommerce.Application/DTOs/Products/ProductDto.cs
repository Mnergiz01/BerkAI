using FashionEcommerce.Domain.Enums;

namespace FashionEcommerce.Application.DTOs.Products;

public class ProductDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = string.Empty;
    public string Slug { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string SKU { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public Gender Gender { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; }
    public int ViewCount { get; set; }
    public decimal? AverageRating { get; set; }
    public int ReviewCount { get; set; }

    public Guid CategoryId { get; set; }
    public string? CategoryName { get; set; }

    public Guid? BrandId { get; set; }
    public string? BrandName { get; set; }

    public List<ProductImageDto> Images { get; set; } = new();
    public List<ProductVariantDto> Variants { get; set; } = new();

    public DateTime CreatedAt { get; set; }
}
