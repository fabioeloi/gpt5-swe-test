import { Body, Controller, Post } from '@nestjs/common';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsController {
  constructor(private readonly lists: ListsService) {}

  @Post()
  async create(@Body() body: { boardId: string; title: string }) {
    if (!body?.boardId || !body?.title) return { error: 'boardId and title are required' };
    return this.lists.createList(body.boardId, body.title);
  }
}
