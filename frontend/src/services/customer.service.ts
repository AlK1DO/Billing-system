import api from './api';
import { Customer, ApiResponse, PaginatedResponse } from '../types';

export interface CustomerFilters {
  search?: string;
  page?: number;
  limit?: number;
}

export type CreateCustomerPayload = Omit<
  Customer,
  'id' | 'companyId' | 'totalPurchased' | 'lastPurchaseAt' | 'createdAt' | 'updatedAt'
>;

export const customerService = {
  async getAll(params?: CustomerFilters): Promise<PaginatedResponse<Customer>> {
    const { data } = await api.get<PaginatedResponse<Customer>>('/customers', { params });
    return data;
  },

  async getById(id: number): Promise<Customer> {
    const { data } = await api.get<ApiResponse<Customer>>(`/customers/${id}`);
    return data.data;
  },

  async create(payload: CreateCustomerPayload): Promise<Customer> {
    const { data } = await api.post<ApiResponse<Customer>>('/customers', payload);
    return data.data;
  },

  async update(id: number, payload: Partial<CreateCustomerPayload>): Promise<Customer> {
    const { data } = await api.put<ApiResponse<Customer>>(`/customers/${id}`, payload);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/customers/${id}`);
  },
};
