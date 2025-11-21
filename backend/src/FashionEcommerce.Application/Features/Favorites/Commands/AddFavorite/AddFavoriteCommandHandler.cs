using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Favorite;
using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Favorites.Commands.AddFavorite;

public class AddFavoriteCommandHandler : IRequestHandler<AddFavoriteCommand, Result<FavoriteDto>>
{
    private readonly IUnitOfWork _unitOfWork;

    public AddFavoriteCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<FavoriteDto>> Handle(AddFavoriteCommand request, CancellationToken cancellationToken)
    {
        // Ürünün var olup olmadığını kontrol et
        var product = await _unitOfWork.Products.GetByIdAsync(request.AddFavoriteDto.ProductId);
        if (product == null)
        {
            return Result<FavoriteDto>.Failure("Ürün bulunamadı");
        }

        // Favoride zaten var mı kontrol et
        var existingFavorite = await _unitOfWork.Favorites.GetByUserAndProductAsync(request.UserId, request.AddFavoriteDto.ProductId);
        if (existingFavorite != null)
        {
            return Result<FavoriteDto>.Failure("Bu ürün zaten favorilerde");
        }

        // Yeni favori oluştur
        var favorite = new Favorite
        {
            UserId = request.UserId,
            ProductId = request.AddFavoriteDto.ProductId
        };

        await _unitOfWork.Favorites.AddAsync(favorite);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        var favoriteDto = new FavoriteDto
        {
            Id = favorite.Id,
            UserId = favorite.UserId,
            ProductId = favorite.ProductId,
            CreatedAt = favorite.CreatedAt
        };

        return Result<FavoriteDto>.Success(favoriteDto);
    }
}
