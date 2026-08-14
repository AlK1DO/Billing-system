import { Router, Request, Response, NextFunction } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import { createUserSchema, updateCompanySchema, userParamsSchema } from '../validators/config.validator';
import { prisma } from '../lib/prisma';
import { hashPassword } from '../utils/bcrypt';
import { AppError } from '../utils/AppError';

const router = Router();

router.use(authenticate);

/**
 * @swagger
 * /api/config/company:
 *   get:
 *     summary: Obtener información de la empresa
 *     tags: [Config]
 *   put:
 *     summary: Actualizar información de la empresa (solo admin)
 *     tags: [Config]
 * /api/config/users:
 *   get:
 *     summary: Listar usuarios de la empresa (solo admin)
 *     tags: [Config]
 *   post:
 *     summary: Crear nuevo usuario en la empresa (solo admin)
 *     tags: [Config]
 */

// GET /api/config/company
router.get('/company', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await prisma.company.findUnique({
      where: { id: req.user!.companyId },
    });
    if (!company) {
      res.status(404).json({ success: false, message: 'Empresa no encontrada' });
      return;
    }
    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
});

// PUT /api/config/company
router.put('/company', authorize('admin'), validate(updateCompanySchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const company = await prisma.company.update({
      where: { id: req.user!.companyId },
      data: req.body,
    });
    res.json({ success: true, data: company });
  } catch (error) {
    next(error);
  }
});

// GET /api/config/users (solo admin)
router.get('/users', authorize('admin'), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const users = await prisma.user.findMany({
      where: { companyId: req.user!.companyId },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        companyId: true,
      },
      orderBy: { name: 'asc' },
    });
    res.json({ success: true, data: users });
  } catch (error) {
    next(error);
  }
});

// POST /api/config/users — crear nuevo usuario en la empresa (solo admin)
router.post('/users', authorize('admin'), validate(createUserSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { name, email, password, role } = req.body as {
      name: string;
      email: string;
      password: string;
      role: 'admin' | 'seller';
    };

    const passwordHash = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        passwordHash,
        role,
        companyId: req.user!.companyId,
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        companyId: true,
      },
    });

    res.status(201).json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/config/users/:id/deactivate (solo admin)
router.patch('/users/:id/deactivate', authorize('admin'), validate(userParamsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    if (id === req.user!.userId) {
      throw new AppError('No puedes desactivarte a ti mismo', 400);
    }

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) throw new AppError('Usuario no encontrado', 404);
    if (targetUser.companyId !== req.user!.companyId) throw new AppError('No autorizado', 403);

    await prisma.user.update({ where: { id }, data: { isActive: false } });
    res.json({ success: true, message: 'Usuario desactivado' });
  } catch (error) {
    next(error);
  }
});

// PATCH /api/config/users/:id/activate (solo admin)
router.patch('/users/:id/activate', authorize('admin'), validate(userParamsSchema), async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = Number(req.params.id);

    const targetUser = await prisma.user.findUnique({ where: { id } });
    if (!targetUser) throw new AppError('Usuario no encontrado', 404);
    if (targetUser.companyId !== req.user!.companyId) throw new AppError('No autorizado', 403);

    await prisma.user.update({ where: { id }, data: { isActive: true } });
    res.json({ success: true, message: 'Usuario reactivado' });
  } catch (error) {
    next(error);
  }
});

export default router;
