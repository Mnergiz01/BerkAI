using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Auth;
using MediatR;

namespace FashionEcommerce.Application.Features.Auth.Commands.Register;

public record RegisterCommand(RegisterDto RegisterDto) : IRequest<Result<string>>;
