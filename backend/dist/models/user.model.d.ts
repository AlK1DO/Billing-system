/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 *           enum: [admin, seller]
 *         companyId:
 *           type: string
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 */
export type UserRole = 'admin' | 'seller';
export interface User {
    id: string;
    name: string;
    email: string;
    passwordHash: string;
    role: UserRole;
    companyId: string;
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}
export type UserPublic = Omit<User, 'passwordHash'>;
//# sourceMappingURL=user.model.d.ts.map