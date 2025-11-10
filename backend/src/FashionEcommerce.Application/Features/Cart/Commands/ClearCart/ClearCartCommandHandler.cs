using FashionEcommerce.Application.Common;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Commands.ClearCart;

public class ClearCartCommandHandler : IRequestHandler<ClearCartCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public ClearCartCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(ClearCartCommand request, CancellationToken cancellationToken)
    {
        var cart = await _unitOfWork.Carts.GetCartWithItemsAsync(request.UserId);
        if (cart == null)
        {
            return Result<bool>.Failure("Sepet bulunamadı");
        }

        cart.CartItems.Clear();
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }
}
