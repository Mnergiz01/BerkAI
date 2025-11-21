using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.GoogleLogin;

public record GoogleLoginCommand(GoogleLoginDto GoogleLoginDto) : IRequest<Result<AuthResponseDto>>;
