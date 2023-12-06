import * as fs from 'fs';
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
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        symbol: '006201',
        name: '元大富櫃50',
        open: 16.45,
        high: 16.97,
        low: 16.45,
        close: 16.97,
        volume: 111047,
        turnover: 1872949,
        transaction: 80,
        change: 0.64,
      });
    });
  });

  describe('.fetchIndicesHistorical()', () => {
    it('should fetch indices historical data for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-indices-historical.html').toString();
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new TpexScraper();
      const indices = await scraper.fetchIndicesHistorical({ date: '2023-01-30' });

      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[indices.length - 1]).toEqual({
        date: '2023-01-30',
        symbol: 'IX0043',
        name: '櫃買指數',
        open: 189.57,
        high: 193.25,
        low: 189.57,
        close: 193.23,
        change: 4.73,
      });
    });
  });
});
