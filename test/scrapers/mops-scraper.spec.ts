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
    it('should fetch TWSE listed stocks quarterly EPS', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-twse-stocks-eps.html') });

      const data = await scraper.fetchStocksEps({ exchange: 'TWSE', year: 2023, quarter: 1 });
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

    it('should fetch TWSE listed stocks quarterly EPS for the specified stock', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-twse-stocks-eps.html') });

      const data = await scraper.fetchStocksEps({ exchange: 'TWSE', year: 2023, quarter: 1, symbol: '2330' });
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
        exchange: 'TWSE',
        symbol: '2330',
        name: '台積電',
        eps: 7.98,
        year: 2023,
        quarter: 1,
      });
    });

    it('should return null when no data is available for TWSE listed', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-twse-stocks-eps-no-data.html') });

      const data = await scraper.fetchStocksEps({ exchange: 'TWSE', year: 2024, quarter: 1, symbol: '2330' });
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

    it('should fetch TPEx listed stocks quarterly EPS', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-tpex-stocks-eps.html') });

      const data = await scraper.fetchStocksEps({ exchange: 'TPEx', year: 2023, quarter: 1 });
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

    it('should fetch TPEx listed stocks quarterly EPS for the specified stock', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-tpex-stocks-eps.html') });

      const data = await scraper.fetchStocksEps({ exchange: 'TPEx', year: 2023, quarter: 1, symbol: '6488' });
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
        exchange: 'TPEx',
        symbol: '6488',
        name: '環球晶',
        eps: 11.49,
        year: 2023,
        quarter: 1,
      });
    });

    it('should return null when no data is available for TPEx listed', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-tpex-stocks-eps-no-data.html') });

      const data = await scraper.fetchStocksEps({ exchange: 'TPEx', year: 2024, quarter: 1, symbol: '2330' });
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
    it('should fetch TWSE listed stocks monthly revenue', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-twse-stocks-revenue.html') });

      const data = await scraper.fetchStocksRevenue({ exchange: 'TWSE', year: 2023, month: 1 });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/sii/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch TWSE listed stocks monthly revenue for the specified stock', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-twse-stocks-revenue.html') });

      const data = await scraper.fetchStocksRevenue({ exchange: 'TWSE', year: 2023, month: 1, symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/sii/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        exchange: 'TWSE',
        symbol: '2330',
        name: '台積電',
        revenue: 200050544,
        year: 2023,
        month: 1,
      });
    });

    it('should return null when no data is available for TWSE listed', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-twse-stocks-revenue-no-data.html') });

      const data = await scraper.fetchStocksRevenue({ exchange: 'TWSE', year: 2024, month: 1, symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/sii/t21sc03_113_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBe(null);
    });

    it('should fetch TPEx listed stocks monthly revenue', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-tpex-stocks-revenue.html') });

      const data = await scraper.fetchStocksRevenue({ exchange: 'TPEx', year: 2023, month: 1 });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/otc/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
    });

    it('should fetch TPEx listed stocks monthly revenue for the specified stock', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-tpex-stocks-revenue.html') });

      const data = await scraper.fetchStocksRevenue({ exchange: 'TPEx', year: 2023, month: 1, symbol: '6488' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/otc/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data).toEqual({
        exchange: 'TPEx',
        symbol: '6488',
        name: '環球晶',
        revenue: 5929796,
        year: 2023,
        month: 1,
      });
    });

    it('should return null when no data is available for TPEx listed', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/mops-twse-stocks-revenue-no-data.html') });

      const data = await scraper.fetchStocksRevenue({ exchange: 'TPEx', year: 2024, month: 1, symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/otc/t21sc03_113_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBe(null);
    });
  });
});
