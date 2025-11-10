using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Domain.Interfaces;

public interface IProductRepository : IRepository<Product>
{
    Task<IEnumerable<Product>> GetFeaturedProductsAsync(int count, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetProductsByCategoryAsync(Guid categoryId, CancellationToken cancellationToken = default);
    Task<IEnumerable<Product>> GetProductsByBrandAsync(Guid brandId, CancellationToken cancellationToken = default);
    Task<Product?> GetProductWithDetailsAsync(Guid id, CancellationToken cancellationToken = default);
    Task<Product?> GetProductBySlugAsync(string slug, CancellationToken cancellationToken = default);
}
