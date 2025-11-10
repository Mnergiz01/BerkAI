using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Brands;
using MediatR;

namespace FashionEcommerce.Application.Features.Brands.Queries.GetAllBrands;

public record GetAllBrandsQuery : IRequest<Result<IEnumerable<BrandDto>>>;
