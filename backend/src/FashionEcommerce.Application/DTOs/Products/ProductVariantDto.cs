namespace FashionEcommerce.Application.DTOs.Products;

public class ProductVariantDto
{
    public Guid Id { get; set; }
    public string? Size { get; set; }
    public string? Color { get; set; }
    public string? ColorHex { get; set; }
    public int StockQuantity { get; set; }
    public string SKU { get; set; } = string.Empty;
    public decimal? PriceAdjustment { get; set; }
}
