using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FashionEcommerce.Infrastructure.Repositories;

public class CategoryRepository : Repository<Category>, ICategoryRepository
{
    public CategoryRepository(FashionEcommerceDbContext context) : base(context)
    {
    }

    public async Task<IEnumerable<Category>> GetMainCategoriesAsync(CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.ParentCategoryId == null)
            .Include(c => c.SubCategories)
            .ToListAsync(cancellationToken);
    }

    public async Task<IEnumerable<Category>> GetSubCategoriesAsync(
        Guid parentCategoryId,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.ParentCategoryId == parentCategoryId)
            .ToListAsync(cancellationToken);
    }

    public async Task<Category?> GetCategoryBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(c => c.Slug == slug)
            .Include(c => c.SubCategories)
            .Include(c => c.ParentCategory)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
