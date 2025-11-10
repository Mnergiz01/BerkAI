using AutoMapper;
using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Brands;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Brands.Commands.UpdateBrand;

public class UpdateBrandCommandHandler : IRequestHandler<UpdateBrandCommand, Result<BrandDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateBrandCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<BrandDto>> Handle(UpdateBrandCommand request, CancellationToken cancellationToken)
    {
        var brand = await _unitOfWork.Brands.GetByIdAsync(request.Id);
        if (brand == null)
        {
            return Result<BrandDto>.Failure("Brand not found");
        }

        brand.Name = request.BrandDto.Name;
        brand.Description = request.BrandDto.Description;
        brand.LogoUrl = request.BrandDto.LogoUrl;
        brand.WebsiteUrl = request.BrandDto.WebsiteUrl;
        brand.Slug = GenerateSlug(request.BrandDto.Name);

        await _unitOfWork.Brands.UpdateAsync(brand);
        await _unitOfWork.SaveChangesAsync();

        var brandDto = _mapper.Map<BrandDto>(brand);
        return Result<BrandDto>.Success(brandDto);
    }

    private static string GenerateSlug(string name)
    {
        return name.ToLowerInvariant()
            .Replace(" ", "-")
            .Replace("ı", "i")
            .Replace("ğ", "g")
            .Replace("ü", "u")
            .Replace("ş", "s")
            .Replace("ö", "o")
            .Replace("ç", "c");
    }
}
