import api from './api';
import { Category, ApiResponse } from '../types';

export const categoryService = {
  async getAll(): Promise<Category[]> {
    const { data } = await api.get<ApiResponse<Category[]>>('/categories');
    return data.data;
  },

  async getById(id: number): Promise<Category> {
    const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`);
    return data.data;
  },

  async create(name: string): Promise<Category> {
    const { data } = await api.post<ApiResponse<Category>>('/categories', { name });
    return data.data;
  },

  async update(id: number, name: string): Promise<Category> {
    const { data } = await api.put<ApiResponse<Category>>(`/categories/${id}`, { name });
    return data.data;
  },

  async delete(id: number): Promise<void> {
    await api.delete(`/categories/${id}`);
  },
};
