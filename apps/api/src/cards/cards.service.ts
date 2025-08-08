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

  async reorder(payload: {
    source: { listId: string; orderedIds: string[] };
    dest?: { listId: string; orderedIds: string[] };
  }) {
    const tx: any[] = [];
    const { source, dest } = payload;
    // If moving across lists, update listId for any ids present in dest
    if (dest && dest.listId && dest.listId !== source.listId) {
      for (const id of dest.orderedIds) {
        tx.push(this.prisma.card.update({ where: { id }, data: { listId: dest.listId } }));
      }
    }
    // Reposition cards in source list
    if (source?.orderedIds?.length) {
      tx.push(
        ...source.orderedIds.map((id, idx) => this.prisma.card.update({ where: { id }, data: { position: idx + 1, listId: source.listId } })),
      );
    }
    // Reposition cards in dest list
    if (dest?.orderedIds?.length) {
      tx.push(
        ...dest.orderedIds.map((id, idx) => this.prisma.card.update({ where: { id }, data: { position: idx + 1, listId: dest.listId } })),
      );
    }
    if (tx.length === 0) return [];
    return this.prisma.$transaction(tx);
  }
}
