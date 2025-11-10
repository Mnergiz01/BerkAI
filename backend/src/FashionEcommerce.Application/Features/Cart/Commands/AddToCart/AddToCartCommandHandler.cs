using AutoMapper;
using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Cart;
using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Cart.Commands.AddToCart;

public class AddToCartCommandHandler : IRequestHandler<AddToCartCommand, Result<CartDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public AddToCartCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<CartDto>> Handle(AddToCartCommand request, CancellationToken cancellationToken)
    {
        // Ürün var mı kontrol et
        var product = await _unitOfWork.Products.GetByIdAsync(request.AddToCartDto.ProductId);
        if (product == null)
        {
            return Result<CartDto>.Failure("Ürün bulunamadı");
        }

        // Stok kontrolü
        if (product.StockQuantity < request.AddToCartDto.Quantity)
        {
            return Result<CartDto>.Failure("Yetersiz stok");
        }

        // Kullanıcının sepetini bul veya oluştur
        var cart = await _unitOfWork.Carts.GetCartWithItemsAsync(request.UserId);
        if (cart == null)
        {
            cart = new Domain.Entities.Cart
            {
                UserId = request.UserId
            };
            await _unitOfWork.Carts.AddAsync(cart);
            await _unitOfWork.SaveChangesAsync();
        }

        // Aynı ürün sepette var mı?
        var existingItem = cart.CartItems.FirstOrDefault(ci =>
            ci.ProductId == request.AddToCartDto.ProductId &&
            ci.ProductVariantId == request.AddToCartDto.ProductVariantId);

        if (existingItem != null)
        {
            // Var ise miktarı artır
            existingItem.Quantity += request.AddToCartDto.Quantity;
            await _unitOfWork.SaveChangesAsync();
        }
        else
        {
            // Yok ise yeni item ekle
            var cartItem = new CartItem
            {
                CartId = cart.Id,
                ProductId = request.AddToCartDto.ProductId,
                ProductVariantId = request.AddToCartDto.ProductVariantId,
                Quantity = request.AddToCartDto.Quantity
            };

            cart.CartItems.Add(cartItem);
            await _unitOfWork.SaveChangesAsync();
        }

        // Güncel sepeti getir ve DTO'ya çevir
        cart = await _unitOfWork.Carts.GetCartWithItemsAsync(request.UserId);
        var cartDto = _mapper.Map<CartDto>(cart);

        return Result<CartDto>.Success(cartDto);
    }
}
