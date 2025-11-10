using AutoMapper;
using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Cart;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Commands.UpdateCartItem;

public class UpdateCartItemCommandHandler : IRequestHandler<UpdateCartItemCommand, Result<CartDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public UpdateCartItemCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CartDto>> Handle(UpdateCartItemCommand request, CancellationToken cancellationToken)
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

        if (request.UpdateDto.Quantity <= 0)
        {
            return Result<CartDto>.Failure("Miktar 0'dan büyük olmalı");
        }

        cartItem.Quantity = request.UpdateDto.Quantity;
        await _unitOfWork.SaveChangesAsync();

        cart = await _unitOfWork.Carts.GetCartWithItemsAsync(request.UserId);
        var cartDto = _mapper.Map<CartDto>(cart);

        return Result<CartDto>.Success(cartDto);
    }

}
