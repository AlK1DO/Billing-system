import { Request, Response, NextFunction } from 'express';
import * as inventoryService from '../services/inventory.service';

export async function getInventory(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await inventoryService.getLowStockProducts(req.user!.companyId);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
}

export async function getMovements(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await inventoryService.getMovements(req.user!.companyId, req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function createMovement(req: Request, res: Response, next: NextFunction) {
  try {
    const movement = await inventoryService.createMovement(req.body, req.user!);
    res.status(201).json({ success: true, data: movement });
  } catch (error) {
    next(error);
  }
}
