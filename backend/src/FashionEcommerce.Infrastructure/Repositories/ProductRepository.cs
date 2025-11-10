using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FashionEcommerce.Infrastructure.Repositories;

public class ProductRepository : Repository<Product>, IProductRepository
{
    public ProductRepository(FashionEcommerceDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Product>> GetFeaturedProductsAsync(
        int count,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.IsFeatured && p.IsActive)
            .OrderByDescending(p => p.CreatedAt)
            .Take(count)
            .Include(p => p.Images)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetProductsByCategoryAsync(
        Guid categoryId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.CategoryId == categoryId && p.IsActive)
            .Include(p => p.Images)
            .Include(p => p.Brand)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Product>> GetProductsByBrandAsync(
        Guid brandId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.BrandId == brandId && p.IsActive)
            .Include(p => p.Images)
            .Include(p => p.Category)
            .ToListAsync(cancellationToken);
    }

    public async Task<Product?> GetProductWithDetailsAsync(
        Guid id,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.Id == id)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .FirstOrDefaultAsync(cancellationToken);
    }

    public async Task<Product?> GetProductBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(p => p.Slug == slug)
            .Include(p => p.Images)
            .Include(p => p.Variants)
            .Include(p => p.Category)
            .Include(p => p.Brand)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
