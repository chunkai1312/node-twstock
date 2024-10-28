import * as fs from 'fs';
import mockAxios from 'jest-mock-axios';
import { TpexScraper } from '../../src/scrapers/tpex-scraper';

describe('TpexScraper', () => {
  let scraper: TpexScraper;

  beforeEach(() => {
    scraper = new TpexScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchStocksHistorical()', () => {
    it('should fetch stocks historical data for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-historical.json') });

      const data = await scraper.fetchStocksHistorical({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks historical data for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-historical.json') });

      const data = await scraper.fetchStocksHistorical({ date: '2023-01-30', symbol: '6488' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        symbol: '6488',
        name: '環球晶',
        open: 505,
        high: 530,
        low: 505,
        close: 530,
        volume: 6115888,
        turnover: 3179234099,
        transaction: 6960,
        change: 37,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-historical-no-data.json') });

      const data = await scraper.fetchStocksHistorical({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?d=112%2F01%2F01&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksInstitutional()', () => {
    it('should fetch stocks institutional investors\' trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-institutional.json') });

      const data = await scraper.fetchStocksInstitutional({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?d=112%2F01%2F30&se=EW&t=D&o=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks institutional investors\' trades for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-institutional.json') });

      const data = await scraper.fetchStocksInstitutional({ date: '2023-01-30', symbol: '6488' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?d=112%2F01%2F30&se=EW&t=D&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        symbol: '6488',
        name: '環球晶',
        institutional: [
          {
            investor: '外資及陸資(不含外資自營商)',
            totalBuy: 3059748,
            totalSell: 2331441,
            difference: 728307,
          },
          {
            investor: '外資自營商',
            totalBuy: 0,
            totalSell: 0,
            difference: 0,
          },
          {
            investor: '外資及陸資',
            totalBuy: 3059748,
            totalSell: 2331441,
            difference: 728307,
          },
          {
            investor: '投信',
            totalBuy: 402000,
            totalSell: 3096,
            difference: 398904,
          },
          {
            investor: '自營商(自行買賣)',
            totalBuy: 267600,
            totalSell: 156000,
            difference: 111600,
          },
          {
            investor: '自營商(避險)',
            totalBuy: 128167,
            totalSell: 68000,
            difference: 60167,
          },
          {
            investor: '自營商',
            totalBuy: 395767,
            totalSell: 224000,
            difference: 171767,
          },
          {
            investor: '三大法人',
            difference: 1298978,
          },
        ],
      });
    });

    it('should fetch stocks institutional investors\' trades without foreign dealers for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-institutional-without-foreign-dealers.json') });

      const data = await scraper.fetchStocksInstitutional({ date: '2014-12-01', symbol: '006201' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?d=103%2F12%2F01&se=EW&t=D&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2014-12-01',
        exchange: 'TPEx',
        symbol: '006201',
        name: '寶富櫃',
        institutional: [
          {
            investor: '外資及陸資',
            totalBuy: 0,
            totalSell: 0,
            difference: 0,
          },
          {
            investor: '投信',
            totalBuy: 0,
            totalSell: 0,
            difference: 0,
          },
          {
            investor: '自營商',
            difference: -14000,
          },
          {
            investor: '自營商(自行買賣)',
            totalBuy: 0,
            totalSell: 0,
            difference: 0,
          },
          {
            investor: '自營商(避險)',
            totalBuy: 0,
            totalSell: 14000,
            difference: -14000,
          },
          {
            investor: '三大法人',
            difference: -14000,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-institutional-no-data.json') });

      const data = await scraper.fetchStocksInstitutional({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?d=112%2F01%2F01&se=EW&t=D&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksFiniHoldings()', () => {
    it('should fetch stocks FINI holdings for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tpex-stocks-fini-holdings.html') });

      const data = await scraper.fetchStocksFiniHoldings({ date: '2023-01-30' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/server-java/t13sa150_otc',
        new URLSearchParams({ years: '2023', months: '01', days: '30', bcode: '', step: '2' }),
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks FINI holdings for the specified stock on the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tpex-stocks-fini-holdings.html') });

      const data = await scraper.fetchStocksFiniHoldings({ date: '2023-01-30', symbol: '6488' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/server-java/t13sa150_otc',
        new URLSearchParams({ years: '2023', months: '01', days: '30', bcode: '', step: '2' }),
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        symbol: '6488',
        name: '環球晶',
        issuedShares: 435237000,
        availableShares: 323130729,
        sharesHeld: 112106271,
        availablePercent: 74.24,
        heldPercent: 25.75,
        upperLimitPercent: 100,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tpex-stocks-fini-holdings-no-data.html') });

      const data = await scraper.fetchStocksFiniHoldings({ date: '2023-01-01' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/server-java/t13sa150_otc',
        new URLSearchParams({ years: '2023', months: '01', days: '01', bcode: '', step: '2' }),
        { responseType: 'arraybuffer' },
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksMarginTrades()', () => {
    it('should fetch stocks margin trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-margin-trades.json') });

      const data = await scraper.fetchStocksMarginTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks margin trades for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-margin-trades.json') });

      const data = await scraper.fetchStocksMarginTrades({ date: '2023-01-30', symbol: '6488' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        symbol: '6488',
        name: '環球晶',
        marginBuy: 278,
        marginSell: 407,
        marginRedeem: 11,
        marginBalancePrev: 3120,
        marginBalance: 2980,
        marginQuota: 108809,
        shortBuy: 8,
        shortSell: 49,
        shortRedeem: 0,
        shortBalancePrev: 159,
        shortBalance: 200,
        shortQuota: 108809,
        offset: 0,
        note: '',
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-margin-trades-no-data.json') });

      const data = await scraper.fetchStocksMarginTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?d=112%2F01%2F01&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksShortSales()', () => {
    it('should fetch stocks short sales for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-short-sales.json') });

      const data = await scraper.fetchStocksShortSales({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/margin_trading/margin_sbl/margin_sbl_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks short sales for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-short-sales.json') });

      const data = await scraper.fetchStocksShortSales({ date: '2023-01-30', symbol: '6488' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/margin_trading/margin_sbl/margin_sbl_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        symbol: '6488',
        name: '環球晶',
        marginShortBalancePrev: 159000,
        marginShortSell: 49000,
        marginShortBuy: 8000,
        marginShortRedeem: 0,
        marginShortBalance: 200000,
        marginShortQuota: 108809250,
        sblShortBalancePrev: 2946682,
        sblShortSale: 132000,
        sblShortReturn: 43000,
        sblShortAdjustment: 0,
        sblShortBalance: 3035682,
        sblShortQuota: 189646,
        note: '',
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-short-sales-no-data.json') });

      const data = await scraper.fetchStocksShortSales({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/margin_trading/margin_sbl/margin_sbl_result.php?d=112%2F01%2F01&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksValues()', () => {
    it('should fetch stocks values for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-values.json') });

      const data = await scraper.fetchStocksValues({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/peratio_analysis/pera_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch stocks values for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-values.json') });

      const data = await scraper.fetchStocksValues({ date: '2023-01-30', symbol: '6488' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/peratio_analysis/pera_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        symbol: '6488',
        name: '環球晶',
        peRatio: 19.82,
        pbRatio: 4.61,
        dividendYield: 3.02,
        dividendYear: 2022,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-values-no-data.json') });

      const data = await scraper.fetchStocksValues({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/peratio_analysis/pera_result.php?d=112%2F01%2F01&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksDividends()', () => {
    it('should fetch stocks rights and dividend for the given startDate and endDate', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-dividends.json') });

      const data = await scraper.fetchStocksDividends({ startDate: '2024-03-22', endDate: '2024-03-23' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ_result.php?d=113%2F03%2F22&ed=113%2F03%2F23&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([
        {
          date: '2024-03-22',
          exchange: 'TPEx',
          symbol: '2065',
          name: '世豐',
          previousClose: 65.7,
          referencePrice: 62.84,
          dividend: 2.862035,
          dividendType: '息',
          limitUpPrice: 69.1,
          limitDownPrice: 56.6,
          openingReferencePrice: 62.8,
          exdividendReferencePrice: 62.84,
          cashDividend: 2.86203464,
          stockDividendShares: 0,
        },
        {
          date: '2024-03-22',
          exchange: 'TPEx',
          symbol: '5478',
          name: '智冠',
          previousClose: 166.5,
          referencePrice: 157.5,
          dividend: 9,
          dividendType: '息',
          limitUpPrice: 173,
          limitDownPrice: 142,
          openingReferencePrice: 157.5,
          exdividendReferencePrice: 157.5,
          cashDividend: 9,
          stockDividendShares: 0,
        },
        {
          date: '2024-03-22',
          exchange: 'TPEx',
          symbol: '6895',
          name: '宏碩系統',
          previousClose: 103.5,
          referencePrice: 101.3,
          dividend: 2.2,
          dividendType: '息',
          limitUpPrice: 111,
          limitDownPrice: 91.2,
          openingReferencePrice: 101.5,
          exdividendReferencePrice: 101.3,
          cashDividend: 2.2,
          stockDividendShares: 0,
        },
      ]);
    });
    it('should fetch stocks rights and dividend for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-dividends.json') });

      const data = await scraper.fetchStocksDividends({ startDate: '2024-03-22', endDate: '2024-03-23', symbol: '5478' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ_result.php?d=113%2F03%2F22&ed=113%2F03%2F23&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([{
        date: '2024-03-22',
        exchange: 'TPEx',
        symbol: '5478',
        name: '智冠',
        previousClose: 166.5,
        referencePrice: 157.5,
        dividend: 9,
        dividendType: '息',
        limitUpPrice: 173,
        limitDownPrice: 142,
        openingReferencePrice: 157.5,
        exdividendReferencePrice: 157.5,
        cashDividend: 9,
        stockDividendShares: 0,
      }]);
    });

    it('should return empty array when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-dividends-no-data.json') });

      const data = await scraper.fetchStocksDividends({ startDate: '2024-02-08', endDate: '2024-02-14' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ_result.php?d=113%2F02%2F08&ed=113%2F02%2F14&o=json',
      );
      expect(data).toEqual([]);
    });
  });

  describe('.fetchStocksCapitalReduction()', () => {
    it('should fetch stocks capital reducation for the given startDate and endDate', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-capital-reduction.json') });

      const data = await scraper.fetchStocksCapitalReduction({ startDate: '2024-01-01', endDate: '2024-06-28' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/exright/revivt/revivt_result.php?d=113%2F01%2F01&ed=113%2F06%2F28&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([
        {
          resumeDate: '2024-02-05',
          exchange: 'TPEx',
          symbol: '3064',
          name: '泰偉',
          previousClose: 10.65,
          referencePrice: 35.5,
          limitUpPrice: 39.05,
          limitDownPrice: 31.95,
          openingReferencePrice: 35.5,
          exrightReferencePrice: 0,
          reason: '彌補虧損',
          haltDate: '2024-01-25',
          sharesPerThousand: 300,
          refundPerShare: 0,
        },
        {
          resumeDate: '2024-02-21',
          exchange: 'TPEx',
          symbol: '3191',
          name: '和進',
          previousClose: 10.45,
          referencePrice: 20.9,
          limitUpPrice: 22.95,
          limitDownPrice: 18.85,
          openingReferencePrice: 20.9,
          exrightReferencePrice: 0,
          reason: '彌補虧損',
          haltDate: '2024-02-05',
          sharesPerThousand: 500,
          refundPerShare: 0,
        },
      ]);
    });
    it('should fetch stocks capital reducation for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-capital-reduction.json') });

      const data = await scraper.fetchStocksCapitalReduction({ startDate: '2024-01-01', endDate: '2024-06-28', symbol: '3064' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/exright/revivt/revivt_result.php?d=113%2F01%2F01&ed=113%2F06%2F28&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([{
        resumeDate: '2024-02-05',
        exchange: 'TPEx',
        symbol: '3064',
        name: '泰偉',
        previousClose: 10.65,
        referencePrice: 35.5,
        limitUpPrice: 39.05,
        limitDownPrice: 31.95,
        openingReferencePrice: 35.5,
        exrightReferencePrice: 0,
        reason: '彌補虧損',
        haltDate: '2024-01-25',
        sharesPerThousand: 300,
        refundPerShare: 0,
      }]);
    });

    it('should return empty array when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-capital-reduction-no-data.json') });

      const data = await scraper.fetchStocksCapitalReduction({ startDate: '2024-01-01', endDate: '2024-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/exright/revivt/revivt_result.php?d=113%2F01%2F01&ed=113%2F01%2F01&o=json',
      );
      expect(data).toEqual([]);
    });
  });

  describe('.fetchStocksSplits()', () => {
    it('should fetch stocks splits for the given startDate and endDate', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-splits.json') });

      const data = await scraper.fetchStocksSplits({ startDate: '2021-01-01', endDate: '2024-05-03' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/bulletin/parvaluechg/rslt_result.php?d=110%2F01%2F01&ed=113%2F05%2F03&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([
        {
          resumeDate: '2022-08-29',
          exchange: 'TPEx',
          symbol: '6613',
          name: '朋億*',
          previousClose: 169,
          referencePrice: 84.5,
          limitUpPrice: 92.9,
          limitDownPrice: 76.1,
          openingReferencePrice: 84.5,
        },
        {
          resumeDate: '2022-09-05',
          exchange: 'TPEx',
          symbol: '6548',
          name: '長科*',
          previousClose: 90.6,
          referencePrice: 36.24,
          limitUpPrice: 39.85,
          limitDownPrice: 32.65,
          openingReferencePrice: 36.25,
        },
        {
          resumeDate: '2022-09-19',
          exchange: 'TPEx',
          symbol: '5536',
          name: '聖暉*',
          previousClose: 206,
          referencePrice: 103,
          limitUpPrice: 113,
          limitDownPrice: 92.7,
          openingReferencePrice: 103,
        },
        {
          resumeDate: '2022-12-12',
          exchange: 'TPEx',
          symbol: '3093',
          name: '港建*',
          previousClose: 109.5,
          referencePrice: 27.38,
          limitUpPrice: 30.1,
          limitDownPrice: 24.65,
          openingReferencePrice: 27.4,
        },
      ]);
    });
    it('should fetch stocks splits for the specified stock on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-splits.json') });

      const data = await scraper.fetchStocksSplits({ startDate: '2021-01-01', endDate: '2024-05-03', symbol: '6613' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/bulletin/parvaluechg/rslt_result.php?d=110%2F01%2F01&ed=113%2F05%2F03&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual([{
        resumeDate: '2022-08-29',
        exchange: 'TPEx',
        symbol: '6613',
        name: '朋億*',
        previousClose: 169,
        referencePrice: 84.5,
        limitUpPrice: 92.9,
        limitDownPrice: 76.1,
        openingReferencePrice: 84.5,
      }]);
    });

    it('should return empty array when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-stocks-splits-no-data.json') });

      const data = await scraper.fetchStocksSplits({ startDate: '2021-01-01', endDate: '2021-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/bulletin/parvaluechg/rslt_result.php?d=110%2F01%2F01&ed=110%2F01%2F01&o=json',
      );
      expect(data).toEqual([]);
    });
  });

  describe('.fetchIndicesHistorical()', () => {
    it('should fetch indices historical data for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tpex-indices-historical.html').toString() });

      const data = await scraper.fetchIndicesHistorical({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/iNdex_info/minute_index/1MIN_print.php?d=112%2F01%2F30',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch indices historical data for the specified index on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tpex-indices-historical.html').toString() });

      const data = await scraper.fetchIndicesHistorical({ date: '2023-01-30', symbol: 'IX0043' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/iNdex_info/minute_index/1MIN_print.php?d=112%2F01%2F30',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        symbol: 'IX0043',
        name: '櫃買指數',
        open: 189.57,
        high: 193.25,
        low: 189.57,
        close: 193.23,
        change: 4.73,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tpex-indices-historical-no-data.html').toString() });

      const data = await scraper.fetchIndicesHistorical({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/iNdex_info/minute_index/1MIN_print.php?d=112%2F01%2F01',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchIndicesTrades()', () => {
    it('should fetch indices trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-indices-trades.json') });

      const data = await scraper.fetchIndicesTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/historical/trading_vol_ratio/sectr_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch indices trades for the specified index on the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-indices-trades.json') });

      const data = await scraper.fetchIndicesTrades({ date: '2023-01-30', symbol: 'IX0055' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/historical/trading_vol_ratio/sectr_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        symbol: 'IX0055',
        name: '櫃買光電業類指數',
        tradeVolume: 52122583,
        tradeValue: 6414358379,
        tradeWeight: 10.11,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-indices-trades-no-data.json') });

      const data = await scraper.fetchIndicesTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/historical/trading_vol_ratio/sectr_result.php?d=112%2F01%2F01&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchMarketTrades()', () => {
    it('should fetch market trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-market-trades.json') });

      const data = await scraper.fetchMarketTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/daily_trading_index/st41_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        tradeVolume: 630687778,
        tradeValue: 62678685445,
        transaction: 471626,
        index: 193.23,
        change: 4.73,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-market-trades-no-data.json') });

      const data = await scraper.fetchMarketTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/daily_trading_index/st41_result.php?d=112%2F01%2F01&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchMarketBreadth()', () => {
    it('should fetch market breadth for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-market-breadth.json') });

      const data = await scraper.fetchMarketBreadth({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/market_highlight/highlight_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        up: 591,
        limitUp: 10,
        down: 135,
        limitDown: 0,
        unchanged: 69,
        unmatched: 14,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-market-breadth-no-data.json') });

      const data = await scraper.fetchMarketBreadth({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/aftertrading/market_highlight/highlight_result.php?d=112%2F01%2F01&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchMarketInstitutional()', () => {
    it('should fetch market institutional investors\' trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-market-institutional.json') });

      const data = await scraper.fetchMarketInstitutional({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/3insti/3insti_summary/3itrdsum_result.php?d=112%2F01%2F30&t=D&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        institutional: [
          {
            investor: '外資及陸資合計',
            totalBuy: 20112958447,
            totalSell: 16591758807,
            difference: 3521199640,
          },
          {
            investor: '外資及陸資(不含自營商)',
            totalBuy: 20112958447,
            totalSell: 16591758807,
            difference: 3521199640,
          },
          {
            investor: '外資自營商',
            totalBuy: 0,
            totalSell: 0,
            difference: 0,
          },
          {
            investor: '投信',
            totalBuy: 1543494365,
            totalSell: 579611355,
            difference: 963883010,
          },
          {
            investor: '自營商合計',
            totalBuy: 2083927559,
            totalSell: 763116439,
            difference: 1320811120,
          },
          {
            investor: '自營商(自行買賣)',
            totalBuy: 1180899990,
            totalSell: 450809569,
            difference: 730090421,
          },
          {
            investor: '自營商(避險)',
            totalBuy: 903027569,
            totalSell: 312306870,
            difference: 590720699,
          },
          {
            investor: '三大法人合計*',
            totalBuy: 23740380371,
            totalSell: 17934486601,
            difference: 5805893770,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-market-institutional-no-data.json') });

      const data = await scraper.fetchMarketInstitutional({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/3insti/3insti_summary/3itrdsum_result.php?d=112%2F01%2F01&t=D&o=json',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchMarketMarginTrades()', () => {
    it('should fetch market margin trades for the given date', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-market-margin-trades.json') });

      const data = await scraper.fetchMarketMarginTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?d=112%2F01%2F30&o=json',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        marginBuy: 71250,
        marginSell: 59859,
        marginRedeem: 2750,
        marginBalancePrev: 1609204,
        marginBalance: 1617845,
        shortBuy: 4183,
        shortSell: 4455,
        shortRedeem: 445,
        shortBalancePrev: 112717,
        shortBalance: 112544,
        marginBuyValue: 3388490,
        marginSellValue: 2866469,
        marginRedeemValue: 92804,
        marginBalancePrevValue: 55747157,
        marginBalanceValue: 56176374,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tpex-market-margin-trades-no-data.json') });

      const data = await scraper.fetchMarketMarginTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://wwwov.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?d=112%2F01%2F01&o=json',
      );
      expect(data).toBe(null);
    });
  });
});
