using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Favorite;
using MediatR;

namespace FashionEcommerce.Application.Features.Favorites.Commands.AddFavorite;

public record AddFavoriteCommand(Guid UserId, AddFavoriteDto AddFavoriteDto) : IRequest<Result<FavoriteDto>>;
