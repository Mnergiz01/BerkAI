namespace FashionEcommerce.Domain.Enums;

public enum AuthProvider
{
    Local = 0,      // Email/Password ile kayıt
    Google = 1,     // Google OAuth ile kayıt
    Facebook = 2,   // İleride eklenebilir
    Apple = 3       // İleride eklenebilir
}
