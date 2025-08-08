import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class ListsService {
  constructor(private readonly prisma: PrismaService) {}

  async createList(boardId: string, title: string) {
    const max = await this.prisma.list.aggregate({
      _max: { position: true },
      where: { boardId },
    });
    const nextPos = (max._max.position ?? 0) + 1;
    return this.prisma.list.create({ data: { boardId, title, position: nextPos } });
  }

  async reorder(boardId: string, orderedIds: string[]) {
    return this.prisma.$transaction(
      orderedIds.map((id, index) =>
        this.prisma.list.update({ where: { id }, data: { position: index + 1, boardId } }),
      ),
    );
  }
}
