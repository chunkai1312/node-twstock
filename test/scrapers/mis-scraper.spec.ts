import mockAxios from 'jest-mock-axios';
import { MisScraper } from '../../src/scrapers/mis-scraper';
import { Ticker } from '../../src/interfaces';

describe('MisScraper', () => {
  let scraper: MisScraper;

  beforeEach(() => {
    scraper = new MisScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchListedIndices()', () => {
    it('should fetch listed indices for TSE market', async () => {
      const data = require('../fixtures/tse-listed-indices.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const indices = await scraper.fetchListedIndices({ market: 'TSE' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=tse&i=TIDX',
      );
      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0]).toEqual({
        symbol: 'IX0001',
        exchange: 'TWSE',
        market: 'TSE',
        name: '發行量加權股價指數',
        ex_ch: 'tse_t00.tw',
      });
    });

    it('should fetch listed indices for OTC market', async () => {
      const data = require('../fixtures/otc-listed-indices.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const indices = await scraper.fetchListedIndices({ market: 'OTC' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=otc&i=OIDX',
      );
      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0]).toEqual({
        symbol: 'IX0043',
        exchange: 'TPEx',
        market: 'OTC',
        name: '櫃買指數',
        ex_ch: 'otc_o00.tw',
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const indices = await scraper.fetchListedIndices({ market: 'TSE' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=tse&i=TIDX',
      );
      expect(indices).toBe(null);
    });
  });

  describe('.fetchStocksQuote()', () => {
    it('should fetch stocks realtime quote', async () => {
      const data = require('../fixtures/stocks-quote.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', market: 'TSE' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-12-08',
        symbol: '2330',
        name: '台積電',
        referencePrice: 566,
        limitUpPrice: 622,
        limitDownPrice: 510,
        openPrice: 574,
        highPrice: 577,
        lowPrice: 570,
        lastPrice: 570,
        lastSize: 4395,
        totalVoluem: 33424,
        bidPrice: [ 570, 569, 568, 567, 566 ],
        askPrice: [ 571, 572, 573, 574, 575 ],
        bidSize: [ 656, 859, 735, 546, 715 ],
        askSize: [ 332, 156, 427, 596, 707 ],
        lastUpdated: 1702013400000,
      });
    });

    it('should fetch stocks realtime quote for intraday odd lot trading', async () => {
      const data = require('../fixtures/stocks-quote-odd.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', market: 'TSE' } as Ticker,
        odd: true,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getOddInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-12-08',
        symbol: '2330',
        name: '台積電',
        referencePrice: 566,
        limitUpPrice: 622,
        limitDownPrice: 510,
        openPrice: 573,
        highPrice: 577,
        lowPrice: 570,
        lastPrice: 571,
        lastSize: 561,
        totalVoluem: 597764,
        bidPrice: [ 570, 569, 568, 567, 566 ],
        askPrice: [ 571, 572, 573, 574, 575 ],
        bidSize: [ 21098, 7026, 14262, 10103, 18657 ],
        askSize: [ 910, 4630, 8790, 12924, 30983 ],
        lastUpdated: 1702013400000,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const stocks = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', market: 'TSE' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(stocks).toBe(null);
    });
  });

  describe('.fetchIndicesQuote()', () => {
    it('should fetch indices realtime quote', async () => {
      const data = require('../fixtures/indices-quote.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const indices = await scraper.fetchIndicesQuote({
        ticker: { symbol: 'IX0001', market: 'TSE', alias: 't00' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw',
      );
      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0]).toEqual({
        date: '2023-12-08',
        symbol: 'IX0001',
        name: '發行量加權股價指數',
        previousClose: 17278.74,
        open: 17309.36,
        high: 17465.35,
        low: 17309.36,
        close: 17383.99,
        volume: 306114,
        lastUpdated: 1702013580000,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const indices = await scraper.fetchIndicesQuote({
        ticker: { symbol: 'IX0001', market: 'TSE', alias: 't00' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw',
      );
      expect(indices).toBe(null);
    });
  });
});
