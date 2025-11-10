using FashionEcommerce.Domain.Common;

namespace FashionEcommerce.Domain.Entities;

public class Address : BaseEntity
{
    public string FirstName { get; set; } = string.Empty;
    public string LastName { get; set; } = string.Empty;
    public string PhoneNumber { get; set; } = string.Empty;
    public string AddressLine1 { get; set; } = string.Empty;
    public string? AddressLine2 { get; set; }
    public string City { get; set; } = string.Empty;
    public string State { get; set; } = string.Empty;
    public string Country { get; set; } = string.Empty;
    public string ZipCode { get; set; } = string.Empty;
    public bool IsDefault { get; set; }

    // Foreign Key
    public Guid UserId { get; set; }

    // Navigation property
    public User User { get; set; } = null!;
}
