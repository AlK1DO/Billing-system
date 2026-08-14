import { UserPublic } from '../models/user.model';
import { LoginInput, RegisterInput } from '../validators/auth.validator';
export declare function loginUser(input: LoginInput): Promise<{
    token: string;
    user: {
        id: string;
        name: string;
        email: string;
        role: import("../models/user.model").UserRole;
        companyId: string;
        isActive: boolean;
        createdAt: Date;
        updatedAt: Date;
    };
}>;
export declare function registerUser(input: RegisterInput): Promise<{
    token: string;
    user: UserPublic;
}>;
export declare function getUserById(userId: string, companyId: string): Promise<{
    id: string;
    name: string;
    email: string;
    role: import("../models/user.model").UserRole;
    companyId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}>;
//# sourceMappingURL=auth.service.d.ts.map