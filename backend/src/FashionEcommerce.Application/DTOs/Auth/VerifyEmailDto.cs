namespace FashionEcommerce.Application.DTOs.Auth;

public class VerifyEmailDto
{
    public string Email { get; set; } = string.Empty;
    public string ActivationCode { get; set; } = string.Empty;
}
