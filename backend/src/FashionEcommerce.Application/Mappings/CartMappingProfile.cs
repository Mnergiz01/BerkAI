using AutoMapper;
using FashionEcommerce.Application.DTOs.Cart;
using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Application.Mappings;

public class CartMappingProfile : Profile
{
    public CartMappingProfile()
    {
        CreateMap<Cart, CartDto>()
            .ForMember(dest => dest.Items, opt => opt.MapFrom(src => src.CartItems))
            .ForMember(dest => dest.TotalPrice, opt => opt.MapFrom(src =>
                src.CartItems.Sum(ci => ci.Quantity * (ci.Product.DiscountPrice ?? ci.Product.Price))))
            .ForMember(dest => dest.TotalItems, opt => opt.MapFrom(src =>
                src.CartItems.Sum(ci => ci.Quantity)));

        CreateMap<CartItem, CartItemDto>()
            .ForMember(dest => dest.ProductName, opt => opt.MapFrom(src => src.Product.Name))
            .ForMember(dest => dest.ProductImage, opt => opt.MapFrom(src =>
                src.Product.Images.FirstOrDefault() != null
                    ? src.Product.Images.FirstOrDefault()!.ImageUrl
                    : "https://via.placeholder.com/500"))
            .ForMember(dest => dest.Price, opt => opt.MapFrom(src =>
                src.Product.DiscountPrice ?? src.Product.Price))
            .ForMember(dest => dest.VariantSize, opt => opt.MapFrom(src =>
                src.ProductVariant != null ? src.ProductVariant.Size : null))
            .ForMember(dest => dest.VariantColor, opt => opt.MapFrom(src =>
                src.ProductVariant != null ? src.ProductVariant.Color : null))
            .ForMember(dest => dest.SubTotal, opt => opt.MapFrom(src =>
                src.Quantity * (src.Product.DiscountPrice ?? src.Product.Price)));
    }
}
