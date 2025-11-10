using AutoMapper;
using FashionEcommerce.Application.DTOs.Orders;
using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Application.Mappings;

public class OrderMappingProfile : Profile
{
    public OrderMappingProfile()
    {
        CreateMap<Order, OrderDto>();

        CreateMap<CreateOrderDto, Order>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.OrderNumber, opt => opt.Ignore())
            .ForMember(dest => dest.Status, opt => opt.Ignore())
            .ForMember(dest => dest.PaymentStatus, opt => opt.Ignore())
            .ForMember(dest => dest.PaymentTransactionId, opt => opt.Ignore())
            .ForMember(dest => dest.TrackingNumber, opt => opt.Ignore())
            .ForMember(dest => dest.ShippedAt, opt => opt.Ignore())
            .ForMember(dest => dest.DeliveredAt, opt => opt.Ignore())
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.User, opt => opt.Ignore())
            .ForMember(dest => dest.ShippingAddress, opt => opt.Ignore())
            .ForMember(dest => dest.BillingAddress, opt => opt.Ignore())
            .ForMember(dest => dest.OrderItems, opt => opt.Ignore());
    }
}
