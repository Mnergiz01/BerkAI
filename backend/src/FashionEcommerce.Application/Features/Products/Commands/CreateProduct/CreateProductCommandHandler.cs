using AutoMapper;
using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Products;
using FashionEcommerce.Domain.Entities;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Products.Commands.CreateProduct;

public class CreateProductCommandHandler : IRequestHandler<CreateProductCommand, Result<ProductDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public CreateProductCommandHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<ProductDto>> Handle(CreateProductCommand request, CancellationToken cancellationToken)
    {
        // Check if SKU already exists
        var existingProduct = await _unitOfWork.Products.FirstOrDefaultAsync(
            p => p.SKU == request.Product.SKU,
            cancellationToken);

        if (existingProduct != null)
        {
            return Result<ProductDto>.Failure("A product with this SKU already exists.");
        }

        // Check if category exists
        var category = await _unitOfWork.Categories.GetByIdAsync(request.Product.CategoryId, cancellationToken);
        if (category == null)
        {
            return Result<ProductDto>.Failure("Category not found.");
        }

        // Check if brand exists (if provided)
        if (request.Product.BrandId.HasValue)
        {
            var brand = await _unitOfWork.Brands.GetByIdAsync(request.Product.BrandId.Value, cancellationToken);
            if (brand == null)
            {
                return Result<ProductDto>.Failure("Brand not found.");
            }
        }

        // Map DTO to entity
        var product = _mapper.Map<Product>(request.Product);

        // Add product
        await _unitOfWork.Products.AddAsync(product, cancellationToken);
        await _unitOfWork.SaveChangesAsync(cancellationToken);

        // Map entity to DTO
        var productDto = _mapper.Map<ProductDto>(product);

        return Result<ProductDto>.Success(productDto, "Product created successfully.");
    }
}
