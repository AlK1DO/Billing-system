import { Request, Response, NextFunction } from 'express';
import * as customerService from '../services/customer.service';

export async function getCustomers(req: Request, res: Response, next: NextFunction) {
  try {
    const result = await customerService.getCustomers(req.user!.companyId, req.query as any);
    res.json({ success: true, ...result });
  } catch (error) {
    next(error);
  }
}

export async function getCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = await customerService.getCustomerById(Number(req.params.id), req.user!.companyId);
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
}

export async function createCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = await customerService.createCustomer({
      ...req.body,
      companyId: req.user!.companyId,
    });
    res.status(201).json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
}

export async function updateCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    const customer = await customerService.updateCustomer(
      Number(req.params.id),
      req.user!.companyId,
      req.body
    );
    res.json({ success: true, data: customer });
  } catch (error) {
    next(error);
  }
}

export async function deleteCustomer(req: Request, res: Response, next: NextFunction) {
  try {
    await customerService.deleteCustomer(Number(req.params.id), req.user!.companyId);
    res.json({ success: true, message: 'Cliente eliminado correctamente' });
  } catch (error) {
    next(error);
  }
}
