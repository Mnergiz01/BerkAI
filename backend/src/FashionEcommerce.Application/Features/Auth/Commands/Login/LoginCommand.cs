using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.Login;

public record LoginCommand(LoginDto LoginDto) : IRequest<Result<AuthResponseDto>>;
