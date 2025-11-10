using FashionEcommerce.Domain.Common;

namespace FashionEcommerce.Domain.Entities;

public class CartItem : BaseEntity
{
    public int Quantity { get; set; }

    // Foreign Keys
    public Guid CartId { get; set; }
    public Guid ProductId { get; set; }
    public Guid? ProductVariantId { get; set; }

    // Navigation properties
    public Cart Cart { get; set; } = null!;
    public Product Product { get; set; } = null!;
    public ProductVariant? ProductVariant { get; set; }
}
