import { Request, Response, NextFunction } from 'express';
import { EmployeeService } from '../services/employee.service.js';

export class EmployeeController {
  /**
   * GET /api/v1/employees
   */
  static async getEmployees(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await EmployeeService.getEmployees(req.query as any);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/employees/stats
   */
  static async getStats(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await EmployeeService.getStats();
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * GET /api/v1/employees/:id
   */
  static async getEmployeeById(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await EmployeeService.getEmployeeById(id);
      res.status(200).json({
        success: true,
        data,
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * POST /api/v1/employees
   */
  static async createEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const data = await EmployeeService.createEmployee(req.body);
      res.status(201).json({
        success: true,
        data,
        message: 'Employee created successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * PUT /api/v1/employees/:id
   */
  static async updateEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      const data = await EmployeeService.updateEmployee(id, req.body);
      res.status(200).json({
        success: true,
        data,
        message: 'Employee updated successfully',
      });
    } catch (error) {
      next(error);
    }
  }

  /**
   * DELETE /api/v1/employees/:id
   */
  static async deleteEmployee(req: Request, res: Response, next: NextFunction): Promise<void> {
    try {
      const id = parseInt(req.params.id, 10);
      await EmployeeService.deleteEmployee(id);
      res.status(200).json({
        success: true,
        message: 'Employee deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  }
}
