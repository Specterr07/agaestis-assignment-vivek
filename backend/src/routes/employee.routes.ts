import { Router } from 'express';
import { EmployeeController } from '../controllers/employee.controller.js';
import { validateBody, validateParams } from '../middlewares/validate.middleware.js';
import {
  createEmployeeSchema,
  updateEmployeeSchema,
  employeeIdParamSchema,
} from '../validations/employee.schema.js';

const router = Router();

// GET /api/v1/employees - List all / filter
router.get('/', EmployeeController.getEmployees);

// GET /api/v1/employees/:id - Get single employee
router.get('/:id', validateParams(employeeIdParamSchema), EmployeeController.getEmployeeById);

// POST /api/v1/employees - Create employee
router.post('/', validateBody(createEmployeeSchema), EmployeeController.createEmployee);

// PUT /api/v1/employees/:id - Update employee
router.put(
  '/:id',
  validateParams(employeeIdParamSchema),
  validateBody(updateEmployeeSchema),
  EmployeeController.updateEmployee
);

// DELETE /api/v1/employees/:id - Delete employee
router.delete('/:id', validateParams(employeeIdParamSchema), EmployeeController.deleteEmployee);

export default router;
