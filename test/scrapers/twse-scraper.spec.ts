import mockAxios from 'jest-mock-axios';
import { TwseScraper } from '../../src/scrapers/twse-scraper';
import { options } from 'numeral';

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
    it('should fetch stocks values for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-values.json') });

      const data = await scraper.fetchStocksValues({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?date=20230130&selectType=ALL&response=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks values for the specified stock on the given date', async () => {
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

  describe('.fetchStocksDividends()', () => {
    it('should fetch stocks rights and dividend for the given startDate and endDate', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-dividends.json') });

      scraper.fetchStocksDividendsDetail = jest
        .fn()
        .mockReturnValueOnce({
          cashDividend: 0.75,
          stockDividendShares: 0,
          symbol: '00690',
          name: '兆豐藍籌30',
        })
        .mockReturnValueOnce({
          cashDividend: 0.46,
          stockDividendShares: 0,
          symbol: '00913',
          name: '兆豐台灣晶圓製造',
        });

      const data = await scraper.fetchStocksDividends({ startDate: '2024-03-04', endDate: '2024-03-05' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/exRight/TWT49U?startDate=20240304&endDate=20240305&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([
        {
          date: '2024-03-04',
          exchange: 'TWSE',
          symbol: '00690',
          name: '兆豐藍籌30',
          previousClose: 31.35,
          referencePrice: 30.6,
          dividend: 0.75,
          dividendType: '息',
          limitUpPrice: 33.66,
          limitDownPrice: 27.54,
          openingReferencePrice: 30.6,
          exdividendReferencePrice: 30.6,
          cashDividend: 0.75,
          stockDividendShares: 0,
        },
        {
          date: '2024-03-04',
          exchange: 'TWSE',
          symbol: '00913',
          name: '兆豐台灣晶圓製造',
          previousClose: 19.42,
          referencePrice: 18.96,
          dividend: 0.46,
          dividendType: '息',
          limitUpPrice: 20.85,
          limitDownPrice: 17.07,
          openingReferencePrice: 18.96,
          exdividendReferencePrice: 18.96,
          cashDividend: 0.46,
          stockDividendShares: 0,
        },
      ]);
    });
    it('should fetch stocks rights and dividend for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-dividends.json') });

      scraper.fetchStocksDividendsDetail = jest
        .fn()
        .mockReturnValueOnce({
          cashDividend: 0.75,
          stockDividendShares: 0,
          symbol: '00690',
          name: '兆豐藍籌30',
        })
        .mockReturnValueOnce({
          cashDividend: 0.46,
          stockDividendShares: 0,
          symbol: '00913',
          name: '兆豐台灣晶圓製造',
        });

      const data = await scraper.fetchStocksDividends({ startDate: '2024-03-04', endDate: '2024-03-05', symbol: '00913' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/exRight/TWT49U?startDate=20240304&endDate=20240305&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([{
        date: '2024-03-04',
        exchange: 'TWSE',
        symbol: '00913',
        name: '兆豐台灣晶圓製造',
        previousClose: 19.42,
        referencePrice: 18.96,
        dividend: 0.46,
        dividendType: '息',
        limitUpPrice: 20.85,
        limitDownPrice: 17.07,
        openingReferencePrice: 18.96,
        exdividendReferencePrice: 18.96,
        cashDividend: 0.46,
        stockDividendShares: 0,
      }]);
    });

    it('should return empty array when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-dividends-no-data.json') });

      const data = await scraper.fetchStocksDividends({ startDate: '2024-02-08', endDate: '2024-02-14' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/exRight/TWT49U?startDate=20240208&endDate=20240214&response=json',
      );
      expect(data).toEqual([]);
    });
  });

  describe('.fetchStocksDividendsDetail()', () => {
    it('should fetch capital reducation detail for the given date and symbol', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-dividends-detail.json') });

      const data = await scraper.fetchStocksDividendsDetail({ date: '2024-03-04', symbol: '00913' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/exRight/TWT49UDetail?STK_NO=00913&T1=20240304&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        cashDividend: 0.46,
        stockDividendShares: 0,
        name: '兆豐台灣晶圓製造',
        symbol: '00913',
      });
    });

    it('should return null when no data or symbol is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-dividends-detail-no-data.json') });

      const data = await scraper.fetchStocksDividendsDetail({ date: '2023-01-01', symbol: '4444' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/exRight/TWT49UDetail?STK_NO=4444&T1=20230101&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksCapitalReduction()', () => {
    it('should fetch stocks capital reducation for the given startDate and endDate', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-capital-reduction.json') });

      scraper.fetchStockCapitalReductionDetail = jest
        .fn()
        .mockReturnValueOnce({
          symbol: '3432',
          name: '台端',
          haltDate: '2024-01-11',
          sharesPerThousand: 540.65419,
          refundPerShare: 0,
        })
        .mockReturnValueOnce({
          symbol: '2911',
          name: '麗嬰房',
          haltDate: '2024-02-29',
          sharesPerThousand: 720,
          refundPerShare: 0,
        })
        .mockReturnValueOnce({
          symbol: '3308',
          name: '聯德',
          haltDate: '2024-03-21',
          sharesPerThousand: 855.66635,
          refundPerShare: 1.443336,
        });

      const data = await scraper.fetchStocksCapitalReduction({ startDate: '2024-01-01', endDate: '2024-06-28' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/reducation/TWTAUU?startDate=20240101&endDate=20240628&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([
        {
          resumeDate: '2024-01-22',
          exchange: 'TWSE',
          symbol: '3432',
          name: '台端',
          previousClose: 10.65,
          referencePrice: 19.69,
          limitUpPrice: 21.65,
          limitDownPrice: 17.75,
          openingReferencePrice: 19.7,
          exrightReferencePrice: null,
          reason: '彌補虧損',
          haltDate: '2024-01-11',
          sharesPerThousand: 540.65419,
          refundPerShare: 0,
        },
        {
          resumeDate: '2024-03-11',
          exchange: 'TWSE',
          symbol: '2911',
          name: '麗嬰房',
          previousClose: 6.23,
          referencePrice: 8.65,
          limitUpPrice: 9.51,
          limitDownPrice: 7.79,
          openingReferencePrice: 8.65,
          exrightReferencePrice: null,
          reason: '彌補虧損',
          haltDate: '2024-02-29',
          sharesPerThousand: 720,
          refundPerShare: 0,
        },
        {
          resumeDate: '2024-04-01',
          exchange: 'TWSE',
          symbol: '3308',
          name: '聯德',
          previousClose: 28.2,
          referencePrice: 31.26,
          limitUpPrice: 34.35,
          limitDownPrice: 28.15,
          openingReferencePrice: 31.25,
          exrightReferencePrice: null,
          reason: '退還股款',
          haltDate: '2024-03-21',
          sharesPerThousand: 855.66635,
          refundPerShare: 1.443336,
        },
      ]);
    });
    it('should fetch stocks capital reducation for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-capital-reduction.json') });
      const args = { startDate: '2024-01-01', endDate: '2024-06-28', symbol: '2911' }

      scraper.fetchStockCapitalReductionDetail = jest
        .fn()
        .mockReturnValueOnce({
          symbol: '3432',
          name: '台端',
          haltDate: '2024-01-11',
          sharesPerThousand: 540.65419,
          refundPerShare: 0,
        })
        .mockReturnValueOnce({
          symbol: '2911',
          name: '麗嬰房',
          haltDate: '2024-02-29',
          sharesPerThousand: 720,
          refundPerShare: 0,
        })
        .mockReturnValueOnce({
          symbol: '3308',
          name: '聯德',
          haltDate: '2024-03-21',
          sharesPerThousand: 855.66635,
          refundPerShare: 1.443336,
        });

      const data = await scraper.fetchStocksCapitalReduction(args);
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/reducation/TWTAUU?startDate=20240101&endDate=20240628&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([{
        resumeDate: '2024-03-11',
        exchange: 'TWSE',
        symbol: '2911',
        name: '麗嬰房',
        previousClose: 6.23,
        referencePrice: 8.65,
        limitUpPrice: 9.51,
        limitDownPrice: 7.79,
        openingReferencePrice: 8.65,
        exrightReferencePrice: null,
        reason: '彌補虧損',
        haltDate: '2024-02-29',
        sharesPerThousand: 720,
        refundPerShare: 0,
      }]);
    });

    it('should return empty array when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-capital-reduction-no-data.json') });

      const data = await scraper.fetchStocksCapitalReduction({ startDate: '2024-01-01', endDate: '2024-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/reducation/TWTAUU?startDate=20240101&endDate=20240101&response=json',
      );
      expect(data).toEqual([]);
    });
  });

  describe('.fetchStockCapitalReductionDetail()', () => {
    it('should fetch capital reducation detail for the given date and symbol', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-capital-reduction-detail.json') });

      const data = await scraper.fetchStockCapitalReductionDetail({ date: '2024-02-27', symbol: '2911' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/reducation/TWTAVUDetail?STK_NO=2911&FILE_DATE=20240227&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        sharesPerThousand: 720,
        refundPerShare: 0,
        name: '麗嬰房',
        haltDate: '2024-02-29',
        symbol: '2911',
      });
    });

    it('should return null when no data or symbol is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-market-breadth-no-data.json') });

      const data = await scraper.fetchStockCapitalReductionDetail({ date: '2023-01-01', symbol: '4444' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/rwd/zh/reducation/TWTAVUDetail?STK_NO=4444&FILE_DATE=20230101&response=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksSplits()', () => {
    it('should fetch stocks splits for the given startDate and endDate', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-splits.json') });

      const data = await scraper.fetchStocksSplits({ startDate: '2021-01-01', endDate: '2024-05-03' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/pcversion/zh/exchangeReport/TWTB8U?strDate=20210101&endDate=20240503&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([
        {
          resumeDate: '2021-10-18',
          exchange: 'TWSE',
          symbol: '6531',
          name: '愛普',
          previousClose: 750,
          referencePrice: 375,
          limitUpPrice: 412.5,
          limitDownPrice: 337.5,
          openingReferencePrice: 375,
        },
        {
          resumeDate: '2022-07-13',
          exchange: 'TWSE',
          symbol: '6415',
          name: '矽力-KY',
          previousClose: 2485,
          referencePrice: 621.25,
          limitUpPrice: 683,
          limitDownPrice: 560,
          openingReferencePrice: 621,
        },
      ]);
    });
    it('should fetch stocks splits for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-splits.json') });

      const data = await scraper.fetchStocksSplits({ startDate: '2021-01-01', endDate: '2024-05-03', symbol: '6415' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/pcversion/zh/exchangeReport/TWTB8U?strDate=20210101&endDate=20240503&response=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([{
        resumeDate: '2022-07-13',
        exchange: 'TWSE',
        symbol: '6415',
        name: '矽力-KY',
        previousClose: 2485,
        referencePrice: 621.25,
        limitUpPrice: 683,
        limitDownPrice: 560,
        openingReferencePrice: 621,
      }]);
    });

    it('should return empty array when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/twse-stocks-splits-no-data.json') });

      const data = await scraper.fetchStocksSplits({ startDate: '2021-01-01', endDate: '2021-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.twse.com.tw/pcversion/zh/exchangeReport/TWTB8U?strDate=20210101&endDate=20210101&response=json',
      );
      expect(data).toEqual([]);
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
