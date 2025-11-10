using AutoMapper;
using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Orders;
using FashionEcommerce.Domain.Interfaces;
using MediatR;

namespace FashionEcommerce.Application.Features.Orders.Queries.GetOrderById;

public class GetOrderByIdQueryHandler : IRequestHandler<GetOrderByIdQuery, Result<OrderDto>>
{
    private readonly IUnitOfWork _unitOfWork;
    private readonly IMapper _mapper;

    public GetOrderByIdQueryHandler(IUnitOfWork unitOfWork, IMapper mapper)
    {
        _unitOfWork = unitOfWork;
        _mapper = mapper;
    }

    public async Task<Result<OrderDto>> Handle(GetOrderByIdQuery request, CancellationToken cancellationToken)
    {
        var order = await _unitOfWork.Orders.GetByIdAsync(request.Id);
        if (order == null)
        {
            return Result<OrderDto>.Failure("Order not found");
        }

        var orderDto = _mapper.Map<OrderDto>(order);
        return Result<OrderDto>.Success(orderDto);
    }
}
