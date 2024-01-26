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
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-historical.json') });

      const data = await scraper.fetchStocksHistorical({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230130&type=ALLBUT0999&response=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks historical data for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-historical.json') });

      const data = await scraper.fetchStocksHistorical({ date: '2023-01-30', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230130&type=ALLBUT0999&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        symbol: '2330',
        name: '台積電',
        open: 542,
        high: 543,
        low: 534,
        close: 543,
        volume: 148413161,
        turnover: 80057158264,
        transaction: 153125,
        change: 40,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-historical-no-data.json') });

      const data = await scraper.fetchStocksHistorical({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230101&type=ALLBUT0999&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksInstitutional()', () => {
    it('should fetch stocks institutional investors\' trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-institutional.json') });

      const data = await scraper.fetchStocksInstitutional({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/T86?date=20230130&selectType=ALLBUT0999&response=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks institutional investors\' trades for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-institutional.json') });

      const data = await scraper.fetchStocksInstitutional({ date: '2023-01-30', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/T86?date=20230130&selectType=ALLBUT0999&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        symbol: '2330',
        name: '台積電',
        institutional: [
          {
            investor: '外資及陸資(不含外資自營商)',
            totalBuy: 133236588,
            totalSell: 52595539,
            difference: 80641049,
          },
          {
            investor: '外資自營商',
            totalBuy: 0,
            totalSell: 0,
            difference: 0,
          },
          {
            investor: '投信',
            totalBuy: 1032000,
            totalSell: 94327,
            difference: 937673,
          },
          {
            investor: '自營商合計',
            difference: 880408,
          },
          {
            investor: '自營商(自行買賣)',
            totalBuy: 978000,
            totalSell: 537000,
            difference: 441000,
          },
          {
            investor: '自營商(避險)',
            totalBuy: 1227511,
            totalSell: 788103,
            difference: 439408,
          },
          {
            investor: '合計',
            difference: 82459130,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-institutional-no-data.json') });

      const data = await scraper.fetchStocksInstitutional({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/T86?date=20230101&selectType=ALLBUT0999&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksFiniHoldings()', () => {
    it('should fetch stocks FINI holdings for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-fini-holdings.json') });

      const data = await scraper.fetchStocksFiniHoldings({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/MI_QFIIS?date=20230130&selectType=ALLBUT0999&response=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks FINI holdings for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-fini-holdings.json') });

      const data = await scraper.fetchStocksFiniHoldings({ date: '2023-01-30', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/MI_QFIIS?date=20230130&selectType=ALLBUT0999&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        symbol: '2330',
        name: '台積電',
        issuedShares: 25930380458,
        availableShares: 7329280055,
        sharesHeld: 18601100403,
        availablePercent: 28.26,
        heldPercent: 71.73,
        upperLimitPercent: 100,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-fini-holdings-no-data.json') });

      const data = await scraper.fetchStocksFiniHoldings({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/MI_QFIIS?date=20230101&selectType=ALLBUT0999&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksMarginTrades()', () => {
    it('should fetch stocks margin trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-margin-trades.json') });

      const data = await scraper.fetchStocksMarginTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230130&selectType=ALL&response=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks margin trades for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-margin-trades.json') });

      const data = await scraper.fetchStocksMarginTrades({ date: '2023-01-30', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230130&selectType=ALL&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        symbol: '2330',
        name: '台積電',
        marginBuy: 1209,
        marginSell: 2295,
        marginRedeem: 74,
        marginBalancePrev: 20547,
        marginBalance: 19387,
        marginQuota: 6482595,
        shortBuy: 56,
        shortSell: 284,
        shortRedeem: 101,
        shortBalancePrev: 1506,
        shortBalance: 1633,
        shortQuota: 6482595,
        offset: 7,
        note: '',
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-margin-trades-no-data.json') });

      const data = await scraper.fetchStocksMarginTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230101&selectType=ALL&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksShortSales()', () => {
    it('should fetch stocks short sales for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-short-sales.json') });

      const data = await scraper.fetchStocksShortSales({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/TWT93U?date=20230130&response=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks short sales for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-short-sales.json') });

      const data = await scraper.fetchStocksShortSales({ date: '2023-01-30', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/TWT93U?date=20230130&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        symbol: '2330',
        name: '台積電',
        marginShortBalancePrev: 1506000,
        marginShortSell: 284000,
        marginShortBuy: 56000,
        marginShortRedeem: 101000,
        marginShortBalance: 1633000,
        marginShortQuota: 6482595114,
        sblShortBalancePrev: 30846988,
        sblShortSale: 286000,
        sblShortReturn: 742000,
        sblShortAdjustment: 0,
        sblShortBalance: 30390988,
        sblShortQuota: 3399967,
        note: '',
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-short-sales-no-data.json') });

      const data = await scraper.fetchStocksShortSales({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/TWT93U?date=20230101&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksValues()', () => {
    it('should fetch stocks values for the given date', async () => {;
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-values.json') });

      const data = await scraper.fetchStocksValues({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?date=20230130&selectType=ALL&response=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks values for the specified stock on the given date', async () => {;
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-values.json') });

      const data = await scraper.fetchStocksValues({ date: '2023-01-30', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?date=20230130&selectType=ALL&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        symbol: '2330',
        name: '台積電',
        peRatio: 15.88,
        pbRatio: 5.14,
        dividendYield: 2.03,
        dividendYear: 2021,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-values-no-data.json') });

      const data = await scraper.fetchStocksValues({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?date=20230101&selectType=ALL&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchIndicesHistorical()', () => {
    it('should fetch indices historical data for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-indices-historical.json') });

      const data = await scraper.fetchIndicesHistorical({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_INDEX?date=20230130&response=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch indices historical data for the specified index on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-indices-historical.json') });

      const data = await scraper.fetchIndicesHistorical({ date: '2023-01-30', symbol: 'IX0001' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_INDEX?date=20230130&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
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
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-indices-historical-no-data.json') });

      const data = await scraper.fetchIndicesHistorical({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_INDEX?date=20230101&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchIndicesTrades()', () => {
    it('should fetch indices trades for the given date', async () => {
      // @ts-ignore
      mockAxios.get.mockImplementation((url: string) => {
        return new Promise((resolve, reject) => {
          switch (url) {
            case 'https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?date=20230130&response=json':
              return resolve({ data: require('../fixtures/twse-indices-trades.json') });
            case 'https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=20230130&response=json':
              return resolve({ data: require('../fixtures/twse-market-trades.json') });
            default: return reject();
          }
        });
      });

      const data = await scraper.fetchIndicesTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?date=20230130&response=json',
      );
      expect(data).toBeDefined();
    });

    it('should fetch indices trades for the specified index on the given date', async () => {
      // @ts-ignore
      mockAxios.get.mockImplementation((url: string) => {
        return new Promise((resolve, reject) => {
          switch (url) {
            case 'https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?date=20230130&response=json':
              return resolve({ data: require('../fixtures/twse-indices-trades.json') });
            case 'https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=20230130&response=json':
              return resolve({ data: require('../fixtures/twse-market-trades.json') });
            default: return reject();
          }
        });
      });

      const data = await scraper.fetchIndicesTrades({ date: '2023-01-30', symbol: 'IX0010' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?date=20230130&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        symbol: 'IX0010',
        name: '水泥類指數',
        tradeVolume: 53094031,
        tradeValue: 1997173939,
        tradeWeight: 0.56,
      });
    });

    it('should return null when no market trades is available', async () => {
      // @ts-ignore
      mockAxios.get.mockImplementation((url: string) => {
        return new Promise((resolve, reject) => {
          switch (url) {
            case 'https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?date=20230101&response=json':
              return resolve({ data: require('../fixtures/twse-indices-trades.json') });
            case 'https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=20230101&response=json':
              return resolve({ data: require('../fixtures/twse-market-trades-no-data.json') });
            default: return reject();
          }
        });
      });

      const data = await scraper.fetchIndicesTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?date=20230101&response=json',
      );
      expect(data).toBe(null);
    });

    it('should return null when no data is available', async () => {
      // @ts-ignore
      mockAxios.get.mockImplementation((url: string) => {
        return new Promise((resolve, reject) => {
          switch (url) {
            case 'https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?date=20230101&response=json':
              return resolve({ data: require('../fixtures/twse-indices-trades-no-data.json') });
            case 'https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=20230101&response=json':
              return resolve({ data: require('../fixtures/twse-market-trades-no-data.json') });
            default: return reject();
          }
        });
      });

      const data = await scraper.fetchIndicesTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?date=20230101&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchMarketTrades()', () => {
    it('should fetch market trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-trades.json') });

      const data = await scraper.fetchMarketTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=20230130&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        tradeVolume: 6919326963,
        tradeValue: 354872347181,
        transaction: 2330770,
        index: 15493.82,
        change: 560.89,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-trades-no-data.json') });

      const data = await scraper.fetchMarketTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?date=20230101&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchMarketBreadth()', () => {
    it('should fetch market breadth for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-breadth.json') });

      const data = await scraper.fetchMarketBreadth({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230130&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        up: 764,
        limitUp: 14,
        down: 132,
        limitDown: 0,
        unchanged: 67,
        unmatched: 1,
        notApplicable: 4,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-breadth-no-data.json') });

      const data = await scraper.fetchMarketBreadth({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?date=20230101&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchMarketInstitutional()', () => {
    it('should fetch market institutional investors\' trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-institutional.json') });

      const data = await scraper.fetchMarketInstitutional({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/BFI82U?dayDate=20230130&type=day&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
        institutional: [
          {
            investor: '自營商(自行買賣)',
            totalBuy: 4736295878,
            totalSell: 1917624556,
            difference: 2818671322,
          },
          {
            investor: '自營商(避險)',
            totalBuy: 11451095424,
            totalSell: 6481456459,
            difference: 4969638965,
          },
          {
            investor: '投信',
            totalBuy: 6269087553,
            totalSell: 3179424632,
            difference: 3089662921,
          },
          {
            investor: '外資及陸資(不含外資自營商)',
            totalBuy: 203744063563,
            totalSell: 131488377272,
            difference: 72255686291,
          },
          {
            investor: '外資自營商',
            totalBuy: 24864200,
            totalSell: 61653250,
            difference: -36789050,
          },
          {
            investor: '合計',
            totalBuy: 226200542418,
            totalSell: 143066882919,
            difference: 83133659499,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-institutional-no-data.json') });

      const data = await scraper.fetchMarketInstitutional({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/fund/BFI82U?dayDate=20230101&type=day&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchMarketMarginTrades()', () => {
    it('should fetch market margin trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-margin-trades.json') });

      const data = await scraper.fetchMarketMarginTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230130&selectType=MS&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TWSE',
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
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-margin-trades-no-data.json') });

      const data = await scraper.fetchMarketMarginTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?date=20230101&selectType=MS&response=json',
      );
      expect(data).toBe(null);
    });
  });
});
