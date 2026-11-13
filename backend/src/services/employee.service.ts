import prisma from '../config/db.js';
import {
  CreateEmployeeDto,
  UpdateEmployeeDto,
  EmployeeFilterQuery,
  PaginatedResult,
} from '../types/employee.types.js';
import { AppError } from '../middlewares/errorHandler.middleware.js';
import { Prisma } from '@prisma/client';

export class EmployeeService {
  /**
   * Fetch employees with server-side pagination, search, date range, department, and sorting
   */
  static async getEmployees(filter: EmployeeFilterQuery): Promise<PaginatedResult<any>> {
    const {
      search,
      role,
      department,
      status,
      page,
      limit,
      sortBy = 'createdAt',
      sortOrder = 'desc',
      statusPriority,
      startDate,
      endDate,
    } = filter;

    const pageNum = Math.max(1, parseInt(page || '1', 10));
    const pageSize = Math.max(1, Math.min(100, parseInt(limit || '10', 10)));
    const skip = (pageNum - 1) * pageSize;

    // Build WHERE clause
    const where: Prisma.EmployeeWhereInput = {
      deletedAt: null,
      ...(role && { role: { equals: role, mode: 'insensitive' } }),
      ...(department && department !== 'ALL' && {
        department: { equals: department, mode: 'insensitive' },
      }),
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

    // Date range filtering (Timezone safe day boundaries)
    if (startDate || endDate) {
      where.createdAt = {};
      if (startDate) {
        const [sYear, sMonth, sDay] = startDate.split('-').map(Number);
        where.createdAt.gte = new Date(sYear, sMonth - 1, sDay, 0, 0, 0, 0);
      }
      if (endDate) {
        const [eYear, eMonth, eDay] = endDate.split('-').map(Number);
        where.createdAt.lte = new Date(eYear, eMonth - 1, eDay, 23, 59, 59, 999);
      }
    }

    // Build ORDER BY clause
    const orderBy: Prisma.EmployeeOrderByWithRelationInput[] = [];

    // 1. Status Priority Sorting
    if (statusPriority === 'ACTIVE') {
      orderBy.push({ status: 'asc' }); // ACTIVE comes first in enum
    } else if (statusPriority === 'TERMINATED') {
      orderBy.push({ status: 'desc' }); // TERMINATED comes first
    }

    // 2. Specific Column Sorting (Name or Joined Date)
    if (sortBy === 'name') {
      orderBy.push({ name: sortOrder === 'desc' ? 'desc' : 'asc' });
    } else if (sortBy === 'createdAt') {
      orderBy.push({ createdAt: sortOrder === 'asc' ? 'asc' : 'desc' });
    }

    // 3. Fallback tie-breaker
    orderBy.push({ createdAt: 'desc' });
    orderBy.push({ id: 'desc' });

    // Execute paginated queries in parallel
    const [items, total] = await Promise.all([
      prisma.employee.findMany({
        where,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.employee.count({ where }),
    ]);

    // Handle edge case where statusPriority is ON_LEAVE
    let finalItems = items;
    if (statusPriority === 'ON_LEAVE') {
      finalItems = [...items].sort((a, b) => {
        if (a.status === 'ON_LEAVE' && b.status !== 'ON_LEAVE') return -1;
        if (a.status !== 'ON_LEAVE' && b.status === 'ON_LEAVE') return 1;
        return 0;
      });
    }

    return {
      items: finalItems,
      pagination: {
        total,
        page: pageNum,
        limit: pageSize,
        totalPages: Math.ceil(total / pageSize) || 1,
      },
    };
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
   * Delete an employee
   */
  static async deleteEmployee(id: number) {
    await this.getEmployeeById(id);

    return await prisma.employee.delete({
      where: { id },
    });
  }
}
