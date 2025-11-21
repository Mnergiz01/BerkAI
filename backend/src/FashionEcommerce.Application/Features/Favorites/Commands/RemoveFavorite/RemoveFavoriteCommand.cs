using FashionEcommerce.Application.Common;
using MediatR;

namespace FashionEcommerce.Application.Features.Favorites.Commands.RemoveFavorite;

public record RemoveFavoriteCommand(Guid UserId, Guid ProductId) : IRequest<Result<string>>;
