import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class BoardsService {
  constructor(private readonly prisma: PrismaService) {}

  listBoards() {
    return this.prisma.board.findMany({
      include: { lists: { include: { cards: true } } },
    });
  }
}
