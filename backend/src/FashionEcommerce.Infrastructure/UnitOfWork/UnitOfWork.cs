using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using FashionEcommerce.Infrastructure.Repositories;

namespace FashionEcommerce.Infrastructure.UnitOfWork;

public class UnitOfWork : IUnitOfWork
{
    private readonly FashionEcommerceDbContext _context;
    private IProductRepository? _productRepository;
    private ICategoryRepository? _categoryRepository;
    private IBrandRepository? _brandRepository;
    private ICartRepository? _cartRepository;
    private IOrderRepository? _orderRepository;
    private IUserRepository? _userRepository;
    private IFavoriteRepository? _favoriteRepository;

    public UnitOfWork(FashionEcommerceDbContext context)
    {
        _context = context;
    }

    public IProductRepository Products =>
        _productRepository ??= new ProductRepository(_context);

    public ICategoryRepository Categories =>
        _categoryRepository ??= new CategoryRepository(_context);

    public IBrandRepository Brands =>
        _brandRepository ??= new BrandRepository(_context);

    public ICartRepository Carts =>
        _cartRepository ??= new CartRepository(_context);

    public IOrderRepository Orders =>
        _orderRepository ??= new OrderRepository(_context);

    public IUserRepository Users =>
        _userRepository ??= new UserRepository(_context);

    public IFavoriteRepository Favorites =>
        _favoriteRepository ??= new FavoriteRepository(_context);

    public async Task<int> SaveChangesAsync(CancellationToken cancellationToken = default)
    {
        return await _context.SaveChangesAsync(cancellationToken);
    }

    public async Task BeginTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.BeginTransactionAsync(cancellationToken);
    }

    public async Task CommitTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.CommitTransactionAsync(cancellationToken);
    }

    public async Task RollbackTransactionAsync(CancellationToken cancellationToken = default)
    {
        await _context.Database.RollbackTransactionAsync(cancellationToken);
    }

    public void Dispose()
    {
        _context.Dispose();
    }
}
