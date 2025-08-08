import { Body, Controller, Post } from '@nestjs/common';
import { CardsService } from './cards.service';

@Controller('cards')
export class CardsController {
  constructor(private readonly cards: CardsService) {}

  @Post()
  async create(@Body() body: { listId: string; title: string; description?: string }) {
    if (!body?.listId || !body?.title) return { error: 'listId and title are required' };
    return this.cards.createCard(body.listId, body.title, body.description);
  }
}
