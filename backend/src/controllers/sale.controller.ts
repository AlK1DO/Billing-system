import { Request, Response, NextFunction } from 'express';
import * as saleService from '../services/sale.service';

export async function getSales(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await saleService.getSales(req.user!.companyId, req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getSale(req: Request, res: Response, next: NextFunction) {
  try {
    const sale = await saleService.getSaleById(Number(req.params.id), req.user!.companyId);
    res.json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}

export async function createSale(req: Request, res: Response, next: NextFunction) {
  try {
    const sale = await saleService.createSale(req.body, req.user!);
    res.status(201).json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}

export async function cancelSale(req: Request, res: Response, next: NextFunction) {
  try {
    const sale = await saleService.cancelSale(
      Number(req.params.id),
      req.user!.companyId,
      req.user!.userId,
      req.user!.email
    );
    res.json({ success: true, data: sale });
  } catch (error) {
    next(error);
  }
}
