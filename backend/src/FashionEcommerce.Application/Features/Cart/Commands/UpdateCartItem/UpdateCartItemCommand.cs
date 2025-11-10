using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Cart;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Commands.UpdateCartItem;

public record UpdateCartItemCommand(Guid UserId, Guid CartItemId, UpdateCartItemDto UpdateDto) : IRequest<Result<CartDto>>;
