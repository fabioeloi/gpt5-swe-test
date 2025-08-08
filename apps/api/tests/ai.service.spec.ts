import { AiService } from '../src/ai/ai.service';

describe('AiService', () => {
  const OLD_FETCH = global.fetch as any;

  beforeEach(() => {
    (global as any).fetch = jest.fn(async () => ({
      ok: true,
      json: async () => ({ choices: [{ message: { content: 'hello' } }] }),
    }));
  });

  afterEach(() => {
    (global as any).fetch = OLD_FETCH;
    jest.resetAllMocks();
  });

  it('maps chat response to content array', async () => {
    const svc = new AiService();
    const out = await svc.chat({ messages: [{ role: 'user', content: 'hi' }] });
    expect(out).toEqual([{ content: 'hello' }]);
    expect(global.fetch).toHaveBeenCalled();
  });
});
