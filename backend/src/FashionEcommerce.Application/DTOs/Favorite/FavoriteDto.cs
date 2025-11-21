using FashionEcommerce.Application.DTOs.Products;

namespace FashionEcommerce.Application.DTOs.Favorite;

public class FavoriteDto
{
    public Guid Id { get; set; }
    public Guid UserId { get; set; }
    public Guid ProductId { get; set; }
    public DateTime CreatedAt { get; set; }
    public ProductDto? Product { get; set; }
}
