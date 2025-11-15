import { apiClient } from '@/core/api/apiClient';
import { GetOrdersParams, Order, PaginatedOrders } from '@/core/models';

// Antes 'get-orders.ts'
export const getOrders = async (params: GetOrdersParams): Promise<PaginatedOrders> => {
  const response = await apiClient.get('/orders', { params });
  return response.data;
};

// Antes 'get-order-details.ts'
export const getOrderDetails = async (orderId: string): Promise<Order> => {
  const response = await apiClient.get(`/orders/${orderId}`);
  return response.data;
};

// Antes 'approve-order.ts'
export const approveOrder = async (orderId: string): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/approve`);
};

// Antes 'cancel-order.ts'
export const cancelOrder = async (orderId: string): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/cancel`);
};

// Antes 'dispatch-order.ts'
export const dispatchOrder = async (orderId: string): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/dispatch`);
};

// Antes 'delivery-order.ts'
export const deliverOrder = async (orderId: string): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/deliver`);
};

export const finishOrder = async (orderId: string): Promise<void> => {
  await apiClient.patch(`/orders/${orderId}/finish`);
};
