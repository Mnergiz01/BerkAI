using AutoMapper;
using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Brands;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Brands.Queries.GetAllBrands;

public class GetAllBrandsQueryHandler : IRequestHandler<GetAllBrandsQuery, Result<IEnumerable<BrandDto>>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetAllBrandsQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<IEnumerable<BrandDto>>> Handle(GetAllBrandsQuery request, CancellationToken cancellationToken)
    {
        var brands = await _unitOfWork.Brands.GetAllAsync();
        var brandDtos = _mapper.Map<IEnumerable<BrandDto>>(brands);
        return Result<IEnumerable<BrandDto>>.Success(brandDtos);
    }
}
