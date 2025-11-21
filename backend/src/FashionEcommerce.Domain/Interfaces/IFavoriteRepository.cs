using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Domain.Interfaces;

public interface IFavoriteRepository
{
    Task<IEnumerable<Favorite>> GetUserFavoritesAsync(Guid userId);
    Task<Favorite?> GetByUserAndProductAsync(Guid userId, Guid productId);
    Task<bool> IsFavoriteAsync(Guid userId, Guid productId);
    Task AddAsync(Favorite favorite);
    Task RemoveAsync(Favorite favorite);
}
