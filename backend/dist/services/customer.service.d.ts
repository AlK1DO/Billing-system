import { Customer, CreateCustomerDto, UpdateCustomerDto } from '../models/customer.model';
interface CustomerQuery {
    search?: string;
    page: number;
    limit: number;
}
export declare function getCustomers(companyId: string, query: CustomerQuery): Promise<import("../utils/pagination").PaginatedResponse<Customer>>;
export declare function getCustomerById(id: string, companyId: string): Promise<Customer>;
export declare function createCustomer(data: CreateCustomerDto): Promise<{
    name: string;
    email?: string | undefined;
    companyId: string;
    createdAt: Date;
    updatedAt: Date;
    totalPurchased: number;
    lastPurchaseAt?: Date | undefined;
    documentType: import("../models/customer.model").DocumentType;
    documentNumber: string;
    phone?: string | undefined;
    address?: string | undefined;
    id: string;
}>;
export declare function updateCustomer(id: string, companyId: string, data: UpdateCustomerDto): Promise<Customer>;
export declare function deleteCustomer(id: string, companyId: string): Promise<void>;
export {};
//# sourceMappingURL=customer.service.d.ts.map