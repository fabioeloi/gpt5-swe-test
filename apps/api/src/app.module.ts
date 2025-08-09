import { Module, Controller, Get } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { BoardsModule } from './boards/boards.module';
import { AiModule } from './ai/ai.module';
import { ListsModule } from './lists/lists.module';
import { CardsModule } from './cards/cards.module';
import { openApiSpec } from './docs/openapi';

@Controller()
class DocsController {
  @Get('openapi.json')
  spec() {
    return openApiSpec;
  }
}

@Module({
  imports: [PrismaModule, BoardsModule, AiModule, ListsModule, CardsModule],
  controllers: [AppController, DocsController],
  providers: [AppService],
})
export class AppModule {}
