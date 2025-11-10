using AutoMapper;
using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Cart;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Commands.RemoveCartItem;

public class RemoveCartItemCommandHandler : IRequestHandler<RemoveCartItemCommand, Result<CartDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public RemoveCartItemCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CartDto>> Handle(RemoveCartItemCommand request, CancellationToken cancellationToken)
    {
        var cart = await _unitOfWork.Carts.GetCartWithItemsAsync(request.UserId);
        if (cart == null)
        {
            return Result<CartDto>.Failure("Sepet bulunamadı");
        }

        var cartItem = cart.CartItems.FirstOrDefault(ci => ci.Id == request.CartItemId);
        if (cartItem == null)
        {
            return Result<CartDto>.Failure("Sepet öğesi bulunamadı");
        }

        cart.CartItems.Remove(cartItem);
        await _unitOfWork.SaveChangesAsync();

        // Güncel sepeti döndür
        cart = await _unitOfWork.Carts.GetCartWithItemsAsync(request.UserId);
        var cartDto = _mapper.Map<CartDto>(cart);

        return Result<CartDto>.Success(cartDto);
    }

}
