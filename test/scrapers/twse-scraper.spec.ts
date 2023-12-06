import * as fs from 'fs';
import mockAxios from 'jest-mock-axios';
import { TwseScraper } from '../../src/scrapers/twse-scraper';

describe('TwseScraper', () => {
  let scraper: TwseScraper;

  beforeEach(() => {
    scraper = new TwseScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchListedStocks()', () => {
    it('should fetch listed stocks for TSE market', async () => {
      const data = fs.readFileSync('./test/fixtures/tse-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchListedStocks({ market: 'TSE' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=1',
        { responseType: 'arraybuffer' },
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        symbol: '0050',
        name: '元大台灣50',
        exchange: 'TWSE',
        market: 'TSE',
        industry: '00',
        listedDate: '2003-06-30',
      });
    });

    it('should fetch listed stocks for OTC market', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchListedStocks({ market: 'OTC' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=2',
        { responseType: 'arraybuffer' },
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        symbol: '006201',
        name: '元大富櫃50',
        exchange: 'TPEx',
        market: 'OTC',
        industry: '00',
        listedDate: '2011-01-27',
      });
    });
  });

  describe('.fetchStocksHistorical()', () => {
    it('should fetch stocks historical data for the given date', async () => {
      const data = require('../fixtures/tse-stocks-historical.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksHistorical({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230130&type=ALLBUT0999&response=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
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

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksHistorical({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230101&type=ALLBUT0999&response=json',
      );
      expect(stocks).toBe(null);
    });
  });

  describe('.fetchIndicesHistorical()', () => {
    it('should fetch indices historical data for the given date', async () => {
      const data = require('../fixtures/tse-indices-historical.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const indices = await scraper.fetchIndicesHistorical({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_INDEX?date=20230130&response=json',
      );
      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        symbol: 'IX0001',
        name: '發行量加權股價指數',
        open: 15291.53,
        high: 15493.82,
        low: 15291.53,
        close: 15493.82,
        change: 560.89,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const indices = await scraper.fetchIndicesHistorical({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_INDEX?date=20230101&response=json',
      );
      expect(indices).toBe(null);
    });
  });
});
