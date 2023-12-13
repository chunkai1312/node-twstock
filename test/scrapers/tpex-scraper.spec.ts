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
      const data = require('../fixtures/otc-stocks-historical.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksHistorical({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?d=112%2F01%2F30&o=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        market: 'OTC',
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

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: { iTotalRecords: 0 } });

      const stocks = await scraper.fetchStocksHistorical({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?d=112%2F01%2F01&o=json',
      );
      expect(stocks).toBe(null);
    });
  });

  describe('.fetchStocksInstTrades()', () => {
    it('should fetch stocks institutional investors\' trades for the given date', async () => {
      const data = require('../fixtures/otc-stocks-inst-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksInstTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?d=112%2F01%2F30&se=EW&t=D&o=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        market: 'OTC',
        symbol: '00679B',
        name: '元大美債20年',
        finiWithoutDealersBuy: 425061,
        finiWithoutDealersSell: 282000,
        finiWithoutDealersNetBuySell: 143061,
        finiDealersBuy: 0,
        finiDealersSell: 0,
        finiDealersNetBuySell: 0,
        finiBuy: 425061,
        finiSell: 282000,
        finiNetBuySell: 143061,
        sitcBuy: 0,
        sitcSell: 0,
        sitcNetBuySell: 0,
        dealersForProprietaryBuy: 250000,
        dealersForProprietarySell: 0,
        dealersForProprietaryNetBuySell: 250000,
        dealersForHedgingBuy: 1874000,
        dealersForHedgingSell: 9422229,
        dealersForHedgingNetBuySell: -7548229,
        dealersBuy: 2124000,
        dealersSell: 9422229,
        dealersNetBuySell: -7298229,
        totalInstInvestorsBuy: 2549061,
        totalInstInvestorsSell: 9704229,
        totalInstInvestorsNetBuySell: -7155168,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksInstTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?d=112%2F01%2F01&se=EW&t=D&o=json',
      );
      expect(stocks).toBe(null);
    });
  });

  describe('.fetchStocksValues()', () => {
    it('should fetch stocks values for the given date', async () => {
      const data = require('../fixtures/otc-stocks-values.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksValues({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/aftertrading/peratio_analysis/pera_result.php?d=112%2F01%2F30&o=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        market: 'OTC',
        symbol: '1240',
        name: '茂生農經',
        peRatio: 46.32,
        pbRatio: 1.42,
        dividendYield: 5.68,
        dividendYear: 2022,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksValues({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/aftertrading/peratio_analysis/pera_result.php?d=112%2F01%2F01&o=json',
      );
      expect(stocks).toBe(null);
    });
  });

  describe('.fetchStocksMarginTrades()', () => {
    it('should fetch stocks values for the given date', async () => {
      const data = require('../fixtures/otc-stocks-margin-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksMarginTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?d=112%2F01%2F30&o=json',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        market: 'OTC',
        symbol: '00679B',
        name: '元大美債20年',
        marginBuy: 57,
        marginSell: 17,
        marginRedeem: 1,
        marginBalancePrev: 1104,
        marginBalance: 1143,
        marginQuota: 370423,
        shortBuy: 0,
        shortSell: 0,
        shortRedeem: 0,
        shortBalancePrev: 49,
        shortBalance: 49,
        shortQuota: 370423,
        offset: 0,
        note: '',
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksMarginTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?d=112%2F01%2F01&o=json',
      );
      expect(stocks).toBe(null);
    });
  });

  describe('.fetchIndicesHistorical()', () => {
    it('should fetch indices historical data for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-indices-historical.html').toString();
      mockAxios.get.mockResolvedValueOnce({ data });

      const indices = await scraper.fetchIndicesHistorical({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/iNdex_info/minute_index/1MIN_print.php?d=112%2F01%2F30',
      );
      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[indices.length - 1]).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        market: 'OTC',
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
      const data = fs.readFileSync('./test/fixtures/otc-indices-historical-no-data.html').toString();
      mockAxios.get.mockResolvedValueOnce({ data });

      const indices = await scraper.fetchIndicesHistorical({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/iNdex_info/minute_index/1MIN_print.php?d=112%2F01%2F01',
      );
      expect(indices).toBe(null);
    });
  });
});
