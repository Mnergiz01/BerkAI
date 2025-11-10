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

        // 6 haneli aktivasyon kodu oluştur
        var activationCode = new Random().Next(100000, 999999).ToString();

        // Şifre hash'le (basit örnek - production'da BCrypt kullanılmalı)
        var passwordHash = BCrypt.Net.BCrypt.HashPassword(request.RegisterDto.Password);

        var user = new User
        {
            FirstName = request.RegisterDto.FirstName,
            LastName = request.RegisterDto.LastName,
            Email = request.RegisterDto.Email,
            PhoneNumber = request.RegisterDto.PhoneNumber,
            PasswordHash = passwordHash,
            IsEmailConfirmed = false,
            EmailConfirmationCode = activationCode,
            EmailConfirmationCodeExpiry = DateTime.UtcNow.AddMinutes(15) // 15 dakika geçerli
        };

        await _unitOfWork.Users.AddAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Email gönder
        await _emailService.SendActivationCodeAsync(user.Email, user.FirstName, activationCode);

        return Result<string>.Success($"Kayıt başarılı! {user.Email} adresine aktivasyon kodu gönderildi.");
    }
}
