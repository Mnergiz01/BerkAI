using FashionEcommerce.Application.DTOs.Auth;
using FashionEcommerce.Application.Features.Auth.Commands.AdminLogin;
using FashionEcommerce.Application.Features.Auth.Commands.Login;
using FashionEcommerce.Application.Features.Auth.Commands.Register;
using FashionEcommerce.Application.Features.Auth.Commands.VerifyEmail;
using FashionEcommerce.Application.Features.Auth.Commands.GoogleLogin;
using MediatR;
using Microsoft.AspNetCore.Mvc;

namespace FashionEcommerce.WebAPI.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly IMediator _mediator;

    public AuthController(IMediator mediator)
    {
        _mediator = mediator;
    }

    /// <summary>
    /// Yeni kullanıcı kaydı - Email'e aktivasyon kodu gönderilir
    /// </summary>
    [HttpPost("register")]
    public async Task<IActionResult> Register([FromBody] RegisterDto registerDto)
    {
        var command = new RegisterCommand(registerDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Email aktivasyonu - Kullanıcı email'e gelen kodu girer
    /// </summary>
    [HttpPost("verify-email")]
    public async Task<IActionResult> VerifyEmail([FromBody] VerifyEmailDto verifyEmailDto)
    {
        var command = new VerifyEmailCommand(verifyEmailDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return BadRequest(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Kullanıcı girişi - Email onaylanmış olmalı
    /// </summary>
    [HttpPost("login")]
    public async Task<IActionResult> Login([FromBody] LoginDto loginDto)
    {
        var command = new LoginCommand(loginDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Admin girişi - Username ve şifre ile giriş
    /// </summary>
    [HttpPost("admin/login")]
    public async Task<IActionResult> AdminLogin([FromBody] AdminLoginDto adminLoginDto)
    {
        var command = new AdminLoginCommand(adminLoginDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }

    /// <summary>
    /// Google ile giriş yap
    /// </summary>
    [HttpPost("google-login")]
    public async Task<IActionResult> GoogleLogin([FromBody] GoogleLoginDto googleLoginDto)
    {
        var command = new GoogleLoginCommand(googleLoginDto);
        var result = await _mediator.Send(command);

        if (!result.IsSuccess)
        {
            return Unauthorized(result);
        }

        return Ok(result);
    }
}
