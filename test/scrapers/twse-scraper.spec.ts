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

  describe('.fetchStocksInstTrades()', () => {
    it('should fetch stocks institutional investors\' trades for the given date', async () => {
      const data = require('../fixtures/tse-stocks-inst-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksInstTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/T86?date=20230130&selectType=ALLBUT0999&response=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        symbol: '2303',
        name: '聯電',
        finiWithoutDealersBuy: 153168423,
        finiWithoutDealersSell: 69183073,
        finiWithoutDealersNetBuySell: 83985350,
        finiDealersBuy: 0,
        finiDealersSell: 0,
        finiDealersNetBuySell: 0,
        finiBuy: 153168423,
        finiSell: 69183073,
        finiNetBuySell: 83985350,
        sitcBuy: 19338000,
        sitcSell: 161299,
        sitcNetBuySell: 19176701,
        dealersForProprietaryBuy: 3768000,
        dealersForProprietarySell: 759000,
        dealersForProprietaryNetBuySell: 3009000,
        dealersForHedgingBuy: 3766151,
        dealersForHedgingSell: 416000,
        dealersForHedgingNetBuySell: 3350151,
        dealersBuy: 7534151,
        dealersSell: 1175000,
        dealersNetBuySell: 6359151,
        totalInstInvestorsBuy: 180040574,
        totalInstInvestorsSell: 70519372,
        totalInstInvestorsNetBuySell: 109521202,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksInstTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/T86?date=20230101&selectType=ALLBUT0999&response=json',
      );
      expect(stocks).toBe(null);
    });
  });

  describe('.fetchStocksValues()', () => {
    it('should fetch stocks values for the given date', async () => {
      const data = require('../fixtures/tse-stocks-values.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksValues({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?date=20230130&selectType=ALL&response=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        symbol: '1101',
        name: '台泥',
        peRatio: 30.79,
        pbRatio: 1.27,
        dividendYield: 5.41,
        dividendYear: 2021,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksValues({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?date=20230101&selectType=ALL&response=json',
      );
      expect(stocks).toBe(null);
    });
  });

  describe('.fetchStocksMarginTrades()', () => {
    it('should fetch stocks values for the given date', async () => {
      const data = require('../fixtures/tse-stocks-margin-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksMarginTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230130&selectType=ALL&response=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        symbol: '0050',
        name: '元大台灣50',
        marginBuy: 118,
        marginSell: 396,
        marginRedeem: 2,
        marginBalancePrev: 2127,
        marginBalance: 1847,
        marginQuota: 565125,
        shortBuy: 0,
        shortSell: 217,
        shortRedeem: 0,
        shortBalancePrev: 0,
        shortBalance: 217,
        shortQuota: 565125,
        offset: 27,
        note: '',
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksMarginTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230101&selectType=ALL&response=json',
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
