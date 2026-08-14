import api from './api';
import { Product, ApiResponse, PaginatedResponse } from '../types';

export interface ProductFilters {
  search?: string;
  categoryId?: number;
  status?: 'active' | 'inactive';
  page?: number;
  limit?: number;
}

export interface CreateProductPayload {
  name: string;
  sku: string;
  description?: string;
  categoryId?: number | null;
  price: number;
  cost?: number;
  stock: number;
  minStock?: number;
  imageUrl?: string | null;
  status?: 'active' | 'inactive';
}

export const productService = {
  async getAll(filters: ProductFilters = {}): Promise<PaginatedResponse<Product>> {
    const { data } = await api.get<PaginatedResponse<Product>>('/products', {
      params: filters,
    });
    return data;
  },

  async getById(id: number): Promise<Product> {
    const { data } = await api.get<ApiResponse<Product>>(`/products/${id}`);
    return data.data;
  },

  async create(payload: CreateProductPayload): Promise<Product> {
    const { data } = await api.post<ApiResponse<Product>>('/products', payload);
    return data.data;
  },

  async update(id: number, payload: Partial<CreateProductPayload>): Promise<Product> {
    const { data } = await api.put<ApiResponse<Product>>(`/products/${id}`, payload);
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/products/${id}`);
  },
};
