using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Products;
using MediatR;

namespace FashionEcommerce.Application.Features.Products.Commands.CreateProduct;

public record CreateProductCommand(CreateProductDto Product) : IRequest<Result<ProductDto>>;
