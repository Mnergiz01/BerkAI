using FashionEcommerce.Application.DTOs.Favorite;
using FashionEcommerce.Application.Features.Favorites.Commands.AddFavorite;
using FashionEcommerce.Application.Features.Favorites.Commands.RemoveFavorite;
using FashionEcommerce.Application.Features.Favorites.Queries.GetUserFavorites;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace FashionEcommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class FavoritesController : ControllerBase
{
    private readonly IMediator _mediator;

    public FavoritesController(IMediator mediator)
    {
        _mediator = mediator;
    }

    private Guid GetUserId()
    {
        var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userIdClaim) || !Guid.TryParse(userIdClaim, out var userId))
        {
            throw new UnauthorizedAccessException("Kullanıcı kimliği bulunamadı");
        }
        return userId;
    }

    [HttpGet]
    public async Task<IActionResult> GetUserFavorites()
    {
        var userId = GetUserId();
        var query = new GetUserFavoritesQuery(userId);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> AddFavorite([FromBody] AddFavoriteDto addFavoriteDto)
    {
        var userId = GetUserId();
        var command = new AddFavoriteCommand(userId, addFavoriteDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpDelete("{productId}")]
    public async Task<IActionResult> RemoveFavorite(Guid productId)
    {
        var userId = GetUserId();
        var command = new RemoveFavoriteCommand(userId, productId);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("check/{productId}")]
    public async Task<IActionResult> CheckFavorite(Guid productId)
    {
        var userId = GetUserId();
        var favorites = await _mediator.Send(new GetUserFavoritesQuery(userId));

        if (!favorites.IsSuccess)
        {
            return BadRequest(favorites);
        }

        var isFavorite = favorites.Data?.Any(f => f.ProductId == productId) ?? false;

        return Ok(new { isFavorite });
    }
}
