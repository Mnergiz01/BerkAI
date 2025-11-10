using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Domain.Interfaces;

public interface ICartRepository : IRepository<Cart>
{
    Task<Cart?> GetCartByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Cart?> GetCartWithItemsAsync(Guid userId, CancellationToken cancellationToken = default);
}
