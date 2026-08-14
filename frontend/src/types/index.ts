export type UserRole = 'admin' | 'seller';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  companyId: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface Company {
  id: number;
  name: string;
  ruc?: string | null;
  address?: string | null;
  phone?: string | null;
  email?: string | null;
  logoUrl?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface Category {
  id: number;
  name: string;
  createdAt?: string;
  _count?: {
    products: number;
  };
}

export type ProductStatus = 'active' | 'inactive';

export interface Product {
  id: number;
  name: string;
  sku: string;
  description?: string | null;
  categoryId?: number | null;
  category?: {
    id: number;
    name: string;
  } | null;
  price: number;
  cost?: number | null;
  stock: number;
  minStock: number;
  imageUrl?: string | null;
  status: ProductStatus;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export type DocumentType = 'DNI' | 'RUC' | 'CE' | 'PASSPORT';

export interface Customer {
  id: number;
  name: string;
  documentType: DocumentType;
  documentNumber: string;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  totalPurchased: number;
  lastPurchaseAt?: string | null;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export type SaleStatus = 'pending' | 'completed' | 'cancelled';

export interface SaleItem {
  id?: number;
  productId: number;
  productName: string;
  productSku: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface Sale {
  id: number;
  customerId: number;
  customerName: string;
  customerDocument: string;
  items: SaleItem[];
  subtotal: number;
  igv: number;
  total: number;
  status: SaleStatus;
  sellerId: number;
  sellerName: string;
  receiptNumber: string;
  notes?: string | null;
  companyId: number;
  createdAt: string;
  updatedAt: string;
}

export type MovementType = 'entry' | 'sale' | 'return' | 'adjustment';

export interface InventoryMovement {
  id: number;
  productId: number;
  productName: string;
  productSku: string;
  type: MovementType;
  quantity: number;
  previousStock: number;
  currentStock: number;
  reason?: string | null;
  saleId?: number | null;
  userId: number;
  userName: string;
  companyId: number;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
}

export interface SalesReportData {
  summary: {
    totalSales: number;
    totalRevenue: number;
    averageTicket: number;
  };
  byDay: Array<{
    date: string;
    total: number;
    count: number;
  }>;
  bySeller: Array<{
    name: string;
    total: number;
    count: number;
  }>;
  topProducts: Array<{
    id: number;
    name: string;
    quantity: number;
    total: number;
  }>;
}

export interface InventoryReportData {
  summary: {
    totalProducts: number;
    activeProducts: number;
    totalValue: number;
    totalCostValue: number;
  };
  lowStock: Product[];
  outOfStock: Product[];
  byCategory: Array<{
    category: string;
    categoryId: number | null;
    count: number;
    totalValue: number;
  }>;
}

export interface CustomerReportData {
  summary: {
    total: number;
    newThisMonth: number;
  };
  topCustomers: Array<{
    id: number;
    name: string;
    documentNumber: string;
    totalPurchased: number;
    lastPurchaseAt: string | null;
  }>;
}
