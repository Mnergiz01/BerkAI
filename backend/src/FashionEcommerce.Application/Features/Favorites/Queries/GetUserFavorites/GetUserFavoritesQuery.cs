using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Favorite;
using MediatR;

namespace FashionEcommerce.Application.Features.Favorites.Queries.GetUserFavorites;

public record GetUserFavoritesQuery(Guid UserId) : IRequest<Result<IEnumerable<FavoriteDto>>>;
