using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.Register;

public class RegisterCommandHandler : IRequestHandler<RegisterCommand, Result<string>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IEmailService _emailService;

    public RegisterCommandHandler(IUnitOfWork unitOfWork, IEmailService emailService)
    {
        _unitOfWork = unitOfWork;
        _emailService = emailService;
    }

    public async Task<Result<string>> Handle(RegisterCommand request, CancellationToken cancellationToken)
    {
        // Email kontrolü
        var emailExists = await _unitOfWork.Users.EmailExistsAsync(request.RegisterDto.Email);
        if (emailExists)
        {
            return Result<string>.Failure("Bu email adresi zaten kullanılıyor");
        }

        // Google ile kayıt ise email otomatik onaylı
        bool isGoogleSignup = request.RegisterDto.IsGoogleSignup;
        string? activationCode = null;
        DateTime? codeExpiry = null;

        if (!isGoogleSignup)
        {
            // Normal kayıt için aktivasyon kodu oluştur
            activationCode = new Random().Next(100000, 999999).ToString();
            codeExpiry = DateTime.UtcNow.AddMinutes(3); // 3 dakika geçerli
        }

        // Şifre hash'le
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.RegisterDto.Password);

        var user = new User
        {
            FirstName = request.RegisterDto.FirstName,
            LastName = request.RegisterDto.LastName,
            Email = request.RegisterDto.Email,
            PhoneNumber = request.RegisterDto.PhoneNumber,
            Gender = request.RegisterDto.Gender,
            PasswordHash = passwordHash,
            IsEmailConfirmed = isGoogleSignup, // Google ile kayıtta direkt onaylı
            EmailConfirmationCode = activationCode,
            EmailConfirmationCodeExpiry = codeExpiry,
            AuthProvider = isGoogleSignup ? FashionEcommerce.Domain.Enums.AuthProvider.Google : FashionEcommerce.Domain.Enums.AuthProvider.Local
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Email gönder (sadece normal kayıtta)
        if (!isGoogleSignup && activationCode != null)
        {
            await _emailService.SendActivationCodeAsync(user.Email, user.FirstName, activationCode);
            return Result<string>.Success($"Kayıt başarılı! {user.Email} adresine aktivasyon kodu gönderildi.");
        }

        return Result<string>.Success("Kayıt başarılı! Google hesabınız ile giriş yapabilirsiniz.");
    }
}
