using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Categories;
using MediatR;

namespace FashionEcommerce.Application.Features.Categories.Commands.UpdateCategory;

public record UpdateCategoryCommand(Guid Id, UpdateCategoryDto CategoryDto) : IRequest<Result<CategoryDto>>;
