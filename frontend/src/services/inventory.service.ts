import api from './api';
import { InventoryMovement, PaginatedResponse, ApiResponse } from '../types';

export interface CreateMovementPayload {
  productId: number;
  type: 'entry' | 'return' | 'adjustment';
  quantity: number;
  reason?: string;
}

export interface MovementFilters {
  productId?: number;
  type?: string;
  from?: string;
  to?: string;
  page?: number;
  limit?: number;
}

export const inventoryService = {
  async getMovements(params?: MovementFilters): Promise<PaginatedResponse<InventoryMovement>> {
    const { data } = await api.get<PaginatedResponse<InventoryMovement>>(
      '/inventory/movements',
      { params }
    );
    return data;
  },

  async createMovement(payload: CreateMovementPayload): Promise<InventoryMovement> {
    const { data } = await api.post<ApiResponse<InventoryMovement>>(
      '/inventory/movements',
      payload
    );
    return data.data;
  },
};
