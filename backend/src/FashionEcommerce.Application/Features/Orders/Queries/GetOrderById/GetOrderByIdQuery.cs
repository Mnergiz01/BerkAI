using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Orders;
using MediatR;

namespace FashionEcommerce.Application.Features.Orders.Queries.GetOrderById;

public record GetOrderByIdQuery(Guid Id) : IRequest<Result<OrderDto>>;
