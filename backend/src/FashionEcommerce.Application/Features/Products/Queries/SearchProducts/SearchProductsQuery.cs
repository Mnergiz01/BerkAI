using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Products;
using FashionEcommerce.Domain.Enums;
using MediatR;

namespace FashionEcommerce.Application.Features.Products.Queries.SearchProducts;

public record SearchProductsQuery(
    string? SearchTerm,
    Guid? CategoryId,
    Guid? BrandId,
    decimal? MinPrice,
    decimal? MaxPrice,
    Gender? Gender,
    string? SortBy
) : IRequest<Result<IEnumerable<ProductDto>>>;
