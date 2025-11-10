using System.Security.Claims;
using FashionEcommerce.Application.DTOs.Cart;
using FashionEcommerce.Application.Features.Cart.Commands.AddToCart;
using FashionEcommerce.Application.Features.Cart.Commands.ClearCart;
using FashionEcommerce.Application.Features.Cart.Commands.RemoveCartItem;
using FashionEcommerce.Application.Features.Cart.Commands.UpdateCartItem;
using FashionEcommerce.Application.Features.Cart.Queries.GetCart;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace FashionEcommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class CartController : ControllerBase
{
    private readonly IMediator _mediator;

    public CartController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        return Guid.Parse(userIdClaim!);
    }

    /// <summary>
    /// Kullanıcının sepetini getir
    /// </summary>
    [HttpGet]
    public async Task<IActionResult> GetCart()
    {
        var userId = GetUserId();
        var query = new GetCartQuery(userId);
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    /// <summary>
    /// Sepete ürün ekle
    /// </summary>
    [HttpPost("add")]
    public async Task<IActionResult> AddToCart([FromBody] AddToCartDto addToCartDto)
    {
        var userId = GetUserId();
        var command = new AddToCartCommand(userId, addToCartDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Sepetteki ürün miktarını güncelle
    /// </summary>
    [HttpPut("items/{cartItemId}")]
    public async Task<IActionResult> UpdateCartItem(
        Guid cartItemId,
        [FromBody] UpdateCartItemDto updateDto)
    {
        var userId = GetUserId();
        var command = new UpdateCartItemCommand(userId, cartItemId, updateDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Sepetten ürün çıkar
    /// </summary>
    [HttpDelete("items/{cartItemId}")]
    public async Task<IActionResult> RemoveCartItem(Guid cartItemId)
    {
        var userId = GetUserId();
        var command = new RemoveCartItemCommand(userId, cartItemId);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Sepeti temizle
    /// </summary>
    [HttpDelete("clear")]
    public async Task<IActionResult> ClearCart()
    {
        var userId = GetUserId();
        var command = new ClearCartCommand(userId);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }
}
