using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Cart;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Commands.RemoveCartItem;

public record RemoveCartItemCommand(Guid UserId, Guid CartItemId) : IRequest<Result<CartDto>>;
