using FashionEcommerce.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FashionEcommerce.Infrastructure.Services;

public class EmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<EmailService> _logger;

    public EmailService(IConfiguration configuration, ILogger<EmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        // Şimdilik console'a yazdırıyoruz - Production'da gerçek email servisi kullanılacak
        _logger.LogInformation($"=== EMAIL SENT ===");
        _logger.LogInformation($"To: {to}");
        _logger.LogInformation($"Subject: {subject}");
        _logger.LogInformation($"Body: {body}");
        _logger.LogInformation($"==================");

        await Task.CompletedTask;
    }

    public async Task SendActivationCodeAsync(string email, string firstName, string activationCode)
    {
        var subject = "BerkAI - Email Aktivasyon Kodu";
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{ font-family: Arial, sans-serif; background-color: #f4f4f4; }}
        .container {{ max-width: 600px; margin: 50px auto; background-color: white; padding: 30px; border-radius: 10px; box-shadow: 0 0 10px rgba(0,0,0,0.1); }}
        .header {{ text-align: center; color: #2c3e50; }}
        .code-box {{ background-color: #3498db; color: white; padding: 20px; text-align: center; font-size: 32px; font-weight: bold; letter-spacing: 5px; margin: 30px 0; border-radius: 5px; }}
        .footer {{ text-align: center; color: #7f8c8d; font-size: 12px; margin-top: 30px; }}
    </style>
</head>
<body>
    <div class='container'>
        <h1 class='header'>🎉 BerkAI'ye Hoş Geldiniz!</h1>
        <p>Merhaba <strong>{firstName}</strong>,</p>
        <p>BerkAI Fashion'a kaydolduğunuz için teşekkür ederiz! Hesabınızı aktive etmek için aşağıdaki kodu kullanın:</p>

        <div class='code-box'>{activationCode}</div>

        <p>Bu kod <strong>15 dakika</strong> geçerlidir.</p>
        <p>Eğer bu kaydı siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>

        <div class='footer'>
            <p>BerkAI Fashion - Modern Giyim, Modern Alışveriş</p>
            <p>Bu otomatik bir e-postadır, lütfen yanıtlamayın.</p>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(email, subject, body);
    }
}
