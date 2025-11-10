using AutoMapper;
using FashionEcommerce.Application.DTOs.Auth;
using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Application.Mappings;

public class AuthMappingProfile : Profile
{
    public AuthMappingProfile()
    {
        CreateMap<User, AuthResponseDto>()
            .ForMember(dest => dest.Token, opt => opt.Ignore()); // Token will be set manually

        CreateMap<RegisterDto, User>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.PasswordHash, opt => opt.Ignore()) // Will be set manually after hashing
            .ForMember(dest => dest.EmailConfirmationCode, opt => opt.Ignore()) // Will be set manually
            .ForMember(dest => dest.EmailConfirmationCodeExpiry, opt => opt.Ignore()) // Will be set manually
            .ForMember(dest => dest.IsEmailConfirmed, opt => opt.MapFrom(src => false))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.LastLoginAt, opt => opt.Ignore())
            .ForMember(dest => dest.ProfileImageUrl, opt => opt.Ignore())
            .ForMember(dest => dest.Addresses, opt => opt.Ignore())
            .ForMember(dest => dest.Carts, opt => opt.Ignore())
            .ForMember(dest => dest.Orders, opt => opt.Ignore());
    }
}
