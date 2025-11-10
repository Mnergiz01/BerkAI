using FashionEcommerce.Domain.Entities;

namespace FashionEcommerce.Domain.Interfaces;

public interface ITokenService
{
    string GenerateToken(User user);
}
