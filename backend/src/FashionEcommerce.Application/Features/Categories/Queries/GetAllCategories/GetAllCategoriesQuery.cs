using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Categories;
using MediatR;

namespace FashionEcommerce.Application.Features.Categories.Queries.GetAllCategories;

public record GetAllCategoriesQuery : IRequest<Result<IEnumerable<CategoryDto>>>;
