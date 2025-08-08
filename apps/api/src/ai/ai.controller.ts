import { Body, Controller, Post } from '@nestjs/common';
import { AiService, ChatRequest } from './ai.service';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('chat')
  async chat(@Body() body: ChatRequest) {
    // Never expose the API key to the client; proxy server-side only.
    const result = await this.ai.chat(body);
    return { choices: result };
  }
}
