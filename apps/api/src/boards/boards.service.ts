import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  listBoards() {
    return this.prisma.board.findMany({
      orderBy: { createdAt: 'asc' },
      include: {
        lists: {
          orderBy: { position: 'asc' },
          include: { cards: { orderBy: { position: 'asc' } } },
        },
      },
    });
  }

  async createBoard(title: string, ownerId?: string) {
    let uid = ownerId;
    if (!uid) {
      const existing = await this.prisma.user.findFirst();
      if (existing) {
        uid = existing.id;
      } else {
        // Create a default demo user if none exists (POC convenience)
        const demo = await this.prisma.user.upsert({
          where: { email: 'demo@example.com' },
          update: {},
          create: { email: 'demo@example.com', name: 'Demo User' },
        });
        uid = demo.id;
      }
    }
    return this.prisma.board.create({ data: { title, ownerId: uid } });
  }
}
