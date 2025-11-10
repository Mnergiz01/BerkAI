using FashionEcommerce.Domain.Common;

namespace FashionEcommerce.Domain.Entities;

public class Cart : BaseEntity
{
    // Foreign Key
    public Guid UserId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public ICollection<CartItem> CartItems { get; set; } = new List<CartItem>();
}
