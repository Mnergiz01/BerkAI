using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.AdminLogin;

public record AdminLoginCommand(AdminLoginDto AdminLoginDto) : IRequest<Result<AuthResponseDto>>;
