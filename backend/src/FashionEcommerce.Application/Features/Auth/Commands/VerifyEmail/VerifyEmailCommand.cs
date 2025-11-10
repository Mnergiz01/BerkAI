using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.VerifyEmail;

public record VerifyEmailCommand(VerifyEmailDto VerifyEmailDto) : IRequest<Result<AuthResponseDto>>;
