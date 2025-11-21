using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Favorite;
using FashionEcommerce.Application.DTOs.Products;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Favorites.Queries.GetUserFavorites;

public class GetUserFavoritesQueryHandler : IRequestHandler<GetUserFavoritesQuery, Result<IEnumerable<FavoriteDto>>>
{
    private readonly IUnitOfWork _unitOfWork;

    public GetUserFavoritesQueryHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<IEnumerable<FavoriteDto>>> Handle(GetUserFavoritesQuery request, CancellationToken cancellationToken)
    {
        var favorites = await _unitOfWork.Favorites.GetUserFavoritesAsync(request.UserId);

        var favoriteDtos = favorites.Select(f => new FavoriteDto
        {
            Id = f.Id,
            UserId = f.UserId,
            ProductId = f.ProductId,
            CreatedAt = f.CreatedAt,
            Product = f.Product != null ? new ProductDto
            {
                Id = f.Product.Id,
                Name = f.Product.Name,
                Slug = f.Product.Slug,
                Description = f.Product.Description,
                ShortDescription = f.Product.ShortDescription,
                Price = f.Product.Price,
                DiscountPrice = f.Product.DiscountPrice,
                SKU = f.Product.SKU,
                StockQuantity = f.Product.StockQuantity,
                Gender = f.Product.Gender,
                IsFeatured = f.Product.IsFeatured,
                IsActive = f.Product.IsActive,
                ViewCount = f.Product.ViewCount,
                CategoryId = f.Product.CategoryId,
                CategoryName = f.Product.Category?.Name,
                BrandId = f.Product.BrandId,
                BrandName = f.Product.Brand?.Name,
                Images = f.Product.Images.Select(img => new ProductImageDto
                {
                    Id = img.Id,
                    ImageUrl = img.ImageUrl,
                    DisplayOrder = img.DisplayOrder,
                    IsMainImage = img.IsMainImage
                }).ToList()
            } : null
        }).ToList();

        return Result<IEnumerable<FavoriteDto>>.Success(favoriteDtos);
    }
}
