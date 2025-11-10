using FashionEcommerce.Domain.Enums;

namespace FashionEcommerce.Application.DTOs.Orders;

public class CreateOrderDto
{
    public decimal SubTotal { get; set; }
    public decimal ShippingCost { get; set; }
    public decimal Tax { get; set; }
    public decimal Total { get; set; }
    public PaymentMethod PaymentMethod { get; set; }
    public string? Notes { get; set; }
    public Guid UserId { get; set; }
    public Guid ShippingAddressId { get; set; }
    public Guid? BillingAddressId { get; set; }
}
