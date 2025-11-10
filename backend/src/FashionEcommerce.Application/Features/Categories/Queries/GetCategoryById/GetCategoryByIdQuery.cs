using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Categories;
using MediatR;

namespace FashionEcommerce.Application.Features.Categories.Queries.GetCategoryById;

public record GetCategoryByIdQuery(Guid Id) : IRequest<Result<CategoryDto>>;
