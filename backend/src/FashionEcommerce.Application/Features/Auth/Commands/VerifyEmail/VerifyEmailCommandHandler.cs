using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.VerifyEmail;

public class VerifyEmailCommandHandler : IRequestHandler<VerifyEmailCommand, Result<AuthResponseDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;

    public VerifyEmailCommandHandler(IUnitOfWork unitOfWork, ITokenService tokenService)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthResponseDto>> Handle(VerifyEmailCommand request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(request.VerifyEmailDto.Email);
        if (user == null)
        {
            return Result<AuthResponseDto>.Failure("Kullanıcı bulunamadı");
        }

        if (user.IsEmailConfirmed)
        {
            return Result<AuthResponseDto>.Failure("Email zaten onaylanmış");
        }

        // Kod kontrolü
        if (user.EmailConfirmationCode != request.VerifyEmailDto.ActivationCode)
        {
            return Result<AuthResponseDto>.Failure("Aktivasyon kodu hatalı");
        }

        // Kod süresi dolmuş mu?
        if (user.EmailConfirmationCodeExpiry < DateTime.UtcNow)
        {
            return Result<AuthResponseDto>.Failure("Aktivasyon kodunun süresi dolmuş. Lütfen yeni bir kod isteyin.");
        }

        // Email'i onayla
        user.IsEmailConfirmed = true;
        user.EmailConfirmationCode = null;
        user.EmailConfirmationCodeExpiry = null;

        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

        // Token oluştur ve kullanıcıyı otomatik giriş yaptır
        var token = _tokenService.GenerateToken(user);

        var response = new AuthResponseDto
        {
            Token = token,
            Email = user.Email,
            FirstName = user.FirstName,
            LastName = user.LastName,
            IsEmailConfirmed = user.IsEmailConfirmed
        };

        return Result<AuthResponseDto>.Success(response);
    }
}
