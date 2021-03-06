import KitsuApi from '../src'
describe('Manga', () => {
  const kitsuApi = new KitsuApi();

  test('Fetch manga by id', async () => {
    const res = await kitsuApi.manga.fetchById(1);
    expect(res.data.id).toBe('1');
  });

  test('Fetch manga', async () => {
    const manga = kitsuApi.manga.fetch({filter: {text: 'naruto'}, page: {limit: 5}});
    const res = await manga.exec();
    const next = await manga.next();
    expect(res.data).toHaveLength(5);
    expect(next!.data).toHaveLength(5);
  });
});
