import { PrismaClient, EmployeeStatus } from '@prisma/client';

const prisma = new PrismaClient();

const firstNames = [
  'Alex', 'Sarah', 'Marcus', 'Elena', 'David', 'Priya', 'James', 'Aisha',
  'Liam', 'Chloe', 'Nathan', 'Zoe', 'Vikram', 'Maya', 'Oliver', 'Emma',
  'Lucas', 'Sophia', 'Benjamin', 'Mia', 'Daniel', 'Isabella', 'Henry', 'Ava',
  'Alexander', 'Amara', 'Gabriel', 'Zara', 'Julian', 'Layla', 'Ethan', 'Tara',
  'Sebastian', 'Clara', 'Noah', 'Leila', 'Leo', 'Fatima', 'Mason', 'Nadia',
  'Jackson', 'Hannah', 'Aiden', 'Grace', 'Logan', 'Ella', 'Elijah', 'Camila'
];

const lastNames = [
  'Vance', 'Connor', 'Chen', 'Rostova', 'Kim', 'Sharma', 'Wilson', 'Al-Mansoor',
  'Bennett', 'Drake', 'Saldana', 'Seth', 'Lin', 'Queen', 'Miller', 'Johnson',
  'Patel', 'Garcia', 'Kowalski', 'Tanaka', 'Morales', 'Dubois', 'Novak', 'Santos',
  'Muller', 'O\'Connor', 'Nakamura', 'Larsson', 'Rossi', 'Fischer', 'Moreau', 'Ivanov',
  'Schneider', 'Gomez', 'Hansen', 'Ali', 'Yamamoto', 'Bauer', 'Costa', 'Sato'
];

const departmentsData = [
  {
    department: 'Engineering',
    roles: [
      'Senior Full Stack Engineer',
      'Lead Cloud Architect',
      'Backend Systems Engineer',
      'Frontend React Developer',
      'DevOps & SRE Specialist',
      'Data Platform Engineer',
      'Security & Compliance Officer',
      'QA Automation Engineer',
      'Mobile iOS/Android Engineer',
      'Machine Learning Engineer'
    ]
  },
  {
    department: 'Design',
    roles: [
      'Principal UX/UI Designer',
      'Brand & Visual Designer',
      'Lead Interaction Designer',
      'UX Researcher',
      'Design System Lead',
      'Product Illustrator & Motion Artist'
    ]
  },
  {
    department: 'Product',
    roles: [
      'Senior Product Manager',
      'Technical Product Specialist',
      'Associate Product Manager',
      'Product Operations Analyst',
      'Growth & Strategy Manager'
    ]
  },
  {
    department: 'HR',
    roles: [
      'Head of Talent Acquisition',
      'HR People Partner',
      'Technical Operations Director',
      'People Operations Specialist',
      'Learning & Culture Lead'
    ]
  }
];

const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150',
  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150',
  'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150',
  'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150',
  'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150',
  'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150',
  'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150',
  'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150',
  'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150',
  'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?w=150',
  'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?w=150',
  'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150',
  'https://images.unsplash.com/photo-1517849845537-4d257902454a?w=150',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150',
  'https://images.unsplash.com/photo-1586297135537-94bc9ba060aa?w=150',
  'https://images.unsplash.com/photo-1548142813-c348350df52b?w=150',
  'https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150',
];

function getRandomItem<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function getRandomDateBetween(startYear: number, endYear: number): Date {
  const start = new Date(startYear, 0, 1).getTime();
  const end = new Date(endYear, 10, 1).getTime();
  return new Date(start + Math.random() * (end - start));
}

async function main() {
  console.log('Resetting and generating 200 employee records...');

  // Clear existing records to ensure clean 200 records
  await prisma.employee.deleteMany({});

  const employeesToInsert = [];
  const generatedEmails = new Set<string>();

  // Targeted status distribution: 80% ACTIVE, 14% ON_LEAVE, 6% TERMINATED
  const statuses: EmployeeStatus[] = [
    EmployeeStatus.ACTIVE,
    EmployeeStatus.ACTIVE,
    EmployeeStatus.ACTIVE,
    EmployeeStatus.ACTIVE,
    EmployeeStatus.ACTIVE,
    EmployeeStatus.ACTIVE,
    EmployeeStatus.ACTIVE,
    EmployeeStatus.ACTIVE,
    EmployeeStatus.ON_LEAVE,
    EmployeeStatus.TERMINATED,
  ];

  for (let i = 1; i <= 200; i++) {
    const firstName = getRandomItem(firstNames);
    const lastName = getRandomItem(lastNames);
    const fullName = `${firstName} ${lastName}`;

    let email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}@agaetis.com`;
    let count = 1;
    while (generatedEmails.has(email)) {
      count++;
      email = `${firstName.toLowerCase()}.${lastName.toLowerCase().replace(/[^a-z]/g, '')}${count}@agaetis.com`;
    }
    generatedEmails.add(email);

    const deptGroup = getRandomItem(departmentsData);
    const department = deptGroup.department;
    const role = getRandomItem(deptGroup.roles);
    const status = getRandomItem(statuses);
    const avatarUrl = Math.random() > 0.15 ? getRandomItem(avatars) : null;
    const phone = `+1 (555) ${Math.floor(100 + Math.random() * 900)}-${Math.floor(1000 + Math.random() * 9000)}`;
    const createdAt = getRandomDateBetween(2024, 2026);

    employeesToInsert.push({
      name: fullName,
      email,
      role,
      department,
      status,
      avatarUrl,
      phone,
      createdAt,
      updatedAt: createdAt,
    });
  }

  // Batch insert all 200 employees
  await prisma.employee.createMany({
    data: employeesToInsert,
  });

  const total = await prisma.employee.count();
  console.log(`✅ Successfully seeded ${total} employee records in PostgreSQL!`);
}

main()
  .catch((e) => {
    console.error('Failed to seed database:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
