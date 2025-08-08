import { fetchBoard } from '../lib/api';

describe('lib/api fetchBoard', () => {
  const OLD_FETCH = global.fetch as any;
  afterEach(() => {
    (global as any).fetch = OLD_FETCH;
    jest.resetAllMocks();
  });
  it('returns data on ok', async () => {
    (global as any).fetch = jest.fn(async () => ({ ok: true, json: async () => ({ id: 'b1' }) }));
    const out = await fetchBoard('b1');
    expect(out).toEqual({ id: 'b1' });
  });
  it('returns null on error', async () => {
    (global as any).fetch = jest.fn(async () => { throw new Error('boom'); });
    const out = await fetchBoard('b1');
    expect(out).toBeNull();
  });
});
