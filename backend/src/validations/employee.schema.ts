import { z } from 'zod';
import { EmployeeStatus } from '@prisma/client';

export const createEmployeeSchema = z.object({
  name: z
    .string({ required_error: 'Full name is required' })
    .min(2, 'Name must be at least 2 characters')
    .max(100, 'Name cannot exceed 100 characters')
    .trim(),
  email: z
    .string({ required_error: 'Email address is required' })
    .email('Please enter a valid email address')
    .max(255, 'Email cannot exceed 255 characters')
    .trim()
    .toLowerCase(),
  role: z
    .string({ required_error: 'Role / Job title is required' })
    .min(2, 'Role must be at least 2 characters')
    .max(100, 'Role cannot exceed 100 characters')
    .trim(),
  department: z
    .string()
    .max(100, 'Department cannot exceed 100 characters')
    .trim()
    .optional()
    .default('Engineering'),
  status: z
    .nativeEnum(EmployeeStatus, {
      errorMap: () => ({ message: 'Status must be ACTIVE, ON_LEAVE, or TERMINATED' }),
    })
    .optional()
    .default(EmployeeStatus.ACTIVE),
  avatarUrl: z
    .string()
    .url('Avatar must be a valid URL')
    .max(500)
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Phone cannot exceed 20 characters')
    .optional()
    .or(z.literal('')),
});

export const updateEmployeeSchema = createEmployeeSchema.partial();

export const employeeIdParamSchema = z.object({
  id: z
    .string()
    .regex(/^\d+$/, 'Employee ID must be a numeric integer')
    .transform(Number),
});
