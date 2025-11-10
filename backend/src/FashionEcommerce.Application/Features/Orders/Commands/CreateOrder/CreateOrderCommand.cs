using FashionEcommerce.Application.Common;
using FashionEcommerce.Application.DTOs.Orders;
using MediatR;

namespace FashionEcommerce.Application.Features.Orders.Commands.CreateOrder;

public record CreateOrderCommand(CreateOrderDto OrderDto) : IRequest<Result<OrderDto>>;
