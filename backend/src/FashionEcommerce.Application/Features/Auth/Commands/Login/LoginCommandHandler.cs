using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.Login;

public class LoginCommandHandler : IRequestHandler<LoginCommand, Result<AuthResponseDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;

    public LoginCommandHandler(IUnitOfWork unitOfWork, ITokenService tokenService)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthResponseDto>> Handle(LoginCommand request, CancellationToken cancellationToken)
    {
        var user = await _unitOfWork.Users.GetByEmailAsync(request.LoginDto.Email);
        if (user == null)
        {
            return Result<AuthResponseDto>.Failure("Email veya şifre hatalı");
        }

        // Şifre kontrolü
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.LoginDto.Password, user.PasswordHash);
        if (!isPasswordValid)
        {
            return Result<AuthResponseDto>.Failure("Email veya şifre hatalı");
        }

        // Email onaylanmış mı?
        if (!user.IsEmailConfirmed)
        {
            return Result<AuthResponseDto>.Failure("Lütfen önce email adresinizi onaylayın");
        }

        // Token oluştur
        var token = _tokenService.GenerateToken(user);

        // LastLoginAt güncelle
        user.LastLoginAt = DateTime.UtcNow;
        await _unitOfWork.Users.UpdateAsync(user);
        await _unitOfWork.SaveChangesAsync();

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
