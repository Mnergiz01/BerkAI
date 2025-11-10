using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FashionEcommerce.Infrastructure.Repositories;

public class CartRepository : Repository<Cart>, ICartRepository
{
    public CartRepository(FashionEcommerceDbContext context) : base(context)
    {
    }

    public async Task<Cart?> GetCartByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .FirstOrDefaultAsync(c => c.UserId == userId, cancellationToken);
    }

    public async Task<Cart?> GetCartWithItemsAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.UserId == userId)
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.Product)
                    .ThenInclude(p => p.Images)
            .Include(c => c.CartItems)
                .ThenInclude(ci => ci.ProductVariant)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
