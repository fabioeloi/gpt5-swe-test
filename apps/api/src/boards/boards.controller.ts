import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { BoardsService } from './boards.service';

@Controller('boards')
export class BoardsController {
  constructor(private readonly boards: BoardsService) {}

  @Get()
  list() {
    return this.boards.listBoards();
  }

  @Post()
  async create(@Body() body: { title: string; ownerId?: string }) {
    if (!body?.title) return { error: 'title is required' };
    const board = await this.boards.createBoard(body.title, body.ownerId);
    return board;
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.boards.getBoard(id);
  }
}
