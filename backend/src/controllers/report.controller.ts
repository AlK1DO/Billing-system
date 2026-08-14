import { Request, Response, NextFunction } from 'express';
import * as reportService from '../services/report.service';

export async function salesReport(req: Request, res: Response, next: NextFunction) {
  try {
    const { from, to } = req.query as { from?: string; to?: string };
    const data = await reportService.getSalesReport(req.user!.companyId, from, to);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function inventoryReport(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.getInventoryReport(req.user!.companyId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}

export async function customerReport(req: Request, res: Response, next: NextFunction) {
  try {
    const data = await reportService.getCustomerReport(req.user!.companyId);
    res.json({ success: true, data });
  } catch (error) {
    next(error);
  }
}
