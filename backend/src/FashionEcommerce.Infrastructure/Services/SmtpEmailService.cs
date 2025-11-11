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
        var subject = "BerkAI Fashion - E-posta Doğrulama Kodu";
        var body = $@"
<!DOCTYPE html>
<html lang='tr'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <style>
        * {{
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }}
        body {{
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            background-color: #f5f5f5;
            line-height: 1.6;
            padding: 20px 0;
        }}
        .email-wrapper {{
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
        }}
        .header {{
            background: linear-gradient(135deg, #000000 0%, #1a1a1a 100%);
            padding: 40px 30px;
            text-align: center;
        }}
        .logo {{
            font-size: 32px;
            font-weight: 700;
            color: #ffffff;
            letter-spacing: -0.5px;
            margin-bottom: 8px;
        }}
        .tagline {{
            color: #a0a0a0;
            font-size: 13px;
            letter-spacing: 2px;
            text-transform: uppercase;
        }}
        .content {{
            padding: 50px 40px;
        }}
        .greeting {{
            font-size: 24px;
            color: #1a1a1a;
            margin-bottom: 20px;
            font-weight: 600;
        }}
        .text {{
            color: #4a4a4a;
            font-size: 15px;
            line-height: 1.8;
            margin-bottom: 16px;
        }}
        .code-container {{
            background-color: #f8f8f8;
            border: 2px solid #e0e0e0;
            border-radius: 12px;
            padding: 35px 20px;
            margin: 35px 0;
            text-align: center;
        }}
        .code-label {{
            color: #666666;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1.5px;
            margin-bottom: 15px;
            font-weight: 600;
        }}
        .code {{
            font-size: 42px;
            font-weight: 700;
            color: #000000;
            letter-spacing: 12px;
            font-family: 'Courier New', monospace;
            margin: 10px 0;
        }}
        .expiry-notice {{
            background-color: #fff9e6;
            border-left: 4px solid #000000;
            padding: 18px 20px;
            margin: 30px 0;
            border-radius: 4px;
        }}
        .expiry-notice-text {{
            color: #1a1a1a;
            font-size: 14px;
            margin: 0;
        }}
        .expiry-time {{
            font-weight: 700;
            color: #000000;
        }}
        .instructions {{
            background-color: #f8f8f8;
            padding: 25px;
            border-radius: 8px;
            margin: 30px 0;
        }}
        .instructions-title {{
            font-size: 14px;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 12px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .instructions-list {{
            list-style: none;
            padding: 0;
            margin: 0;
        }}
        .instructions-list li {{
            color: #4a4a4a;
            font-size: 14px;
            padding: 8px 0;
            padding-left: 25px;
            position: relative;
        }}
        .instructions-list li:before {{
            content: '→';
            position: absolute;
            left: 0;
            font-weight: bold;
            color: #000000;
        }}
        .security-notice {{
            background-color: #f0f0f0;
            padding: 20px;
            border-radius: 6px;
            margin-top: 30px;
        }}
        .security-notice-title {{
            color: #1a1a1a;
            font-size: 13px;
            font-weight: 600;
            margin-bottom: 8px;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }}
        .security-notice-text {{
            color: #666666;
            font-size: 13px;
            line-height: 1.6;
            margin: 0;
        }}
        .divider {{
            height: 1px;
            background: linear-gradient(to right, transparent, #e0e0e0, transparent);
            margin: 40px 0;
        }}
        .footer {{
            background-color: #1a1a1a;
            padding: 40px 30px;
            text-align: center;
            color: #a0a0a0;
        }}
        .footer-brand {{
            color: #ffffff;
            font-size: 18px;
            font-weight: 600;
            margin-bottom: 12px;
        }}
        .footer-text {{
            font-size: 13px;
            line-height: 1.8;
            margin: 8px 0;
        }}
        .footer-links {{
            margin-top: 20px;
            padding-top: 20px;
            border-top: 1px solid #333333;
        }}
        .footer-link {{
            color: #a0a0a0;
            text-decoration: none;
            margin: 0 12px;
            font-size: 12px;
            text-transform: uppercase;
            letter-spacing: 1px;
        }}
        .copyright {{
            margin-top: 20px;
            font-size: 11px;
            color: #666666;
        }}
    </style>
</head>
<body>
    <div class='email-wrapper'>
        <div class='header'>
            <div class='logo'>BerkAI</div>
            
        </div>

        <div class='content'>
            <div class='greeting'>Merhaba {firstName},</div>

            <p class='text'>
            Hesabınızı oluşturduğunuz için teşekkür ederiz.
            </p>

            <p class='text'>
                E-posta adresinizi doğrulamak ve hesabınızı aktifleştirmek için aşağıdaki doğrulama kodunu kullanmanız gerekmektedir.
            </p>

            <div class='code-container'>
                <div class='code-label'>Doğrulama Kodu</div>
                <div class='code'>{activationCode}</div>
            </div>

            <div class='expiry-notice'>
                <p class='expiry-notice-text'>
                    Bu doğrulama kodu <span class='expiry-time'>3 dakika</span> süreyle geçerlidir. Lütfen bu süre içerisinde doğrulama işlemini tamamlayınız.
                </p>
            </div>

            

            <div class='divider'></div>

            <div class='security-notice'>
                <div class='security-notice-title'>Güvenlik Bildirimi</div>
                <p class='security-notice-text'>
                    Bu işlemi siz yapmadıysanız, lütfen bu e-postayı dikkate almayın. Hesap güvenliğiniz için bu kodu kimseyle paylaşmayın.
                </p>
            </div>
        </div>

        <div class='footer'>
            <div class='footer-brand'>BerkAI</div>
            <p class='footer-text'>Modern giyim, olağanüstü deneyim</p>
            <p class='footer-text'>Stil ve teknolojinin buluştuğu nokta</p>

            

            <p class='copyright'>
                © 2025 BerkAI. Tüm hakları saklıdır.<br>
                Bu otomatik bir e-postadır, lütfen yanıtlamayın.
            </p>
        </div>
    </div>
</body>
</html>";

        await SendEmailAsync(email, subject, body);
    }
}
