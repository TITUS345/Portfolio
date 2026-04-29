export type Role = 'USER' | 'ADMIN';

export interface User {
  id: string;
  email: string;
  name?: string | null;
  role: Role;
  emailVerified: boolean;
  createdAt: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string | null;
  projectUrl?: string | null;
  githubUrl?: string | null;
  techStack: string[];
  featured: boolean;
  createdAt: string;
}

export interface Tool {
  id: string;
  name: string;
  category: string;
  iconName: string;
}

export interface Contact {
  id: string;
  label: string;
  value: string;
  href: string;
  type: string;
  iconName: string;
}

export interface LandingSection {
  id: string;
  title: string;
  subtitle?: string | null;
  content: string;
  buttonText?: string | null;
  buttonUrl?: string | null;
  imageUrl?: string | null;
  order: number;
  createdAt: string;
}

export interface StatsPoint {
  date: string;
  count: number;
}

export interface DashboardStats {
  totalUsers: number;
  totalSignups: number;
  signupChart: StatsPoint[];
}

export interface AuthSession {
  id: string;
  email: string;
  role: Role;
  name?: string | null;
}
