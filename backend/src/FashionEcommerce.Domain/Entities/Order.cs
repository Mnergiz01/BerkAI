using FashionEcommerce.Domain.Common;
using FashionEcommerce.Domain.Enums;

namespace FashionEcommerce.Domain.Entities;

public class Order : BaseEntity
{
    public string OrderNumber { get; set; } = string.Empty;
    public decimal SubTotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public OrderStatus Status { get; set; }
    public PaymentStatus PaymentStatus { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? PaymentTransactionId { get; set; }
    public string? TrackingNumber { get; set; }
    public string? Notes { get; set; }
    public DateTime? ShippedAt { get; set; }
    public DateTime? DeliveredAt { get; set; }

    // Foreign Keys
    public Guid UserId { get; set; }
    public Guid ShippingAddressId { get; set; }
    public Guid? BillingAddressId { get; set; }

    // Navigation properties
    public User User { get; set; } = null!;
    public Address ShippingAddress { get; set; } = null!;
    public Address? BillingAddress { get; set; }
    public ICollection<OrderItem> OrderItems { get; set; } = new List<OrderItem>();
}
