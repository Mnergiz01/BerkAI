using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Cart;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Commands.AddToCart;

public record AddToCartCommand(Guid UserId, AddToCartDto AddToCartDto) : IRequest<Result<CartDto>>;
