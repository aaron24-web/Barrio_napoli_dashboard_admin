// src/core/services/metrics.service.ts
import { apiClient } from '@/core/api/apiClient';
import {
  DayOrdersAmount,
  GetDailyRevenueInPeriodParams,
  GetDailyRevenueInPeriodResponse,
  GetPopularProductsParams,
  GetPopularProductsResponse,
  GetSalesTransactionsParams,
  GetSalesTransactionsResponse,
  MonthCanceledOrdersAmount,
  MonthOrdersAmount,
  MonthRevenue,
} from '@/core/models/metrics.model';

export const getDayOrdersAmount = async (): Promise<DayOrdersAmount> => {
  const response = await apiClient.get('/metrics/day-orders-amount');
  return response.data;
};

export const getMonthOrdersAmount = async (): Promise<MonthOrdersAmount> => {
  const response = await apiClient.get('/metrics/month-orders-amount');
  return response.data;
};

export const getMonthCanceledOrdersAmount = async (): Promise<MonthCanceledOrdersAmount> => {
  const response = await apiClient.get('/metrics/month-canceled-orders-amount');
  return response.data;
};

export const getMonthRevenue = async (): Promise<MonthRevenue> => {
  const response = await apiClient.get('/metrics/month-revenue');
  return response.data;
};

export const getPopularProducts = async (params: GetPopularProductsParams): Promise<GetPopularProductsResponse> => {
  const response = await apiClient.get('/metrics/popular-products', { params });
  return response.data;
};

export const getDailyRevenueInPeriod = async (
  params: GetDailyRevenueInPeriodParams,
): Promise<GetDailyRevenueInPeriodResponse> => {
  const response = await apiClient.get('/metrics/daily-receipt-in-period', {
    params,
  });
  return response.data;
};

export const getSalesTransactions = async (
  params: GetSalesTransactionsParams,
): Promise<GetSalesTransactionsResponse> => {
  const response = await apiClient.get('/metrics/sales-transactions', { params });
  return response.data;
};
