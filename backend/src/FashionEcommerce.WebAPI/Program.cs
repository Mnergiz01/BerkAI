using System.Text;
using FashionEcommerce.Application.Mappings;
using FashionEcommerce.Domain.Interfaces;
using FashionEcommerce.Infrastructure.Data;
using FashionEcommerce.Infrastructure.Repositories;
using FashionEcommerce.Infrastructure.Services;
using FashionEcommerce.Infrastructure.UnitOfWork;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
// Database
builder.Services.AddDbContext<FashionEcommerceDbContext>(options =>
    options.UseNpgsql(builder.Configuration.GetConnectionString("DefaultConnection")));

// Repositories
builder.Services.AddScoped<IProductRepository, ProductRepository>();
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();
builder.Services.AddScoped<IBrandRepository, BrandRepository>();
builder.Services.AddScoped<ICartRepository, CartRepository>();
builder.Services.AddScoped<IOrderRepository, OrderRepository>();
builder.Services.AddScoped<IUserRepository, UserRepository>();

// Unit of Work
builder.Services.AddScoped<IUnitOfWork, UnitOfWork>();

// Services
builder.Services.AddScoped<IEmailService, SmtpEmailService>();
builder.Services.AddScoped<ITokenService, TokenService>();

// MediatR
builder.Services.AddMediatR(cfg => cfg.RegisterServicesFromAssembly(typeof(FashionEcommerce.Application.AssemblyReference).Assembly));

// AutoMapper
builder.Services.AddAutoMapper(typeof(ProductMappingProfile).Assembly);

// Controllers
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        // Enum'ları string olarak serialize et
        options.JsonSerializerOptions.Converters.Add(new System.Text.Json.Serialization.JsonStringEnumConverter());
    });

// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

// JWT Authentication
var jwtKey = builder.Configuration["Jwt:SecretKey"] ?? "BerkAI-Super-Secret-Key-2025-Fashion-Ecommerce-Platform";
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"] ?? "BerkAI",
            ValidAudience = builder.Configuration["Jwt:Audience"] ?? "BerkAI-Users",
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        };
    });

// CORS - Frontend için
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowFrontend", policy =>
    {
        policy.WithOrigins("http://localhost:3000", "http://localhost:5173") // React/Vite
              .AllowAnyHeader()
              .AllowAnyMethod()
              .AllowCredentials();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

app.UseCors("AllowFrontend");

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();

app.Run();
