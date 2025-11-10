using FashionEcommerce.Application.Common;
using MediatR;

namespace FashionEcommerce.Application.Features.Brands.Commands.DeleteBrand;

public record DeleteBrandCommand(Guid Id) : IRequest<Result<bool>>;
