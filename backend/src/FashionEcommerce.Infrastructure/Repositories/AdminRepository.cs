using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using Microsoft.EntityFrameworkCore;

namespace FashionEcommerce.Infrastructure.Repositories;

public class AdminRepository : Repository<Admin>, IAdminRepository
{
    public AdminRepository(FashionEcommerceDbContext context) : base(context)
    {
    }

    public async Task<Admin?> GetByUsernameAsync(string username)
    {
        return await _context.Admins
            .FirstOrDefaultAsync(a => a.Username.ToLower() == username.ToLower() && !a.IsDeleted);
    }

    public async Task<bool> UsernameExistsAsync(string username)
    {
        return await _context.Admins
            .AnyAsync(a => a.Username.ToLower() == username.ToLower() && !a.IsDeleted);
    }
}
