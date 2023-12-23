import * as fs from 'fs';
import mockAxios from 'jest-mock-axios';
import { MopsScraper } from '../../src/scrapers/mops-scraper';

describe('MopsScraper', () => {
  let scraper: MopsScraper;

  beforeEach(() => {
    scraper = new MopsScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchStocksEps()', () => {
    it('should fetch TSE stocks quarterly EPS', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tse-stocks-eps.html') });

      const data = await scraper.fetchStocksEps({ market: 'TSE', year: 2023, quarter: 1 });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/mops/web/t163sb04',
        new URLSearchParams({
          encodeURIComponent: '1',
          step: '1',
          firstin: '1',
          off: '1',
          isQuery: 'Y',
          TYPEK: 'sii',
          year: '112',
          season: '01',
        }),
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch TSE stocks quarterly EPS for the specified stock', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tse-stocks-eps.html') });

      const data = await scraper.fetchStocksEps({ market: 'TSE', year: 2023, quarter: 1, symbol: '2330' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/mops/web/t163sb04',
        new URLSearchParams({
          encodeURIComponent: '1',
          step: '1',
          firstin: '1',
          off: '1',
          isQuery: 'Y',
          TYPEK: 'sii',
          year: '112',
          season: '01',
        }),
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        symbol: '2330',
        name: '台積電',
        eps: 7.98,
        year: 2023,
        quarter: 1,
      });
    });

    it('should return null when no data is available for TSE stocks', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tse-stocks-eps-no-data.html') });

      const data = await scraper.fetchStocksEps({ market: 'TSE', year: 2024, quarter: 1, symbol: '2330' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/mops/web/t163sb04',
        new URLSearchParams({
          encodeURIComponent: '1',
          step: '1',
          firstin: '1',
          off: '1',
          isQuery: 'Y',
          TYPEK: 'sii',
          year: '113',
          season: '01',
        }),
      );
      expect(data).toBe(null);
    });

    it('should fetch OTC stocks quarterly EPS', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/otc-stocks-eps.html') });

      const data = await scraper.fetchStocksEps({ market: 'OTC', year: 2023, quarter: 1 });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/mops/web/t163sb04',
        new URLSearchParams({
          encodeURIComponent: '1',
          step: '1',
          firstin: '1',
          off: '1',
          isQuery: 'Y',
          TYPEK: 'otc',
          year: '112',
          season: '01',
        }),
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch OTC stocks quarterly EPS for the specified stock', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/otc-stocks-eps.html') });

      const data = await scraper.fetchStocksEps({ market: 'OTC', year: 2023, quarter: 1, symbol: '6488' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/mops/web/t163sb04',
        new URLSearchParams({
          encodeURIComponent: '1',
          step: '1',
          firstin: '1',
          off: '1',
          isQuery: 'Y',
          TYPEK: 'otc',
          year: '112',
          season: '01',
        }),
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        symbol: '6488',
        name: '環球晶',
        eps: 11.49,
        year: 2023,
        quarter: 1,
      });
    });

    it('should return null when no data is available for OTC stocks', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/otc-stocks-eps-no-data.html') });

      const data = await scraper.fetchStocksEps({ market: 'OTC', year: 2024, quarter: 1, symbol: '2330' });
      expect(mockAxios.post).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/mops/web/t163sb04',
        new URLSearchParams({
          encodeURIComponent: '1',
          step: '1',
          firstin: '1',
          off: '1',
          isQuery: 'Y',
          TYPEK: 'otc',
          year: '113',
          season: '01',
        }),
      );
      expect(data).toBe(null);
    });
  });

  describe('.fetchStocksRevenue()', () => {
    it('should fetch TSE stocks monthly revenue', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tse-stocks-revenue.html') });

      const data = await scraper.fetchStocksRevenue({ market: 'TSE', year: 2023, month: 1 });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/sii/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch TSE stocks monthly revenue for the specified stock', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tse-stocks-revenue.html') });

      const data = await scraper.fetchStocksRevenue({ market: 'TSE', year: 2023, month: 1, symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/sii/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        symbol: '2330',
        name: '台積電',
        revenue: 200050544,
        year: 2023,
        month: 1,
      });
    });

    it('should return null when no data is available for TSE stocks', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tse-stocks-revenue-no-data.html') });

      const data = await scraper.fetchStocksRevenue({ market: 'TSE', year: 2024, month: 1, symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/sii/t21sc03_113_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBe(null);
    });

    it('should fetch OTC stocks monthly revenue', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/otc-stocks-revenue.html') });

      const data = await scraper.fetchStocksRevenue({ market: 'OTC', year: 2023, month: 1 });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/otc/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch OTC stocks monthly revenue for the specified stock', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/otc-stocks-revenue.html') });

      const data = await scraper.fetchStocksRevenue({ market: 'OTC', year: 2023, month: 1, symbol: '6488' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/otc/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        symbol: '6488',
        name: '環球晶',
        revenue: 5929796,
        year: 2023,
        month: 1,
      });
    });

    it('should return null when no data is available for OTC stocks', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/tse-stocks-revenue-no-data.html') });

      const data = await scraper.fetchStocksRevenue({ market: 'OTC', year: 2024, month: 1, symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/otc/t21sc03_113_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBe(null);
    });
  });
});
