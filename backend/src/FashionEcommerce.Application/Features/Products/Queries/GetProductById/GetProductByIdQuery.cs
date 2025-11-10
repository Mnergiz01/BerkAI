using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Products;
using MediatR;

namespace FashionEcommerce.Application.Features.Products.Queries.GetProductById;

public record GetProductByIdQuery(Guid Id) : IRequest<Result<ProductDto>>;
