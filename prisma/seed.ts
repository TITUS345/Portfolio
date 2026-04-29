import { loadEnvConfig } from '@next/env';
// Ensure env variables are available before lib/prisma is evaluated
loadEnvConfig(process.cwd());

import prisma from '../lib/prisma';
import { hashPassword } from '../app/utils/auth';

async function main() {
  // Create admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      name: 'Admin User',
      password: hashPassword('password'),
      role: 'ADMIN',
    },
  });

  // Create regular user
  const user = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      name: 'Regular User',
      password: hashPassword('password'),
      role: 'USER',
    },
  });

  // Create projects
  await prisma.project.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      title: 'Portfolio Website',
      description: 'A fullstack portfolio site with API-driven content management.',
      techStack: ['Next.js', 'Prisma', 'PostgreSQL', 'Tailwind'],
      featured: true,
    },
  });

  await prisma.project.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      title: 'E-commerce App',
      description: 'Scalable e-commerce platform with payment integration.',
      techStack: ['React', 'Node.js', 'MongoDB', 'Stripe'],
      featured: true,
    },
  });

  // Create tools
  await prisma.tool.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      name: 'Next.js',
      category: 'Frontend',
      iconName: 'Code',
    },
  });

  await prisma.tool.upsert({
    where: { id: '2' },
    update: {},
    create: {
      id: '2',
      name: 'Prisma',
      category: 'Backend',
      iconName: 'Database',
    },
  });

  // Create landing sections
  await prisma.landingSection.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      title: 'Welcome',
      content: 'Welcome to my portfolio. I build scalable web applications.',
      order: 1,
    },
  });

  // Create contacts
  await prisma.contact.upsert({
    where: { id: '1' },
    update: {},
    create: {
      id: '1',
      label: 'Email',
      value: 'contact@example.com',
      href: 'mailto:contact@example.com',
      type: 'Email',
      iconName: 'Mail',
    },
  });

  console.log('Seeded data');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });