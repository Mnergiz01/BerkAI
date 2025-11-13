using FashionEcommerce.Domain.Common;

namespace FashionEcommerce.Domain.Entities;

public class Admin : BaseEntity
{
    public string Username { get; set; } = string.Empty;
    public string PasswordHash { get; set; } = string.Empty;
    public string Email { get; set; } = string.Empty;
    public DateTime? LastLoginAt { get; set; }
}
