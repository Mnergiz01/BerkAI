using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FashionEcommerce.Infrastructure.Repositories;

public class BrandRepository : Repository<Brand>, IBrandRepository
{
    public BrandRepository(FashionEcommerceDbContext context) : base(context)
    {
    }

    public async Task<Brand?> GetBrandBySlugAsync(
        string slug,
        CancellationToken cancellationToken = default)
    {
        return await _dbSet
            .Where(b => b.Slug == slug)
            .FirstOrDefaultAsync(cancellationToken);
    }
}
