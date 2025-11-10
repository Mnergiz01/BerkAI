using FashionEcommerce.Application.Common;
using MediatR;

namespace FashionEcommerce.Application.Features.Categories.Commands.DeleteCategory;

public record DeleteCategoryCommand(Guid Id) : IRequest<Result<bool>>;
