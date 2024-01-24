import mockAxios from 'jest-mock-axios';
import { MisTwseScraper } from '../../src/scrapers/mis-twse-scraper';
import { Ticker } from '../../src/interfaces';

describe('MisTwseScraper', () => {
  let scraper: MisTwseScraper;

  beforeEach(() => {
    scraper = new MisTwseScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchListedIndices()', () => {
    it('should fetch listed indices for TWSE listed', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/mis-twse-twse-listed-indices.json') });

      const data = await scraper.fetchListedIndices({ exchange: 'TWSE' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=tse&i=TIDX',
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
        symbol: 'IX0001',
        name: '發行量加權股價指數',
        exchange: 'TWSE',
        ex_ch: 'tse_t00.tw',
      });
    });

    it('should fetch listed indices for TPEx listed', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/mis-twse-tpex-listed-indices.json') });

      const data = await scraper.fetchListedIndices({ exchange: 'TPEx' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=otc&i=OIDX',
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
        symbol: 'IX0043',
        name: '櫃買指數',
        exchange: 'TPEx',
        ex_ch: 'otc_o00.tw',
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const indices = await scraper.fetchListedIndices({ exchange: 'TWSE' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getCategory.jsp?ex=tse&i=TIDX',
      );
      expect(indices).toBe(null);
    });
  });

  describe('.fetchStocksQuote()', () => {
    it('should fetch stocks realtime quote', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/mis-twse-stocks-quote.json') });

      const data = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', exchange: 'TWSE' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-12-29',
        symbol: '2330',
        name: '台積電',
        referencePrice: 593,
        limitUpPrice: 652,
        limitDownPrice: 534,
        openPrice: 589,
        highPrice: 593,
        lowPrice: 589,
        lastPrice: 593,
        lastSize: 4174,
        totalVoluem: 18323,
        bidPrice: [ 592, 591, 590, 589, 588 ],
        askPrice: [ 593, 594, 595, 596, 597 ],
        bidSize: [ 827, 768, 1137, 554, 446 ],
        askSize: [ 1938, 1465, 2925, 2407, 921 ],
        lastUpdated: 1703831400000,
      });
    });

    it('should fetch stocks realtime quote for intraday odd lot trading', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/mis-twse-stocks-quote-odd.json') });

      const data = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', exchange: 'TWSE' } as Ticker,
        odd: true,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getOddInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-12-29',
        symbol: '2330',
        name: '台積電',
        referencePrice: 593,
        limitUpPrice: 652,
        limitDownPrice: 534,
        openPrice: 591,
        highPrice: 592,
        lowPrice: 590,
        lastPrice: 592,
        lastSize: 4071,
        totalVoluem: 691301,
        bidPrice: [ 591, 590, 589, 588, 587 ],
        askPrice: [ 592, 593, 594, 595, 596 ],
        bidSize: [ 24250, 50380, 24188, 19587, 6608 ],
        askSize: [ 2084, 309022, 104913, 214679, 61672 ],
        lastUpdated: 1703827800000,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const data = await scraper.fetchStocksQuote({
        ticker: { symbol: '2330', exchange: 'TWSE' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_2330.tw',
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchIndicesQuote()', () => {
    it('should fetch indices realtime quote', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: require('../fixtures/mis-twse-indices-quote.json') });

      const data = await scraper.fetchIndicesQuote({
        ticker: { symbol: 'IX0001', exchange: 'TWSE', ex_ch: 'tse_t00.tw' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw',
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-12-29',
        symbol: 'IX0001',
        name: '發行量加權股價指數',
        previousClose: 17910.37,
        open: 17893.63,
        high: 17945.7,
        low: 17864.23,
        close: 17930.81,
        volume: 267204,
        lastUpdated: 1703827980000,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const data = await scraper.fetchIndicesQuote({
        ticker: { symbol: 'IX0001', exchange: 'TWSE', ex_ch: 'tse_t00.tw' } as Ticker,
      });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mis.twse.com.tw/stock/api/getStockInfo.jsp?ex_ch=tse_t00.tw',
      );
      expect(data).toBe(null);
    });
  });
});
