// src/core/models/order.model.ts

import { z } from 'zod';

export const orderStatus = z.enum([
  'pending',
  'accepted',
  'canceled',
  'processing',
  'delivering',
  'delivered',
]);

export type OrderStatusType = z.infer<typeof orderStatus>;

export const orderFiltersSchema = z.object({
  orderId: z.string().optional(),
  customerName: z.string().optional(),
  status: z.array(orderStatus).optional(),
});

export type GetOrdersParams = z.infer<typeof orderFiltersSchema> & {
  page?: number;
};

export interface Order {
  orderId: string;
  createdAt: string;
  status: OrderStatusType;
  customerName: string;
  total: number;
  customer: {
    name: string;
    phone?: string | null;
    email: string;
  };
  orderItems: {
    id: string;
    product: {
      name: string;
      description?: string | null;
      notes?: string | null;
    };
    quantity: number;
    priceInCents: number;
  }[];
  totalInCents: number;
  deliveryMan?: {
    id: string;
    name: string;
  } | null;
}

export interface PaginatedOrders {
  results: Order[];
  meta: {
    pageIndex: number;
    perPage: number;
    totalCount: number;
  };
}
