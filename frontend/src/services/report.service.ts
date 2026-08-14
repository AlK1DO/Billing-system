import api from './api';
import {
  ApiResponse,
  SalesReportData,
  InventoryReportData,
  CustomerReportData,
} from '../types';

export const reportService = {
  async getSalesReport(params?: { from?: string; to?: string }): Promise<SalesReportData> {
    const { data } = await api.get<ApiResponse<SalesReportData>>('/reports/sales', { params });
    return data.data;
  },

  async getInventoryReport(): Promise<InventoryReportData> {
    const { data } = await api.get<ApiResponse<InventoryReportData>>('/reports/inventory');
    return data.data;
  },

  async getCustomerReport(): Promise<CustomerReportData> {
    const { data } = await api.get<ApiResponse<CustomerReportData>>('/reports/customers');
    return data.data;
  },
};
