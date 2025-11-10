namespace FashionEcommerce.Application.DTOs.Cart;

public class CartItemDto
{
    public Guid Id { get; set; }
    public Guid ProductId { get; set; }
    public string ProductName { get; set; } = string.Empty;
    public string? ProductImage { get; set; }
    public decimal Price { get; set; }
    public int Quantity { get; set; }
    public Guid? ProductVariantId { get; set; }
    public string? VariantSize { get; set; }
    public string? VariantColor { get; set; }
    public decimal SubTotal { get; set; }
}
