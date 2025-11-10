using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Brands;
using MediatR;

namespace FashionEcommerce.Application.Features.Brands.Commands.CreateBrand;

public record CreateBrandCommand(CreateBrandDto BrandDto) : IRequest<Result<BrandDto>>;
