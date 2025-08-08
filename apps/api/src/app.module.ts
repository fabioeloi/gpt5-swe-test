import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BoardsModule } from './boards/boards.module';
import { AiModule } from './ai/ai.module';
import { ListsModule } from './lists/lists.module';
import { CardsModule } from './cards/cards.module';

@Module({
  imports: [PrismaModule, BoardsModule, AiModule, ListsModule, CardsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
