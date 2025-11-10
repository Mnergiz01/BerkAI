using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Cart;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Queries.GetCart;

public record GetCartQuery(Guid UserId) : IRequest<Result<CartDto>>;
