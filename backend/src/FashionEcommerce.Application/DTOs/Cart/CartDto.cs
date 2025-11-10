namespace FashionEcommerce.Application.DTOs.Cart;

public class CartDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public List<CartItemDto> Items { get; set; } = new();
    public decimal TotalPrice { get; set; }
    public int TotalItems { get; set; }
}
