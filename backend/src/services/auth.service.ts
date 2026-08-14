import { prisma } from '../lib/prisma';
import { AppError } from '../utils/AppError';
import { signToken } from '../utils/jwt';
import { hashPassword, comparePassword } from '../utils/bcrypt';
import { LoginInput, RegisterInput } from '../validators/auth.validator';

function toPublicUser(user: {
  id: number;
  name: string;
  email: string;
  role: string;
  companyId: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}) {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
    isActive: user.isActive,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (!user) {
    throw new AppError('Credenciales inválidas', 401);
  }

  if (!user.isActive) {
    throw new AppError('Cuenta desactivada. Contacta al administrador', 403);
  }

  const isValid = await comparePassword(input.password, user.passwordHash);
  if (!isValid) {
    throw new AppError('Credenciales inválidas', 401);
  }

  const token = signToken({
    userId: user.id,
    email: user.email,
    role: user.role,
    companyId: user.companyId,
  });

  return { token, user: toPublicUser(user) };
}

export async function registerUser(input: RegisterInput) {
  // Verificar si el correo ya existe
  const existing = await prisma.user.findUnique({
    where: { email: input.email },
  });

  if (existing) {
    throw new AppError('El correo ya está registrado', 409);
  }

  const passwordHash = await hashPassword(input.password);

  // Crear empresa y usuario admin en una sola transacción
  const result = await prisma.$transaction(async (tx) => {
    const company = await tx.company.create({
      data: { name: input.companyName },
    });

    const user = await tx.user.create({
      data: {
        name: input.name,
        email: input.email,
        passwordHash,
        role: 'admin',
        companyId: company.id,
      },
    });

    return { company, user };
  });

  const token = signToken({
    userId: result.user.id,
    email: result.user.email,
    role: result.user.role,
    companyId: result.user.companyId,
  });

  return { token, user: toPublicUser(result.user) };
}

export async function getUserById(userId: number, companyId: number) {
  const user = await prisma.user.findUnique({
    where: { id: userId },
  });

  if (!user) {
    throw new AppError('Usuario no encontrado', 404);
  }

  if (user.companyId !== companyId) {
    throw new AppError('No autorizado', 403);
  }

  return toPublicUser(user);
}
