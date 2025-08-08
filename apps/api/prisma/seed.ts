import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const user = await prisma.user.upsert({
    where: { email: 'demo@example.com' },
    update: {},
    create: { email: 'demo@example.com', name: 'Demo User' },
  });

  const board = await prisma.board.create({
    data: {
      title: 'Demo Board',
      ownerId: user.id,
      lists: {
        create: [
          {
            title: 'To Do',
            position: 1,
            cards: { create: [{ title: 'Set up project', position: 1 }] },
          },
          {
            title: 'In Progress',
            position: 2,
            cards: { create: [{ title: 'Build API', position: 1 }] },
          },
          { title: 'Done', position: 3 },
        ],
      },
    },
    include: { lists: { include: { cards: true } } },
  });

  // eslint-disable-next-line no-console
  console.log('Seeded:', { user: user.email, board: board.title });
}

main()
  .catch((e) => {
    // eslint-disable-next-line no-console
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
