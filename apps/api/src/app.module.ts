import { Module, Controller, Get, Header } from '@nestjs/common';
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

  @Get('docs')
  @Header('Content-Type', 'text/html')
  html() {
    return `<!doctype html><html><head><title>API Docs</title><meta charset=utf-8 />
<style>body,html{margin:0;padding:0;height:100%;} #redoc{height:100vh;} body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;}</style>
</head><body><div id="redoc"></div><script src="https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"></script><script>Redoc.init('/openapi.json',{disableSearch:false,pathInMiddlePanel:true})</script></body></html>`;
  }
}

@Module({
  imports: [PrismaModule, BoardsModule, AiModule, ListsModule, CardsModule],
  controllers: [AppController, DocsController],
  providers: [AppService],
})
export class AppModule {}
