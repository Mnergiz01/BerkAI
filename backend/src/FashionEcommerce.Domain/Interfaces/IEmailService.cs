namespace FashionEcommerce.Domain.Interfaces;

public interface IEmailService
{
    Task SendEmailAsync(string to, string subject, string body);
    Task SendActivationCodeAsync(string email, string firstName, string activationCode);
}
