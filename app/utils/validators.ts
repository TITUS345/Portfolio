import { z } from 'zod';

export const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  name: z.string().min(2).max(40).optional(),
  adminSecret: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

export const projectSchema = z.object({
  title: z.string().min(4),
  description: z.string().min(10),
  imageUrl: z.string().url().nullable().optional(),
  projectUrl: z.string().url().nullable().optional(),
  githubUrl: z.string().url().nullable().optional(),
  techStack: z.array(z.string()).min(1),
  featured: z.boolean().optional(),
});

export const toolSchema = z.object({
  name: z.string().min(2),
  category: z.string().min(2),
  iconName: z.string().min(2),
});

export const landingSchema = z.object({
  title: z.string().min(4),
  subtitle: z.string().max(120).nullable().optional(),
  content: z.string().min(10),
  buttonText: z.string().max(30).nullable().optional(),
  buttonUrl: z.string().url().nullable().optional(),
  imageUrl: z.string().url().nullable().optional(),
  order: z.number().int().default(0),
});

export const contactSchema = z.object({
  label: z.string().min(2),
  value: z.string().min(2),
  href: z.string().default(''),
  type: z.string().default(''),
  iconName: z.string().default(''),
});
