import { Body, Controller, Post, BadRequestException } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cards: CardsService) {}

  @Post()
  async create(@Body() body: { listId: string; title: string; description?: string }) {
    if (!body?.listId || !body?.title) throw new BadRequestException('listId and title are required');
    return this.cards.createCard(body.listId, body.title, body.description);
  }

  @Post('reorder')
  async reorder(
    @Body()
    body: { source: { listId: string; orderedIds: string[] }; dest?: { listId: string; orderedIds: string[] } },
  ) {
    if (!body?.source?.listId || !Array.isArray(body?.source?.orderedIds)) {
      throw new BadRequestException('source.listId and source.orderedIds are required');
    }
    return this.cards.reorder(body);
  }
}
