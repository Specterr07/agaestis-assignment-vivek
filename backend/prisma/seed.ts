import { PrismaClient, EmployeeStatus } from '@prisma/client';

const prisma = new PrismaClient();

const initialEmployees = [
  {
    name: 'Sarah Connor',
    email: 'sarah.connor@agaetis.com',
    role: 'Lead Cloud Architect',
    department: 'Engineering',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
    phone: '+1 (555) 234-5678',
  },
  {
    name: 'Alex Rivera',
    email: 'alex.rivera@agaetis.com',
    role: 'Senior Full Stack Engineer',
    department: 'Engineering',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
    phone: '+1 (555) 345-6789',
  },
  {
    name: 'Elena Rostova',
    email: 'elena.rostova@agaetis.com',
    role: 'Principal UX/UI Designer',
    department: 'Design',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
    phone: '+1 (555) 456-7890',
  },
  {
    name: 'Marcus Chen',
    email: 'marcus.chen@agaetis.com',
    role: 'Senior Product Manager',
    department: 'Product',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
    phone: '+1 (555) 567-8901',
  },
  {
    name: 'Priya Sharma',
    email: 'priya.sharma@agaetis.com',
    role: 'DevOps & SRE Specialist',
    department: 'Engineering',
    status: EmployeeStatus.ON_LEAVE,
    avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
    phone: '+1 (555) 678-9012',
  },
  {
    name: 'James Wilson',
    email: 'james.wilson@agaetis.com',
    role: 'Head of Talent Acquisition',
    department: 'HR',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
    phone: '+1 (555) 789-0123',
  },
  {
    name: 'Aisha Al-Mansoor',
    email: 'aisha.mansoor@agaetis.com',
    role: 'Brand & Visual Designer',
    department: 'Design',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
    phone: '+1 (555) 890-1234',
  },
  {
    name: 'David Kim',
    email: 'david.kim@agaetis.com',
    role: 'Technical Operations Director',
    department: 'HR',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
    phone: '+1 (555) 901-2345',
  },
];

async function main() {
  console.log('Seeding employees database...');
  for (const emp of initialEmployees) {
    await prisma.employee.upsert({
      where: { email: emp.email },
      update: {},
      create: emp,
    });
  }
  const count = await prisma.employee.count();
  console.log(`Successfully seeded ${count} employee records.`);
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
