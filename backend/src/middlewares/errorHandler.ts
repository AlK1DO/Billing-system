import { Request, Response, NextFunction } from 'express';
import { Prisma } from '@prisma/client';
import { AppError } from '../utils/AppError';

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('❌ Error:', err.message);

  // Error operacional conocido
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    });
    return;
  }

  // Errores de Prisma — constraint único violado
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === 'P2002') {
      const fields = (err.meta?.target as string[])?.join(', ') ?? 'campo';
      res.status(409).json({
        success: false,
        message: `Ya existe un registro con el mismo valor en: ${fields}`,
      });
      return;
    }

    // Registro no encontrado (operación sobre ID inexistente)
    if (err.code === 'P2025') {
      res.status(404).json({
        success: false,
        message: 'Registro no encontrado',
      });
      return;
    }

    // FK violation
    if (err.code === 'P2003') {
      res.status(400).json({
        success: false,
        message: 'Referencia inválida: el registro relacionado no existe',
      });
      return;
    }
  }

  // Error de validación de Prisma (datos fuera de rango, tipos incorrectos)
  if (err instanceof Prisma.PrismaClientValidationError) {
    res.status(400).json({
      success: false,
      message: 'Datos inválidos en la solicitud',
      ...(process.env.NODE_ENV === 'development' && { detail: err.message }),
    });
    return;
  }

  // Error genérico no controlado
  res.status(500).json({
    success: false,
    message: 'Error interno del servidor',
    ...(process.env.NODE_ENV === 'development' && {
      error: err.message,
      stack: err.stack,
    }),
  });
}
