using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FashionEcommerce.Infrastructure.Repositories;

public class FavoriteRepository : IFavoriteRepository
{
    private readonly FashionEcommerceDbContext _context;

    public FavoriteRepository(FashionEcommerceDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<Favorite>> GetUserFavoritesAsync(Guid userId)
    {
        return await _context.Favorites
            .Include(f => f.Product)
                .ThenInclude(p => p.Images)
            .Include(f => f.Product)
                .ThenInclude(p => p.Category)
            .Include(f => f.Product)
                .ThenInclude(p => p.Brand)
            .Where(f => f.UserId == userId && !f.IsDeleted)
            .OrderByDescending(f => f.CreatedAt)
            .ToListAsync();
    }

    public async Task<Favorite?> GetByUserAndProductAsync(Guid userId, Guid productId)
    {
        return await _context.Favorites
            .FirstOrDefaultAsync(f => f.UserId == userId && f.ProductId == productId && !f.IsDeleted);
    }

    public async Task<bool> IsFavoriteAsync(Guid userId, Guid productId)
    {
        return await _context.Favorites
            .AnyAsync(f => f.UserId == userId && f.ProductId == productId && !f.IsDeleted);
    }

    public async Task AddAsync(Favorite favorite)
    {
        await _context.Favorites.AddAsync(favorite);
    }

    public async Task RemoveAsync(Favorite favorite)
    {
        favorite.IsDeleted = true;
    }
}
