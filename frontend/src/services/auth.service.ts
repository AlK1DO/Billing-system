import api from './api';
import { AuthResponse, User } from '../types';

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/login',
      { email, password }
    );
    return data.data;
  },

  async register(payload: {
    name: string;
    companyName: string;
    email: string;
    password: string;
    confirmPassword: string;
  }): Promise<AuthResponse> {
    const { data } = await api.post<{ success: boolean; data: AuthResponse }>(
      '/auth/register',
      payload
    );
    return data.data;
  },

  async me(): Promise<User> {
    const { data } = await api.get<{ success: boolean; data: User }>('/auth/me');
    return data.data;
  },
};
