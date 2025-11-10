using FashionEcommerce.Application.DTOs.Products;
using FashionEcommerce.Application.Features.Products.Commands.CreateProduct;
using FashionEcommerce.Application.Features.Products.Queries.GetAllProducts;
using FashionEcommerce.Application.Features.Products.Queries.GetProductById;
using FashionEcommerce.Application.Features.Products.Queries.SearchProducts;
using FashionEcommerce.Domain.Enums;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FashionEcommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ProductsController : ControllerBase
{
    private readonly IMediator _mediator;

    public ProductsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllProducts(CancellationToken cancellationToken)
    {
        var query = new GetAllProductsQuery();
        var result = await _mediator.Send(query, cancellationToken);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetProductById(Guid id, CancellationToken cancellationToken)
    {
        var query = new GetProductByIdQuery(id);
        var result = await _mediator.Send(query, cancellationToken);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateProduct([FromBody] CreateProductDto productDto, CancellationToken cancellationToken)
    {
        var command = new CreateProductCommand(productDto);
        var result = await _mediator.Send(command, cancellationToken);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return CreatedAtAction(nameof(GetProductById), new { id = result.Data!.Id }, result);
    }

    /// <summary>
    /// Ürün arama ve filtreleme
    /// </summary>
    [HttpGet("search")]
    public async Task<IActionResult> SearchProducts(
        [FromQuery] string? q,
        [FromQuery] Guid? categoryId,
        [FromQuery] Guid? brandId,
        [FromQuery] decimal? minPrice,
        [FromQuery] decimal? maxPrice,
        [FromQuery] Gender? gender,
        [FromQuery] string? sortBy,
        CancellationToken cancellationToken)
    {
        var query = new SearchProductsQuery(q, categoryId, brandId, minPrice, maxPrice, gender, sortBy);
        var result = await _mediator.Send(query, cancellationToken);
        return Ok(result);
    }
}
