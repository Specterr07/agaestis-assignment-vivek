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
  {
    name: 'Liam Vance',
    email: 'liam.vance@agaetis.com',
    role: 'Backend Systems Engineer',
    department: 'Engineering',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
    phone: '+1 (555) 111-2233',
  },
  {
    name: 'Chloe Bennett',
    email: 'chloe.bennett@agaetis.com',
    role: 'Lead Interaction Designer',
    department: 'Design',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
    phone: '+1 (555) 222-3344',
  },
  {
    name: 'Nathaniel Drake',
    email: 'nathan.drake@agaetis.com',
    role: 'Technical Product Specialist',
    department: 'Product',
    status: EmployeeStatus.ON_LEAVE,
    avatarUrl: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
    phone: '+1 (555) 333-4455',
  },
  {
    name: 'Zoe Saldana',
    email: 'zoe.saldana@agaetis.com',
    role: 'HR People Partner',
    department: 'HR',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
    phone: '+1 (555) 444-5566',
  },
  {
    name: 'Vikram Seth',
    email: 'vikram.seth@agaetis.com',
    role: 'Data Platform Engineer',
    department: 'Engineering',
    status: EmployeeStatus.TERMINATED,
    avatarUrl: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
    phone: '+1 (555) 555-6677',
  },
  {
    name: 'Maya Lin',
    email: 'maya.lin@agaetis.com',
    role: 'UX Researcher',
    department: 'Design',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
    phone: '+1 (555) 666-7788',
  },
  {
    name: 'Oliver Queen',
    email: 'oliver.queen@agaetis.com',
    role: 'Security & Compliance Officer',
    department: 'Engineering',
    status: EmployeeStatus.ACTIVE,
    avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
    phone: '+1 (555) 777-8899',
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
