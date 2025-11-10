using AutoMapper;
using FashionEcommerce.Application.Common.Utilities;
using FashionEcommerce.Application.DTOs.Brands;
using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Application.Mappings;

public class BrandMappingProfile : Profile
{
    public BrandMappingProfile()
    {
        CreateMap<Brand, BrandDto>();

        CreateMap<CreateBrandDto, Brand>()
            .ForMember(dest => dest.Id, opt => opt.Ignore())
            .ForMember(dest => dest.Slug, opt => opt.MapFrom(src => SlugGenerator.GenerateSlug(src.Name)))
            .ForMember(dest => dest.CreatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.UpdatedAt, opt => opt.Ignore())
            .ForMember(dest => dest.IsDeleted, opt => opt.Ignore())
            .ForMember(dest => dest.Products, opt => opt.Ignore());
    }
}
