using FashionEcommerce.Application.DTOs.Brands;
using FashionEcommerce.Application.Features.Brands.Commands.CreateBrand;
using FashionEcommerce.Application.Features.Brands.Commands.DeleteBrand;
using FashionEcommerce.Application.Features.Brands.Commands.UpdateBrand;
using FashionEcommerce.Application.Features.Brands.Queries.GetAllBrands;
using FashionEcommerce.Application.Features.Brands.Queries.GetBrandById;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FashionEcommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class BrandsController : ControllerBase
{
    private readonly IMediator _mediator;

    public BrandsController(IMediator mediator)
    {
        _mediator = mediator;
    }

    [HttpGet]
    public async Task<IActionResult> GetAllBrands()
    {
        var query = new GetAllBrandsQuery();
        var result = await _mediator.Send(query);
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetBrandById(Guid id)
    {
        var query = new GetBrandByIdQuery(id);
        var result = await _mediator.Send(query);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpPost]
    public async Task<IActionResult> CreateBrand([FromBody] CreateBrandDto brandDto)
    {
        var command = new CreateBrandCommand(brandDto);
        var result = await _mediator.Send(command);
        return Ok(result);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateBrand(Guid id, [FromBody] UpdateBrandDto brandDto)
    {
        var command = new UpdateBrandCommand(id, brandDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteBrand(Guid id)
    {
        var command = new DeleteBrandCommand(id);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return NotFound(result);
        }

        return Ok(result);
    }
}
