import { Router } from 'express';
import * as authController from '../controllers/auth.controller';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/authenticate';
import { loginSchema, registerSchema } from '../validators/auth.validator';

const router = Router();

/**
 * @swagger
 * /api/auth/login:
 *   post:
 *     summary: Iniciar sesión
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [email, password]
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: demo@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: DemoPassword123!
 *     responses:
 *       200:
 *         description: Login exitoso con token JWT
 *       401:
 *         description: Credenciales inválidas
 */
router.post('/login', validate(loginSchema), authController.login);

/**
 * @swagger
 * /api/auth/register:
 *   post:
 *     summary: Registrar nueva empresa y usuario administrador
 *     tags: [Auth]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [name, companyName, email, password, confirmPassword]
 *             properties:
 *               name:
 *                 type: string
 *                 minLength: 2
 *                 example: Usuario Demo
 *               companyName:
 *                 type: string
 *                 minLength: 2
 *                 example: Empresa Demo
 *               email:
 *                 type: string
 *                 format: email
 *                 example: demo@ejemplo.com
 *               password:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: DemoPassword123!
 *               confirmPassword:
 *                 type: string
 *                 format: password
 *                 minLength: 6
 *                 example: DemoPassword123!
 *     responses:
 *       201:
 *         description: Empresa y usuario administrador registrados correctamente
 *       400:
 *         description: Datos de registro inválidos
 *       409:
 *         description: El correo ya está registrado
 */
router.post('/register', validate(registerSchema), authController.register);

/**
 * @swagger
 * /api/auth/me:
 *   get:
 *     summary: Obtener usuario autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Usuario autenticado sin información sensible
 *       401:
 *         description: Token inválido o ausente
 */
router.get('/me', authenticate, authController.me);

export default router;
