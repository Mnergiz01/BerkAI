using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Products;
using FashionEcommerce.Domain.Enums;
using MediatR;

namespace FashionEcommerce.Application.Features.Products.Queries.SearchProducts;

public record SearchProductsQuery(
    string? SearchTerm,
    Guid? CategoryId,
    Guid? BrandId,
    List<Guid>? BrandIds,
    decimal? MinPrice,
    decimal? MaxPrice,
    Gender? Gender,
    string? SortBy,
    bool? IsDescending
) : IRequest<Result<IEnumerable<ProductDto>>>;
