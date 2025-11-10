using System.Net;
using System.Net.Mail;
using FashionEcommerce.Domain.Interfaces;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;

namespace FashionEcommerce.Infrastructure.Services;

/// <summary>
/// Gmail SMTP ile gerçek email gönderimi
/// Production ortamı için kullanılır
/// </summary>
public class SmtpEmailService : IEmailService
{
    private readonly IConfiguration _configuration;
    private readonly ILogger<SmtpEmailService> _logger;

    public SmtpEmailService(IConfiguration configuration, ILogger<SmtpEmailService> logger)
    {
        _configuration = configuration;
        _logger = logger;
    }

    public async Task SendEmailAsync(string to, string subject, string body)
    {
        try
        {
            var smtpSettings = _configuration.GetSection("EmailSettings");
            var fromEmail = smtpSettings["FromEmail"];
            var fromName = smtpSettings["FromName"];
            var smtpHost = smtpSettings["SmtpHost"];
            var smtpPort = int.Parse(smtpSettings["SmtpPort"] ?? "587");
            var smtpUsername = smtpSettings["SmtpUsername"];
            var smtpPassword = smtpSettings["SmtpPassword"];

            using var client = new SmtpClient(smtpHost, smtpPort)
            {
                EnableSsl = true,
                Credentials = new NetworkCredential(smtpUsername, smtpPassword)
            };

            var mailMessage = new MailMessage
            {
                From = new MailAddress(fromEmail!, fromName),
                Subject = subject,
                Body = body,
                IsBodyHtml = true
            };

            mailMessage.To.Add(to);

            await client.SendMailAsync(mailMessage);

            _logger.LogInformation($"Email başarıyla gönderildi: {to}");
        }
        catch (Exception ex)
        {
            _logger.LogError($"Email gönderim hatası: {ex.Message}");
            throw;
        }
    }

    public async Task SendActivationCodeAsync(string email, string firstName, string activationCode)
    {
        var subject = "BerkAI - Email Aktivasyon Kodu";
        var body = $@"
<!DOCTYPE html>
<html>
<head>
    <style>
        body {{
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
        }}
        .container {{
            max-width: 600px;
            margin: 50px auto;
            background-color: white;
            padding: 40px;
            border-radius: 10px;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }}
        .header {{
            text-align: center;
            color: #2c3e50;
            margin-bottom: 30px;
        }}
        .logo {{
            font-size: 36px;
            font-weight: bold;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            margin-bottom: 10px;
        }}
        .code-box {{
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            color: white;
            padding: 25px;
            text-align: center;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 8px;
            margin: 30px 0;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }}
        .message {{
            color: #555;
            line-height: 1.6;
            font-size: 16px;
        }}
        .highlight {{
            color: #667eea;
            font-weight: bold;
        }}
        .footer {{
            text-align: center;
            color: #95a5a6;
            font-size: 13px;
            margin-top: 40px;
            padding-top: 20px;
            border-top: 1px solid #ecf0f1;
        }}
        .warning {{
            background-color: #fff3cd;
            border-left: 4px solid #ffc107;
            padding: 12px;
            margin: 20px 0;
            border-radius: 4px;
        }}
    </style>
</head>
<body>
    <div class='container'>
        <div class='header'>
            <div class='logo'>BerkAI</div>
        </div>

        <div class='message'>
            <p>Merhaba <strong>{firstName}</strong>,</p>
            <p>BerkAI Fashion ailesine katıldığınız için çok mutluyuz! 🎉</p>
            <p>Hesabınızı aktive etmek için aşağıdaki kodu kullanın:</p>
        </div>

        <div class='code-box'>{activationCode}</div>

        <div class='warning'>
            ⏱️ Bu kod <strong class='highlight'>15 dakika</strong> süreyle geçerlidir.
        </div>

        <div class='message'>
            <p>Kodu web sitemizde veya uygulamamızda ilgili alana girerek email adresinizi doğrulayabilirsiniz.</p>
            <p style='color: #e74c3c;'><strong>Önemli:</strong> Eğer bu kaydı siz yapmadıysanız, bu e-postayı görmezden gelebilirsiniz.</p>
        </div>

        <div class='footer'>
            <p><strong>BerkAI Fashion</strong></p>
            <p>Modern Giyim, Modern Alışveriş 👔</p>
            <p style='color: #bdc3c7; font-size: 11px; margin-top: 15px;'>
                Bu otomatik bir e-postadır, lütfen yanıtlamayın.<br>
                © 2025 BerkAI Fashion. Tüm hakları saklıdır.
            </p>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(email, subject, body);
    }
}
