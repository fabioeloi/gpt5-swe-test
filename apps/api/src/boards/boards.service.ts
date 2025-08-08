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
      const user = await this.prisma.user.findFirst();
      if (!user) throw new Error('No users found to own the board');
      uid = user.id;
    }
    return this.prisma.board.create({ data: { title, ownerId: uid } });
  }
}
