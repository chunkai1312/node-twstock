import mockAxios from 'jest-mock-axios';
import { TpexScraper } from '../../src/scrapers/tpex-scraper';

describe('TpexScraper', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchStocksHistorical()', () => {
    it('should fetch stocks historical data for the given date', async () => {
      const data = require('../fixtures/otc-stocks-historical.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new TpexScraper();
      const stocks = await scraper.fetchStocksHistorical({ date: '2023-01-30' });

      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0].date).toBe('2023-01-30');
      expect(stocks[0].symbol).toBe('006201');
      expect(stocks[0].name).toBe('元大富櫃50');
      expect(stocks[0].open).toBe(16.45);
      expect(stocks[0].high).toBe(16.97);
      expect(stocks[0].low).toBe(16.45);
      expect(stocks[0].close).toBe(16.97);
      expect(stocks[0].volume).toBe(111047);
      expect(stocks[0].turnover).toBe(1872949);
      expect(stocks[0].transaction).toBe(80);
      expect(stocks[0].change).toBe(0.64);
    });
  });
});
