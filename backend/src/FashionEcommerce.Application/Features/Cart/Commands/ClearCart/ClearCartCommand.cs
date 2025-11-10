using FashionEcommerce.Application.Common;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Commands.ClearCart;

public record ClearCartCommand(Guid UserId) : IRequest<Result<bool>>;
