using FashionEcommerce.Domain.Common;
using FashionEcommerce.Domain.Enums;

namespace FashionEcommerce.Domain.Entities;

public class User : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string? PhoneNumber { get; set; }
    public Gender? Gender { get; set; }
    public string? ProfileImageUrl { get; set; }
    public bool IsEmailConfirmed { get; set; }
    public string? EmailConfirmationCode { get; set; }
    public DateTime? EmailConfirmationCodeExpiry { get; set; }
    public DateTime? LastLoginAt { get; set; }

    // Navigation properties
    public ICollection<Address> Addresses { get; set; } = new List<Address>();
    public ICollection<Order> Orders { get; set; } = new List<Order>();
    public ICollection<Cart> Carts { get; set; } = new List<Cart>();
}
