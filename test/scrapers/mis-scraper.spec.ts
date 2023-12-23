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
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/tse-listed-indices.json') });

      const data = await scraper.fetchListedIndices({ market: 'TSE' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=tse&i=TIDX',
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
        symbol: 'IX0001',
        exchange: 'TWSE',
        market: 'TSE',
        name: '發行量加權股價指數',
        ex_ch: 'tse_t00.tw',
      });
    });

    it('should fetch listed indices for OTC market', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/otc-listed-indices.json') });

      const data = await scraper.fetchListedIndices({ market: 'OTC' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=otc&i=OIDX',
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
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
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/stocks-quote.json') });

      const data = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', market: 'TSE' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-12-22',
        symbol: '2330',
        name: '台積電',
        referencePrice: 577,
        limitUpPrice: 634,
        limitDownPrice: 520,
        openPrice: 582,
        highPrice: 582,
        lowPrice: 579,
        lastPrice: 582,
        lastSize: 2767,
        totalVoluem: 18668,
        bidPrice: [ 581, 580, 579, 578, 577 ],
        askPrice: [ 582, 583, 584, 585, 586 ],
        bidSize: [ 66, 450, 793, 485, 531 ],
        askSize: [ 1923, 1158, 980, 1884, 806 ],
        lastUpdated: 1703226600000,
      });
    });

    it('should fetch stocks realtime quote for intraday odd lot trading', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/stocks-quote-odd.json') });

      const data = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', market: 'TSE' } as Ticker,
        odd: true,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getOddInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-12-22',
        symbol: '2330',
        name: '台積電',
        referencePrice: 577,
        limitUpPrice: 634,
        limitDownPrice: 520,
        openPrice: 579,
        highPrice: 581,
        lowPrice: 579,
        lastPrice: 581,
        lastSize: 1635,
        totalVoluem: 345088,
        bidPrice: [ 580, 579, 578, 577, 576 ],
        askPrice: [ 581, 582, 583, 584, 585 ],
        bidSize: [ 1974, 10072, 10187, 18238, 8493 ],
        askSize: [ 97522, 87416, 37287, 28424, 131012 ],
        lastUpdated: 1703223000000,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const data = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', market: 'TSE' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchIndicesQuote()', () => {
    it('should fetch indices realtime quote', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/indices-quote.json') });

      const data = await scraper.fetchIndicesQuote({
        ticker: { symbol: 'IX0001', market: 'TSE', alias: 't00' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-12-22',
        symbol: 'IX0001',
        name: '發行量加權股價指數',
        previousClose: 17543.74,
        open: 17586.16,
        high: 17618.17,
        low: 17567.55,
        close: 17596.63,
        volume: 288289,
        lastUpdated: 1703223180000,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const data = await scraper.fetchIndicesQuote({
        ticker: { symbol: 'IX0001', market: 'TSE', alias: 't00' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw',
      );
      expect(data).toBe(null);
    });
  });
});
