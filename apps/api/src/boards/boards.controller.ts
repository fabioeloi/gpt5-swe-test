import { Body, Controller, Get, Param, Post, BadRequestException } from '@nestjs/common';
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
    if (!body?.title) throw new BadRequestException('title is required');
    return this.boards.createBoard(body.title, body.ownerId);
  }

  @Get(':id')
  get(@Param('id') id: string) {
    return this.boards.getBoard(id);
  }
}
