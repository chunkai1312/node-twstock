import mockAxios from 'jest-mock-axios';
import { MisScraper } from '../../src/scrapers/mis-scraper';
import { Ticker } from '../../src/interfaces';

describe('TpexScraper', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchStocksHistorical()', () => {
    it('should fetch listed indices for TSE market', async () => {
      const data = require('../fixtures/tse-listed-indices.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new MisScraper();
      const indices = await scraper.fetchListedIndices({ market: 'TSE' });

      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0]).toEqual({
        name: '發行量加權股價指數',
        ex_ch: 'tse_t00.tw',
      });
    });

    it('should fetch listed indices for OTC market', async () => {
      const data = require('../fixtures/otc-listed-indices.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new MisScraper();
      const indices = await scraper.fetchListedIndices({ market: 'OTC' });

      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0]).toEqual({
        name: '櫃買指數',
        ex_ch: 'otc_o00.tw',
      });
    });
  });

  describe('.fetchStocksQuote()', () => {
    it('should fetch stocks realtime quote', async () => {
      const data = require('../fixtures/stocks-quote.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new MisScraper();
      const stocks = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', market: 'TSE' } as Ticker,
      });

      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-12-05',
        symbol: '2330',
        name: '台積電',
        referencePrice: 574,
        limitUpPrice: 631,
        limitDownPrice: 517,
        openPrice: 571,
        highPrice: 572,
        lowPrice: 567,
        lastPrice: 570,
        lastSize: 4585,
        totalVoluem: 22175,
        bidPrice: [ 570, 569, 568, 567, 566 ],
        askPrice: [ 571, 572, 573, 574, 575 ],
        bidSize: [ 126, 174, 574, 1627, 1198 ],
        askSize: [ 456, 494, 335, 2383, 176 ],
        lastUpdated: 1701757800000,
      });
    });

    it('should fetch stocks realtime quote for intraday odd lot trading', async () => {
      const data = require('../fixtures/stocks-quote-odd.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new MisScraper();
      const stocks = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', market: 'TSE' } as Ticker,
        odd: true,
      });

      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        date: '2023-12-05',
        symbol: '2330',
        name: '台積電',
        referencePrice: 574,
        limitUpPrice: 631,
        limitDownPrice: 517,
        openPrice: 570,
        highPrice: 570,
        lowPrice: 568,
        lastPrice: 570,
        lastSize: null,
        totalVoluem: 639807,
        bidPrice: [ 569, 568, 567, 566, 565 ],
        askPrice: [ 570, 571, 572, 573, 574 ],
        bidSize: [ 19341, 244834, 134008, 68495, 112109 ],
        askSize: [ 902, 10260, 7201, 2870, 10048 ],
        lastUpdated: 1701754200000,
      });
    });
  });

  describe('.fetchIndicesQuote()', () => {
    it('should fetch indices realtime quote', async () => {
      const data = require('../fixtures/indices-quote.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new MisScraper();
      const indices = await scraper.fetchIndicesQuote({
        ticker: { symbol: 'IX0001', market: 'TSE', alias: 't00' } as Ticker,
      });

      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0]).toEqual({
        date: '2023-12-05',
        symbol: 'IX0001',
        name: '發行量加權股價指數',
        previousClose: 17421.48,
        open: 17401.59,
        high: 17401.59,
        low: 17252.57,
        close: 17328.01,
        volume: 312526,
        lastUpdated: 1701754260000,
      });
    });
  });
});
