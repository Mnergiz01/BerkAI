using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.AdminLogin;

public class AdminLoginCommandHandler : IRequestHandler<AdminLoginCommand, Result<AuthResponseDto>>
{
    private readonly IAdminRepository _adminRepository;
    private readonly ITokenService _tokenService;

    public AdminLoginCommandHandler(IAdminRepository adminRepository, ITokenService tokenService)
    {
        _adminRepository = adminRepository;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthResponseDto>> Handle(AdminLoginCommand request, CancellationToken cancellationToken)
    {
        var admin = await _adminRepository.GetByUsernameAsync(request.AdminLoginDto.Username);
        if (admin == null)
        {
            return Result<AuthResponseDto>.Failure("Kullanıcı adı veya şifre hatalı");
        }

        // Şifre kontrolü
        var isPasswordValid = BCrypt.Net.BCrypt.Verify(request.AdminLoginDto.Password, admin.PasswordHash);
        if (!isPasswordValid)
        {
            return Result<AuthResponseDto>.Failure("Kullanıcı adı veya şifre hatalı");
        }

        // Token oluştur (Admin için özel claims eklenebilir)
        var token = _tokenService.GenerateAdminToken(admin);

        // LastLoginAt güncelle
        admin.LastLoginAt = DateTime.UtcNow;
        await _adminRepository.UpdateAsync(admin);

        var response = new AuthResponseDto
        {
            Token = token,
            Email = admin.Email,
            FirstName = admin.Username,
            LastName = "Admin",
            IsEmailConfirmed = true
        };

        return Result<AuthResponseDto>.Success(response);
    }
}
