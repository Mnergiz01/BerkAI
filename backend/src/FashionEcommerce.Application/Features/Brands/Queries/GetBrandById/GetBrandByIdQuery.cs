using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Brands;
using MediatR;

namespace FashionEcommerce.Application.Features.Brands.Queries.GetBrandById;

public record GetBrandByIdQuery(Guid Id) : IRequest<Result<BrandDto>>;
