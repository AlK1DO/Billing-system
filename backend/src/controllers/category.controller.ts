import { Request, Response, NextFunction } from 'express';
import * as categoryService from '../services/category.service';

export async function getCategories(req: Request, res: Response, next: NextFunction) {
  try {
    const categories = await categoryService.getCategories(req.user!.companyId);
    res.json({ success: true, data: categories });
  } catch (error) { next(error); }
}

export async function createCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoryService.createCategory(req.body.name, req.user!.companyId);
    res.status(201).json({ success: true, data: category });
  } catch (error) { next(error); }
}

export async function updateCategory(req: Request, res: Response, next: NextFunction) {
  try {
    const category = await categoryService.updateCategory(
      Number(req.params.id), req.body.name, req.user!.companyId
    );
    res.json({ success: true, data: category });
  } catch (error) { next(error); }
}

export async function deleteCategory(req: Request, res: Response, next: NextFunction) {
  try {
    await categoryService.deleteCategory(Number(req.params.id), req.user!.companyId);
    res.json({ success: true, message: 'Categoría eliminada correctamente' });
  } catch (error) { next(error); }
}
