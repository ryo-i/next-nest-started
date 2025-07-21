import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.person.createMany({
    data: [
      { name: '織田信長' },
      { name: '豊臣秀吉' },
      { name: '徳川家康' },
    ],
  });
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(() => prisma.$disconnect());