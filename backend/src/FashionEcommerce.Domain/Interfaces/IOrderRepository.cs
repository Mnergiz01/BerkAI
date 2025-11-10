using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Domain.Interfaces;

public interface IOrderRepository : IRepository<Order>
{
    Task<IEnumerable<Order>> GetOrdersByUserIdAsync(Guid userId, CancellationToken cancellationToken = default);
    Task<Order?> GetOrderWithDetailsAsync(Guid orderId, CancellationToken cancellationToken = default);
    Task<Order?> GetOrderByOrderNumberAsync(string orderNumber, CancellationToken cancellationToken = default);
}
