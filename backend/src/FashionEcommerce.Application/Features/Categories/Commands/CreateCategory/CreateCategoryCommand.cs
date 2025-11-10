using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Categories;
using MediatR;

namespace FashionEcommerce.Application.Features.Categories.Commands.CreateCategory;

public record CreateCategoryCommand(CreateCategoryDto CategoryDto) : IRequest<Result<CategoryDto>>;
