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

  describe('.fetchStocksFiniHoldings()', () => {
    it('should fetch stocks FINI holdings for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-stocks-fini-holdings.html');
      mockAxios.post.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksFiniHoldings({ date: '2023-01-30' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/server-java/t13sa150_otc',
        new URLSearchParams({ years: '2023', months: '01', days: '30', bcode: '', step: '2' }),
        { responseType: 'arraybuffer' },
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TPEx',
        market: 'OTC',
        symbol: '006201',
        name: '元大富櫃50',
        issuedShares: 21446000,
        availableShares: 21350560,
        sharesHeld: 95440,
        availablePercent: 99.55,
        heldPercent: 0.44,
        upperLimitPercent: 100,
      });
    });

    it('should return null when no data is available', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-stocks-fini-holdings-empty.html');
      mockAxios.post.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksFiniHoldings({ date: '2023-01-01' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/server-java/t13sa150_otc',
        new URLSearchParams({ years: '2023', months: '01', days: '01', bcode: '', step: '2' }),
        { responseType: 'arraybuffer' },
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

  describe('.fetchMarketTrades()', () => {
    it('should fetch market trades for the given date', async () => {
      const data = require('../fixtures/otc-market-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const market = await scraper.fetchMarketTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_index/st41_result.php?d=112%2F01%2F30&o=json',
      );
      expect(market).toBeDefined();
      expect(market).toEqual({
        date: '2023-01-30',
        tradeVolume: 630687778,
        tradeValue: 62678685445,
        transaction: 471626,
        index: 193.23,
        change: 4.73,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const market = await scraper.fetchMarketTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_index/st41_result.php?d=112%2F01%2F01&o=json',
      );
      expect(market).toBe(null);
    });
  });

  describe('.fetchMarketBreadth()', () => {
    it('should fetch market breadth for the given date', async () => {
      const data = require('../fixtures/otc-market-breadth.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const market = await scraper.fetchMarketBreadth({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/aftertrading/market_highlight/highlight_result.php?d=112%2F01%2F30&o=json',
      );
      expect(market).toBeDefined();
      expect(market).toEqual({
        date: '2023-01-30',
        up: 591,
        limitUp: 10,
        down: 135,
        limitDown: 0,
        unchanged: 69,
        unmatched: 14,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const market = await scraper.fetchMarketBreadth({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/aftertrading/market_highlight/highlight_result.php?d=112%2F01%2F01&o=json',
      );
      expect(market).toBe(null);
    });
  });

  describe('.fetchMarketInstTrades()', () => {
    it('should fetch market breadth for the given date', async () => {
      const data = require('../fixtures/otc-market-inst-trades.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const market = await scraper.fetchMarketInstTrades({ date: '2023-01-30' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/3insti/3insti_summary/3itrdsum_result.php?d=112%2F01%2F30&t=D&o=json',
      );
      expect(market).toBeDefined();
      expect(market).toEqual({
        date: '2023-01-30',
        finiWithoutDealersBuy: 20112958447,
        finiWithoutDealersSell: 16591758807,
        finiWithoutDealersNetBuySell: 3521199640,
        finiDealersBuy: 0,
        finiDealersSell: 0,
        finiDealersNetBuySell: 0,
        finiBuy: 20112958447,
        finiSell: 16591758807,
        finiNetBuySell: 3521199640,
        sitcBuy: 1543494365,
        sitcSell: 579611355,
        sitcNetBuySell: 963883010,
        dealersForProprietaryBuy: 1180899990,
        dealersForProprietarySell: 450809569,
        dealersForProprietaryNetBuySell: 730090421,
        dealersForHedgingBuy: 903027569,
        dealersForHedgingSell: 312306870,
        dealersForHedgingNetBuySell: 590720699,
        dealersBuy: 2083927559,
        dealersSell: 763116439,
        dealersNetBuySell: 1320811120,
        totalInstInvestorsBuy: 23740380371,
        totalInstInvestorsSell: 17934486601,
        totalInstInvestorsNetBuySell: 5805893770,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const market = await scraper.fetchMarketInstTrades({ date: '2023-01-01' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://www.tpex.org.tw/web/stock/3insti/3insti_summary/3itrdsum_result.php?d=112%2F01%2F01&t=D&o=json',
      );
      expect(market).toBe(null);
    });
  });
});
