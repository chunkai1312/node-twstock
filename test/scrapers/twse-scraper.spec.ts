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
      const listedStocks = await scraper.fetchListedStocks({ market: 'TSE' });

      expect(listedStocks).toBeDefined();
      expect(listedStocks.length).toBeGreaterThan(0);
      expect(listedStocks[0].symbol).toBe('1101');
      expect(listedStocks[0].name).toBe('台泥');
      expect(listedStocks[0].exchange).toBe('TWSE');
      expect(listedStocks[0].market).toBe('TSE');
      expect(listedStocks[0].industry).toBe('01');
      expect(listedStocks[0].listedDate).toBe('1962-02-09');
    });

    it('should fetch listed stocks for OTC market', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new TwseScraper();
      const listedStocks = await scraper.fetchListedStocks({ market: 'OTC' });

      expect(listedStocks).toBeDefined();
      expect(listedStocks.length).toBeGreaterThan(0);
      expect(listedStocks[0].symbol).toBe('1240');
      expect(listedStocks[0].name).toBe('茂生農經');
      expect(listedStocks[0].exchange).toBe('TPEx');
      expect(listedStocks[0].market).toBe('OTC');
      expect(listedStocks[0].industry).toBe('33');
      expect(listedStocks[0].listedDate).toBe('2018-08-08');
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
      expect(stocks[0].date).toBe('2023-01-30');
      expect(stocks[0].symbol).toBe('0050');
      expect(stocks[0].name).toBe('元大台灣50');
      expect(stocks[0].open).toBe(120.8);
      expect(stocks[0].high).toBe(121);
      expect(stocks[0].low).toBe(120);
      expect(stocks[0].close).toBe(120.7);
      expect(stocks[0].volume).toBe(44330389);
      expect(stocks[0].turnover).toBe(5335880299);
      expect(stocks[0].transaction).toBe(31199);
      expect(stocks[0].change).toBe(0);
    });
  });
});
