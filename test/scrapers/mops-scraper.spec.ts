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
    it('should fetch stocks quarterly EPS', async () => {
      const data = fs.readFileSync('./test/fixtures/mops-tse-stocks-eps.html');
      mockAxios.post.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksEps({ market: 'TSE', year: 2023, quarter: 1 });
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
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({ symbol: '1101', name: '台泥', eps: 0.2, year: 2023, quarter: 1 });
    });
  });

  describe('.fetchStocksRevenue()', () => {
    it('should fetch stocks monthly revenue', async () => {
      const data = fs.readFileSync('./test/fixtures/mops-tse-stocks-revenue.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksRevenue({ market: 'TSE', year: 2023, month: 1 });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://mops.twse.com.tw/nas/t21/sii/t21sc03_112_1_0.html',
        { responseType: 'arraybuffer' },
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({ symbol: '1101', name: '台泥', revenue: 7325221, year: 2023, month: 1 });
    });
  });
});
