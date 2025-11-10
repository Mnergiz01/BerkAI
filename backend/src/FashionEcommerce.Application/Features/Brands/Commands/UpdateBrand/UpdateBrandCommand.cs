using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Brands;
using MediatR;

namespace FashionEcommerce.Application.Features.Brands.Commands.UpdateBrand;

public record UpdateBrandCommand(Guid Id, UpdateBrandDto BrandDto) : IRequest<Result<BrandDto>>;
