import * as fs from 'fs';
import mockAxios from 'jest-mock-axios';
import { TwseScraper } from '../../src/scrapers/twse-scraper';

describe('TwseScraper', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchListedStocks()', () => {
    it('should fetch listed stocks for TSE market', async () => {
      const data = fs.readFileSync('./test/fixtures/tse-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new TwseScraper();
      const stocks = await scraper.fetchListedStocks({ market: 'TSE' });

      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        symbol: '1101',
        name: '台泥',
        exchange: 'TWSE',
        market: 'TSE',
        industry: '01',
        listedDate: '1962-02-09',
      });
    });

    it('should fetch listed stocks for OTC market', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new TwseScraper();
      const stocks = await scraper.fetchListedStocks({ market: 'OTC' });

      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        symbol: '1240',
        name: '茂生農經',
        exchange: 'TPEx',
        market: 'OTC',
        industry: '33',
        listedDate: '2018-08-08',
      });
    });
  });

  describe('.fetchStocksHistorical()', () => {
    it('should fetch stocks historical data for the given date', async () => {
      const data = require('../fixtures/tse-stocks-historical.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new TwseScraper();
      const stocks = await scraper.fetchStocksHistorical({ date: '2023-01-30' });

      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        symbol: '0050',
        name: '元大台灣50',
        open: 120.8,
        high: 121,
        low: 120,
        close: 120.7,
        volume: 44330389,
        turnover: 5335880299,
        transaction: 31199,
        change: 0,
      });
    });
  });
});
