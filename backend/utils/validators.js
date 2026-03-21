import { z } from 'zod';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number')
    .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character'),
  role: z.enum(['admin', 'worker']).optional(),
  jobType: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const profileUpdateSchema = z.object({
  name: z.string().min(2).optional(),
  email: z.string().email().optional(),
  jobType: z.string().optional(),
  password: z.string().min(8).optional(),
});

export const projectSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  status: z.enum(['Planned', 'Active', 'Completed', 'On Hold']).optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  members: z.array(z.string()).optional(),
});

export const taskSchema = z.object({
  title: z.string().min(3, 'Title is too short'),
  description: z.string().optional(),
  project: z.string(),
  assignedTo: z.string().optional().nullable(),
  status: z.enum(['To Do', 'In Progress', 'Done', 'Blocked']).optional(),
  priority: z.enum(['Low', 'Medium', 'High', 'Urgent']).optional(),
  dueDate: z.string().optional().nullable(),
  deliverables: z.array(z.string()).optional(),
});
