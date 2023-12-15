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

  describe('.fetchStocksFiniHoldings()', () => {
    it('should fetch stocks FINI holdings for the given date', async () => {
      const data = require('../fixtures/tse-stocks-fini-holdings.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksFiniHoldings({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/MI_QFIIS?date=20230130&selectType=ALLBUT0999&response=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        symbol: '0050',
        name: '元大台灣50',
        issuedShares: 2260500000,
        availableShares: 2202206452,
        sharesHeld: 58293548,
        availablePercent: 97.42,
        heldPercent: 2.57,
        upperLimitPercent: 100,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksFiniHoldings({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/MI_QFIIS?date=20230101&selectType=ALLBUT0999&response=json',
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

  describe('.fetchMarketTrades()', () => {
    it('should fetch market trades for the given date', async () => {
      const data = require('../fixtures/tse-market-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const market = await scraper.fetchMarketTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=20230130&response=json',
      );
      expect(market).toBeDefined();
      expect(market).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        tradeVolume: 6919326963,
        tradeValue: 354872347181,
        transaction: 2330770,
        index: 15493.82,
        change: 560.89,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const market = await scraper.fetchMarketTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=20230101&response=json',
      );
      expect(market).toBe(null);
    });
  });

  describe('.fetchMarketBreadth()', () => {
    it('should fetch market breadth for the given date', async () => {
      const data = require('../fixtures/tse-market-breadth.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const market = await scraper.fetchMarketBreadth({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230130&response=json',
      );
      expect(market).toBeDefined();
      expect(market).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        up: 764,
        limitUp: 14,
        down: 132,
        limitDown: 0,
        unchanged: 67,
        unmatched: 5,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const market = await scraper.fetchMarketBreadth({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230101&response=json',
      );
      expect(market).toBe(null);
    });
  });

  describe('.fetchMarketInstTrades()', () => {
    it('should fetch market breadth for the given date', async () => {
      const data = require('../fixtures/tse-market-inst-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const market = await scraper.fetchMarketInstTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/BFI82U?dayDate=20230130&type=day&response=json',
      );
      expect(market).toBeDefined();
      expect(market).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        finiWithoutDealersBuy: 203744063563,
        finiWithoutDealersSell: 131488377272,
        finiWithoutDealersNetBuySell: 72255686291,
        finiDealersBuy: 24864200,
        finiDealersSell: 61653250,
        finiDealersNetBuySell: -36789050,
        finiBuy: 203768927763,
        finiSell: 131550030522,
        finiNetBuySell: 72218897241,
        sitcBuy: 6269087553,
        sitcSell: 3179424632,
        sitcNetBuySell: 3089662921,
        dealersForProprietaryBuy: 4736295878,
        dealersForProprietarySell: 1917624556,
        dealersForProprietaryNetBuySell: 2818671322,
        dealersForHedgingBuy: 11451095424,
        dealersForHedgingSell: 6481456459,
        dealersForHedgingNetBuySell: 4969638965,
        dealersBuy: 16187391302,
        dealersSell: 8399081015,
        dealersNetBuySell: 7788310287,
        totalInstInvestorsBuy: 226200542418,
        totalInstInvestorsSell: 143066882919,
        totalInstInvestorsNetBuySell: 83133659499,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const market = await scraper.fetchMarketInstTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/BFI82U?dayDate=20230101&type=day&response=json',
      );
      expect(market).toBe(null);
    });
  });

  describe('.fetchMarketMarginTrades()', () => {
    it('should fetch market margin trades for the given date', async () => {
      const data = require('../fixtures/tse-market-margin-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const market = await scraper.fetchMarketMarginTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230130&selectType=MS&response=json',
      );
      expect(market).toBeDefined();
      expect(market).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        market: 'TSE',
        marginBuy: 264023,
        marginSell: 282873,
        marginRedeem: 10127,
        marginBalancePrev: 6310599,
        marginBalance: 6281622,
        shortBuy: 17280,
        shortSell: 20392,
        shortRedeem: 2075,
        shortBalancePrev: 542895,
        shortBalance: 543932,
        marginBuyValue: 8514925,
        marginSellValue: 8830493,
        marginRedeemValue: 300879,
        marginBalancePrevValue: 151760467,
        marginBalanceValue: 151144020,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const market = await scraper.fetchMarketMarginTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230101&selectType=MS&response=json',
      );
      expect(market).toBe(null);
    });
  });
});
