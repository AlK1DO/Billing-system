import { Request, Response, NextFunction } from 'express';
import * as productService from '../services/product.service';

export async function getProducts(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await productService.getProducts(req.user!.companyId, req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.getProductById(Number(req.params.id), req.user!.companyId);
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function createProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.createProduct({
      ...req.body,
      companyId: req.user!.companyId,
    });
    res.status(201).json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function updateProduct(req: Request, res: Response, next: NextFunction) {
  try {
    const product = await productService.updateProduct(
      Number(req.params.id),
      req.user!.companyId,
      req.body
    );
    res.json({ success: true, data: product });
  } catch (error) {
    next(error);
  }
}

export async function deleteProduct(req: Request, res: Response, next: NextFunction) {
  try {
    await productService.deleteProduct(Number(req.params.id), req.user!.companyId);
    res.json({ success: true, message: 'Producto eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}
