using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Domain.Interfaces;

public interface IBrandRepository : IRepository<Brand>
{
    Task<Brand?> GetBrandBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
