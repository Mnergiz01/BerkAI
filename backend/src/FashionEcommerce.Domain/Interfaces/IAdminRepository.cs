using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Domain.Interfaces;

public interface IAdminRepository : IRepository<Admin>
{
    Task<Admin?> GetByUsernameAsync(string username);
    Task<bool> UsernameExistsAsync(string username);
}
