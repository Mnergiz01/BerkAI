using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Products;
using MediatR;

namespace FashionEcommerce.Application.Features.Products.Queries.GetAllProducts;

public record GetAllProductsQuery : IRequest<Result<IEnumerable<ProductDto>>>;
