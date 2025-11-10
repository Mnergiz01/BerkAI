using FashionEcommerce.Domain.Enums;

namespace FashionEcommerce.Application.DTOs.Products;

public class CreateProductDto
{
    public string Name { get; set; } = string.Empty;
    public string? Description { get; set; }
    public string? ShortDescription { get; set; }
    public decimal Price { get; set; }
    public decimal? DiscountPrice { get; set; }
    public string SKU { get; set; } = string.Empty;
    public int StockQuantity { get; set; }
    public Gender Gender { get; set; }
    public bool IsFeatured { get; set; }
    public bool IsActive { get; set; } = true;

    public Guid CategoryId { get; set; }
    public Guid? BrandId { get; set; }

    public List<CreateProductImageDto> Images { get; set; } = new();
    public List<CreateProductVariantDto> Variants { get; set; } = new();
}

public class CreateProductImageDto
{
    public string ImageUrl { get; set; } = string.Empty;
    public string? ThumbnailUrl { get; set; }
    public string? AltText { get; set; }
    public int DisplayOrder { get; set; }
    public bool IsMainImage { get; set; }
}

public class CreateProductVariantDto
{
    public string? Size { get; set; }
    public string? Color { get; set; }
    public string? ColorHex { get; set; }
    public int StockQuantity { get; set; }
    public string SKU { get; set; } = string.Empty;
    public decimal? PriceAdjustment { get; set; }
}
