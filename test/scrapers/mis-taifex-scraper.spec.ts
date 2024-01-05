import mockAxios from 'jest-mock-axios';
import { MisTaifexScraper } from '../../src/scrapers/mis-taifex-scraper';
import { Ticker } from '../../src/interfaces';

describe('MisTaifexScraper', () => {
  let scraper: MisTaifexScraper;

  beforeEach(() => {
    scraper = new MisTaifexScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchListedFutOpt()', () => {
    it('should fetch listed futures & options', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: require('../fixtures/taifex-listed-futopt.json') });

      const data = await scraper.fetchListedFutOpt();
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mis.taifex.com.tw/futures/api/getCmdyDDLItemByKind',
        JSON.stringify({ SymbolType: undefined }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should fetch listed futures', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: require('../fixtures/taifex-listed-futures.json') });

      const data = await scraper.fetchListedFutOpt({ type: 'F' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mis.taifex.com.tw/futures/api/getCmdyDDLItemByKind',
        JSON.stringify({ SymbolType: 'F' }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should fetch listed options', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: require('../fixtures/taifex-listed-options.json') });

      const data = await scraper.fetchListedFutOpt({ type: 'O' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mis.taifex.com.tw/futures/api/getCmdyDDLItemByKind',
        JSON.stringify({ SymbolType: 'O' }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });
  });

  describe('.fetchFutOptQuote()', () => {
    it('should fetch futures realtime quote', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: require('../fixtures/futures-quote.json') });

      const data = await scraper.fetchFutOptQuote({
        ticker: {
          symbol: 'TXFA4',
          name: '臺股期貨2024/01',
          exchange: 'TAIFEX',
          market: 'FUTOPT',
          type: '臺股期貨',
          industry: '00',
          listedDate: '2023-10-19',
        } as Ticker,
      });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mis.taifex.com.tw/futures/api/getQuoteDetail',
        JSON.stringify({ SymbolID: ['TXFA4-F'] }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        symbol: 'TXFA4',
        name: '臺股期貨2024/01',
        referencePrice: 17870,
        limitUpPrice: 19657,
        limitDownPrice: 16083,
        openPrice: 17838,
        highPrice: 17920,
        lowPrice: 17751,
        lastPrice: 17798,
        lastSize: 3,
        testPrice: 17831,
        testSize: 256,
        testTime: 1704156295000,
        totalVoluem: 116498,
        openInterest: 103404,
        bidOrders: 67979,
        askOrders: 66456,
        bidVolume: 124038,
        askVolume: 124080,
        bidPrice: [ 17798, 17797, 17796, 17795, 17794 ],
        askPrice: [ 17800, 17801, 17802, 17803, 17804 ],
        bidSize: [ 31, 26, 38, 24, 18 ],
        askSize: [ 6, 16, 30, 18, 22 ],
        extBidPrice: 17795,
        extAskPrice: 0,
        extBidSize: 2,
        extAskSize: 0,
        lastUpdated: 1704174299000,
      });
    });

    it('should fetch futures realtime quote for afterhours trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: require('../fixtures/futures-quote-afterhours.json') });

      const data = await scraper.fetchFutOptQuote({
        ticker: {
          symbol: 'TXFA4',
          name: '臺股期貨2024/01',
          exchange: 'TAIFEX',
          market: 'FUTOPT',
          type: '臺股期貨',
          industry: '00',
          listedDate: '2023-10-19',
        } as Ticker,
        afterhours: true,
      });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mis.taifex.com.tw/futures/api/getQuoteDetail',
        JSON.stringify({ SymbolID: ['TXFA4-M'] }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        symbol: 'TXFA4',
        name: '臺股期貨2024/01',
        referencePrice: 17800,
        limitUpPrice: 19580,
        limitDownPrice: 16020,
        openPrice: 17793,
        highPrice: 17817,
        lowPrice: 17791,
        lastPrice: 17804,
        lastSize: 1,
        testPrice: 17792,
        testSize: 40,
        testTime: 1704178795000,
        totalVoluem: 4184,
        openInterest: '',
        bidOrders: 3431,
        askOrders: 3526,
        bidVolume: 7171,
        askVolume: 7191,
        bidPrice: [ 17804, 17803, 17802, 17801, 17800 ],
        askPrice: [ 17805, 17806, 17807, 17808, 17809 ],
        bidSize: [ 4, 27, 40, 32, 61 ],
        askSize: [ 14, 35, 44, 54, 25 ],
        extBidPrice: 17801,
        extAskPrice: 17805,
        extBidSize: 2,
        extAskSize: 1,
        lastUpdated: 1704187402000,
      });
    });

    it('should fetch options realtime quote', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: require('../fixtures/options-quote.json') });

      const data = await scraper.fetchFutOptQuote({
        ticker: {
          symbol: 'TX118000A4',
          name: '臺指選擇權,2024/01,履約價18000,買權',
          exchange: 'TAIFEX',
          market: 'FUTOPT',
          type: '臺指選擇權買權',
          industry: '00',
          listedDate: '2023-12-20'
        } as Ticker,
      });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mis.taifex.com.tw/futures/api/getQuoteDetail',
        JSON.stringify({ SymbolID: ['TX118000A4-O'] }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        symbol: 'TX118000A4',
        name: '臺指選擇權,2024/01,履約價18000,買權',
        referencePrice: 30.5,
        limitUpPrice: 1820,
        limitDownPrice: 0.1,
        openPrice: 13.5,
        highPrice: 29,
        lowPrice: 1.5,
        lastPrice: 2.6,
        lastSize: 25,
        testPrice: 13.5,
        testSize: 18,
        testTime: 1704156295000,
        totalVoluem: 63256,
        openInterest: 20036,
        bidOrders: 8406,
        askOrders: 7963,
        bidVolume: 61019,
        askVolume: 61561,
        bidPrice: [ 2.5, 2.3, 2.2, 2.1, 2 ],
        askPrice: [ 2.8, 2.9, 3, 3.1, 3.2 ],
        bidSize: [ 17, 1, 2, 17, 12 ],
        askSize: [ 3, 4, 7, 8, 3 ],
        extBidPrice: '',
        extAskPrice: '',
        extBidSize: '',
        extAskSize: '',
        lastUpdated: 1704174294000,
      });
    });

    it('should fetch options realtime quote for afterhours trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: require('../fixtures/options-quote-afterhours.json') });

      const data = await scraper.fetchFutOptQuote({
        ticker: {
          symbol: 'TX118000A4',
          name: '臺指選擇權,2024/01,履約價18000,買權',
          exchange: 'TAIFEX',
          market: 'FUTOPT',
          type: '臺指選擇權買權',
          industry: '00',
          listedDate: '2023-12-20'
        } as Ticker,
        afterhours: true,
      });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mis.taifex.com.tw/futures/api/getQuoteDetail',
        JSON.stringify({ SymbolID: ['TX118000A4-N'] }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        symbol: 'TX118000A4',
        name: '臺指選擇權,2024/01,履約價18000,買權',
        referencePrice: 2.6,
        limitUpPrice: 1780,
        limitDownPrice: 0.1,
        openPrice: 2.8,
        highPrice: 3.4,
        lowPrice: 2,
        lastPrice: 2.5,
        lastSize: 1,
        testPrice: 0,
        testSize: 0,
        testTime: '',
        totalVoluem: 2794,
        openInterest: '',
        bidOrders: 284,
        askOrders: 391,
        bidVolume: 3014,
        askVolume: 4082,
        bidPrice: [ 2.4, 2.3, 2.2, 2.1, 2 ],
        askPrice: [ 2.6, 2.7, 2.8, 2.9, 3 ],
        bidSize: [ 4, 97, 24, 5, 7 ],
        askSize: [ 99, 35, 24, 7, 14 ],
        extBidPrice: '',
        extAskPrice: '',
        extBidSize: '',
        extAskSize: '',
        lastUpdated: 1704188352000,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: {} });

      const data = await scraper.fetchFutOptQuote({
        ticker: {
          symbol: 'TXFA4',
          name: '臺股期貨2024/01',
          exchange: 'TAIFEX',
          market: 'FUTOPT',
          type: '臺股期貨',
          industry: '00',
          listedDate: '2023-10-19',
        } as Ticker,
      });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mis.taifex.com.tw/futures/api/getQuoteDetail',
        JSON.stringify({ SymbolID: ['TXFA4-F'] }),
        { headers: { 'Content-Type': 'application/json' } },
      );
      expect(data).toBe(null);
    });
  });
});
