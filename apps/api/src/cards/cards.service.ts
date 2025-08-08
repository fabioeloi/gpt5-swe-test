import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CardsService {
  constructor(private readonly prisma: PrismaService) {}

  async createCard(listId: string, title: string, description?: string) {
    const max = await this.prisma.card.aggregate({ _max: { position: true }, where: { listId } });
    const nextPos = (max._max.position ?? 0) + 1;
    return this.prisma.card.create({ data: { listId, title, description, position: nextPos } });
  }
}
