using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FashionEcommerce.Infrastructure.Repositories;

public class OrderRepository : Repository<Order>, IOrderRepository
{
    public OrderRepository(FashionEcommerceDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Order>> GetOrdersByUserIdAsync(
        Guid userId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(o => o.UserId == userId)
            .Include(o => o.OrderItems)
            .Include(o => o.ShippingAddress)
            .OrderByDescending(o => o.CreatedAt)
            .ToListAsync(cancellationToken);
    }

    public async Task<Order?> GetOrderWithDetailsAsync(
        Guid orderId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(o => o.Id == orderId)
            .Include(o => o.OrderItems)
                .ThenInclude(oi => oi.Product)
            .Include(o => o.ShippingAddress)
            .Include(o => o.BillingAddress)
            .Include(o => o.User)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Order?> GetOrderByOrderNumberAsync(
        string orderNumber,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(o => o.OrderNumber == orderNumber)
            .Include(o => o.OrderItems)
            .Include(o => o.ShippingAddress)
            .Include(o => o.BillingAddress)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
