using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using Google.Apis.Auth;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.GoogleLogin;

public class GoogleLoginCommandHandler : IRequestHandler<GoogleLoginCommand, Result<AuthResponseDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly ITokenService _tokenService;

    public GoogleLoginCommandHandler(
        IUnitOfWork unitOfWork,
        ITokenService tokenService)
    {
        _unitOfWork = unitOfWork;
        _tokenService = tokenService;
    }

    public async Task<Result<AuthResponseDto>> Handle(GoogleLoginCommand request, CancellationToken cancellationToken)
    {
        try
        {
            // Google access token'ı doğrula
            var payload = await VerifyGoogleToken(request.GoogleLoginDto.AccessToken);

            if (payload == null)
            {
                return Result<AuthResponseDto>.Failure("Google token geçersiz.");
            }

            // Email ile kullanıcıyı ara
            var user = await _unitOfWork.Users.GetByEmailAsync(payload.Email);

            // Kullanıcı yoksa kayıt olmaya yönlendir
            if (user == null)
            {
                return Result<AuthResponseDto>.Failure("Kullanıcı bulunamadı. Lütfen önce kayıt olun.");
            }

            // JWT token oluştur
            var token = _tokenService.GenerateToken(user);

            // LastLoginAt güncelle
            user.LastLoginAt = DateTime.UtcNow;
            await _unitOfWork.Users.UpdateAsync(user);
            await _unitOfWork.SaveChangesAsync();

            var authResponse = new AuthResponseDto
            {
                Token = token,
                Email = user.Email,
                FirstName = user.FirstName,
                LastName = user.LastName,
                IsEmailConfirmed = user.IsEmailConfirmed
            };

            return Result<AuthResponseDto>.Success(authResponse);
        }
        catch (Exception ex)
        {
            return Result<AuthResponseDto>.Failure($"Google ile giriş yapılırken bir hata oluştu: {ex.Message}");
        }
    }

    private async Task<GoogleJsonWebSignature.Payload?> VerifyGoogleToken(string accessToken)
    {
        try
        {
            // Google'dan kullanıcı bilgilerini al
            var httpClient = new HttpClient();
            var response = await httpClient.GetStringAsync($"https://www.googleapis.com/oauth2/v3/userinfo?access_token={accessToken}");

            if (string.IsNullOrEmpty(response))
                return null;

            // JSON'u parse et
            var json = System.Text.Json.JsonSerializer.Deserialize<Dictionary<string, object>>(response);
            if (json == null)
                return null;

            // Payload oluştur
            return new GoogleJsonWebSignature.Payload
            {
                Email = json.ContainsKey("email") ? json["email"].ToString() : string.Empty,
                GivenName = json.ContainsKey("given_name") ? json["given_name"].ToString() : string.Empty,
                FamilyName = json.ContainsKey("family_name") ? json["family_name"].ToString() : string.Empty,
                EmailVerified = json.ContainsKey("email_verified") && bool.Parse(json["email_verified"].ToString() ?? "false")
            };
        }
        catch
        {
            return null;
        }
    }
}
