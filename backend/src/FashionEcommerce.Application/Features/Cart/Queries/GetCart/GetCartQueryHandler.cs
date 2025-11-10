using AutoMapper;
using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Cart;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Queries.GetCart;

public class GetCartQueryHandler : IRequestHandler<GetCartQuery, Result<CartDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetCartQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CartDto>> Handle(GetCartQuery request, CancellationToken cancellationToken)
    {
        var cart = await _unitOfWork.Carts.GetCartWithItemsAsync(request.UserId);
        if (cart == null)
        {
            // Boş sepet döndür
            return Result<CartDto>.Success(new CartDto
            {
                UserId = request.UserId,
                Items = new List<CartItemDto>(),
                TotalPrice = 0,
                TotalItems = 0
            });
        }

        var cartDto = _mapper.Map<CartDto>(cart);
        return Result<CartDto>.Success(cartDto);
    }
}
