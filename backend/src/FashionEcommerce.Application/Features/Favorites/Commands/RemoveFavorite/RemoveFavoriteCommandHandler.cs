using FashionEcommerce.Application.Common;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Favorites.Commands.RemoveFavorite;

public class RemoveFavoriteCommandHandler : IRequestHandler<RemoveFavoriteCommand, Result<string>>
{
    private readonly IUnitOfWork _unitOfWork;

    public RemoveFavoriteCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<string>> Handle(RemoveFavoriteCommand request, CancellationToken cancellationToken)
    {
        var favorite = await _unitOfWork.Favorites.GetByUserAndProductAsync(request.UserId, request.ProductId);

        if (favorite == null)
        {
            return Result<string>.Failure("Favori bulunamadı");
        }

        await _unitOfWork.Favorites.RemoveAsync(favorite);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        return Result<string>.Success("Favorilerden kaldırıldı");
    }
}
