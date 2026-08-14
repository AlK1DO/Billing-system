import api from './api';
import { Sale, ApiResponse, PaginatedResponse } from '../types';

export interface CreateSalePayload {
  customerId: number;
  items: { productId: number; quantity: number }[];
  notes?: string;
}

export interface SaleFilters {
  customerId?: number;
  sellerId?: number;
  status?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const saleService = {
  async getAll(params?: SaleFilters): Promise<PaginatedResponse<Sale>> {
    const { data } = await api.get<PaginatedResponse<Sale>>('/sales', { params });
    return data;
  },

  async getById(id: number): Promise<Sale> {
    const { data } = await api.get<ApiResponse<Sale>>(`/sales/${id}`);
    return data.data;
  },

  async create(payload: CreateSalePayload): Promise<Sale> {
    const { data } = await api.post<ApiResponse<Sale>>('/sales', payload);
    return data.data;
  },

  async cancel(id: number): Promise<Sale> {
    const { data } = await api.patch<ApiResponse<Sale>>(`/sales/${id}/cancel`);
    return data.data;
  },
};
