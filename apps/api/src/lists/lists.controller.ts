import { Body, Controller, Patch, Post } from '@nestjs/common';
import { ListsService } from './lists.service';

@Controller('lists')
export class ListsController {
  constructor(private readonly lists: ListsService) {}

  @Post()
  async create(@Body() body: { boardId: string; title: string }) {
    if (!body?.boardId || !body?.title) return { error: 'boardId and title are required' };
    return this.lists.createList(body.boardId, body.title);
  }

  @Patch('reorder')
  async reorder(@Body() body: { boardId: string; orderedIds: string[] }) {
    if (!body?.boardId || !Array.isArray(body?.orderedIds)) return { error: 'boardId and orderedIds are required' };
    return this.lists.reorder(body.boardId, body.orderedIds);
  }
}
