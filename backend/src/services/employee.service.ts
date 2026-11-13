import prisma from '../config/db.js';
import { CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilterQuery } from '../types/employee.types.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { Prisma } from '@prisma/client';

export class EmployeeService {
  /**
   * Fetch all employees with optional search, role, department, and pagination filters
   */
  static async getEmployees(filter: EmployeeFilterQuery) {
    const { search, role, department, status, page, limit } = filter;

    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      ...(role && { role: { equals: role } }),
      ...(department && { department: { equals: department } }),
      ...(status && { status: { equals: status } }),
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
          { role: { contains: search, mode: 'insensitive' } },
          { department: { contains: search, mode: 'insensitive' } },
        ],
      }),
    };

    // If pagination parameters are supplied
    if (page || limit) {
      const pageNum = Math.max(1, parseInt(page || '1', 10));
      const pageSize = Math.max(1, Math.min(100, parseInt(limit || '10', 10)));
      const skip = (pageNum - 1) * pageSize;

      const [items, total] = await Promise.all([
        prisma.employee.findMany({
          where,
          orderBy: { createdAt: 'desc' },
          skip,
          take: pageSize,
        }),
        prisma.employee.count({ where }),
      ]);

      return {
        items,
        pagination: {
          total,
          page: pageNum,
          limit: pageSize,
          totalPages: Math.ceil(total / pageSize),
        },
      };
    }

    // Default: Return all records ordered by newest first
    return await prisma.employee.findMany({
      where,
      orderBy: { createdAt: 'desc' },
    });
  }

  /**
   * Fetch a single employee by primary key ID
   */
  static async getEmployeeById(id: number) {
    const employee = await prisma.employee.findFirst({
      where: { id, deletedAt: null },
    });

    if (!employee) {
      throw new AppError(`Employee with ID ${id} not found`, 404, 'NOT_FOUND');
    }

    return employee;
  }

  /**
   * Create a new employee
   */
  static async createEmployee(dto: CreateEmployeeDto) {
    // Check if email already exists
    const existing = await prisma.employee.findUnique({
      where: { email: dto.email.toLowerCase() },
    });

    if (existing) {
      throw new AppError(
        `An employee with email ${dto.email} already exists`,
        409,
        'DUPLICATE_ENTRY'
      );
    }

    return await prisma.employee.create({
      data: {
        name: dto.name.trim(),
        email: dto.email.toLowerCase().trim(),
        role: dto.role.trim(),
        department: dto.department?.trim() || 'Engineering',
        status: dto.status || 'ACTIVE',
        avatarUrl: dto.avatarUrl?.trim() || null,
        phone: dto.phone?.trim() || null,
      },
    });
  }

  /**
   * Update an existing employee
   */
  static async updateEmployee(id: number, dto: UpdateEmployeeDto) {
    // Verify existence
    await this.getEmployeeById(id);

    // If email is changing, verify no other employee has it
    if (dto.email) {
      const emailConflict = await prisma.employee.findFirst({
        where: {
          email: dto.email.toLowerCase().trim(),
          NOT: { id },
        },
      });

      if (emailConflict) {
        throw new AppError(
          `Another employee with email ${dto.email} already exists`,
          409,
          'DUPLICATE_ENTRY'
        );
      }
    }

    return await prisma.employee.update({
      where: { id },
      data: {
        ...(dto.name && { name: dto.name.trim() }),
        ...(dto.email && { email: dto.email.toLowerCase().trim() }),
        ...(dto.role && { role: dto.role.trim() }),
        ...(dto.department && { department: dto.department.trim() }),
        ...(dto.status && { status: dto.status }),
        ...(dto.avatarUrl !== undefined && { avatarUrl: dto.avatarUrl?.trim() || null }),
        ...(dto.phone !== undefined && { phone: dto.phone?.trim() || null }),
      },
    });
  }

  /**
   * Delete an employee (standard delete / soft delete)
   */
  static async deleteEmployee(id: number) {
    await this.getEmployeeById(id);

    // Hard delete to keep table clean for assignment, or soft delete
    return await prisma.employee.delete({
      where: { id },
    });
  }
}
