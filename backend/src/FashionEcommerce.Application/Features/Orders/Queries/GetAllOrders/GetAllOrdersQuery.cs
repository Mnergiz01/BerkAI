using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Orders;
using MediatR;

namespace FashionEcommerce.Application.Features.Orders.Queries.GetAllOrders;

public record GetAllOrdersQuery : IRequest<Result<IEnumerable<OrderDto>>>;
