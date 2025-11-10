using FashionEcommerce.Domain.Common;

namespace FashionEcommerce.Domain.Entities;

public class ProductVariant : BaseEntity
{
    public string Size { get; set; } = string.Empty;
    public string Color { get; set; } = string.Empty;
    public string? ColorHex { get; set; }
    public int StockQuantity { get; set; }
    public string SKU { get; set; } = string.Empty;
    public decimal? PriceAdjustment { get; set; }

    // Foreign Key
    public Guid ProductId { get; set; }

    // Navigation property
    public Product Product { get; set; } = null!;
}
