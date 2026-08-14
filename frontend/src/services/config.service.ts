import api from './api';
import { Company, User, ApiResponse } from '../types';

export interface UpdateCompanyPayload {
  name?: string;
  ruc?: string;
  address?: string;
  logoUrl?: string;
  phone?: string;
  email?: string;
}

export interface CreateUserPayload {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'seller';
}

export const configService = {
  async getCompany(): Promise<Company> {
    const { data } = await api.get<ApiResponse<Company>>('/config/company');
    return data.data;
  },

  async updateCompany(payload: UpdateCompanyPayload): Promise<Company> {
    const { data } = await api.put<ApiResponse<Company>>('/config/company', payload);
    return data.data;
  },

  async getUsers(): Promise<User[]> {
    const { data } = await api.get<ApiResponse<User[]>>('/config/users');
    return data.data;
  },

  async createUser(payload: CreateUserPayload): Promise<User> {
    const { data } = await api.post<ApiResponse<User>>('/config/users', payload);
    return data.data;
  },

  async deactivateUser(id: number): Promise<void> {
    await api.patch(`/config/users/${id}/deactivate`);
  },

  async activateUser(id: number): Promise<void> {
    await api.patch(`/config/users/${id}/activate`);
  },
};
