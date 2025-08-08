import { Injectable } from '@nestjs/common';

export type ChatRequest = {
  model?: string;
  messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }>;
  temperature?: number;
  max_tokens?: number;
};

@Injectable()
export class AiService {
  private baseUrl = process.env.AI_BASE_URL || 'https://api.openai.com/v1';
  private model = process.env.AI_MODEL || 'gpt-4o-mini';
  private apiKey = process.env.AI_API_KEY || '';

  async chat(req: ChatRequest): Promise<{ content: string }[]> {
    const model = req.model || this.model;
    const url = `${this.baseUrl}/chat/completions`;

    const res = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${this.apiKey}`,
      },
      body: JSON.stringify({
        model,
        messages: req.messages,
        temperature: req.temperature ?? 0.2,
        max_tokens: req.max_tokens ?? 512,
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`AI request failed: ${res.status} ${res.statusText} - ${text}`);
    }

    const data = (await res.json()) as any;
    const choices = data.choices || [];
    const out: { content: string }[] = choices.map((c: any) => ({ content: c.message?.content ?? '' }));
    return out;
  }
}
