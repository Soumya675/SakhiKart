import { APP_CONFIG } from '@/src/lib/api/config';
import { orderRepository } from '@/src/lib/api/order.repository';
import { ApiResponse } from '@/src/types/common';
import { CheckoutInput, Order, OrderStatus } from '@/src/types/order';

function wrap<T>(data: T, message?: string): ApiResponse<T> {
  return {
    data,
    source: APP_CONFIG.dataMode,
    timestamp: new Date().toISOString(),
    message,
  };
}

export const OrdersService = {
  async listOrders(customerId?: string): Promise<ApiResponse<Order[]>> {
    const orders = await orderRepository.listOrders(customerId);
    return wrap(orders);
  },

  async getOrderByNumber(orderNumber: string): Promise<ApiResponse<Order | null>> {
    const order = await orderRepository.getOrderByNumber(orderNumber);
    return wrap(order);
  },

  async createOrder(input: CheckoutInput): Promise<ApiResponse<Order>> {
    const order = await orderRepository.createOrder(input);
    return wrap(order, `Order ${order.orderNumber} placed successfully`);
  },

  async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<ApiResponse<Order>> {
    const updated = await orderRepository.updateOrderStatus(orderId, status);
    return wrap(updated, `Order status updated to ${status}`);
  },
};
