import { fetchBoards } from '../lib/api';

describe('lib/api fetchBoards', () => {
  const OLD_FETCH = global.fetch as any;
  beforeEach(() => {
    (global as any).fetch = jest.fn(async () => ({ ok: true, json: async () => ([{ id: 'b1' }]) }));
  });
  afterEach(() => {
    (global as any).fetch = OLD_FETCH;
    jest.resetAllMocks();
  });
  it('returns data on ok', async () => {
    const out = await fetchBoards();
    expect(out).toEqual([{ id: 'b1' }]);
  });
  it('returns [] on error', async () => {
    (global as any).fetch = jest.fn(async () => { throw new Error('boom'); });
    const out = await fetchBoards();
    expect(out).toEqual([]);
  });
});
