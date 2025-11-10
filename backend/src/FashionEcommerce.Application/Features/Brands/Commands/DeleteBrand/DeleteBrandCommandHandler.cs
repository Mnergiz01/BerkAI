using FashionEcommerce.Application.Common;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Brands.Commands.DeleteBrand;

public class DeleteBrandCommandHandler : IRequestHandler<DeleteBrandCommand, Result<bool>>
{
    private readonly IUnitOfWork _unitOfWork;

    public DeleteBrandCommandHandler(IUnitOfWork unitOfWork)
    {
        _unitOfWork = unitOfWork;
    }

    public async Task<Result<bool>> Handle(DeleteBrandCommand request, CancellationToken cancellationToken)
    {
        var brand = await _unitOfWork.Brands.GetByIdAsync(request.Id);
        if (brand == null)
        {
            return Result<bool>.Failure("Brand not found");
        }

        await _unitOfWork.Brands.DeleteAsync(brand);
        await _unitOfWork.SaveChangesAsync();

        return Result<bool>.Success(true);
    }
}
