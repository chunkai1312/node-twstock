import * as fs from 'fs';
import * as cheerio from 'cheerio';
import mockAxios from 'jest-mock-axios';
import { TdccScraper } from '../../src/scrapers/tdcc-scraper';

describe('TdccScraper', () => {
  let scraper: TdccScraper;

  beforeEach(() => {
    scraper = new TdccScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchStocksHolders()', () => {
    it('should fetch stocks holders', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-get.html'),
        headers: { 'set-cookie': 'foobar' }
      });
      mockAxios.post.mockResolvedValueOnce({
        data: fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-post.html'),
        headers: { 'set-cookie': 'foobar' }
      });

      const url = 'https://www.tdcc.com.tw/portal/zh/smWeb/qryStock';
      const html = fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-get.html');
      const $ = cheerio.load(html);
      const form = new URLSearchParams({
        SYNCHRONIZER_TOKEN: $('#SYNCHRONIZER_TOKEN').attr('value') as string,
        SYNCHRONIZER_URI: $('#SYNCHRONIZER_URI').attr('value') as string,
        method: $('#method').attr('value') as string,
        firDate: $('#firDate').attr('value') as string,
        scaDate: '20231229',
        sqlMethod: 'StockNo',
        stockNo: '2330',
        stockName: '',
      });
      const data = await scraper.fetchStocksShareholders({ date: '2023-12-29', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(url);
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { headers: { 'Cookie': 'foobar' } });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-12-29',
        symbol: '2330',
        name: '台積電',
        shareholders: [
          {
            level: '1-999',
            holders: 731332,
            shares: 136341404,
            proportion: 0.52,
          },
          {
            level: '1,000-5,000',
            holders: 369064,
            shares: 708844322,
            proportion: 2.73,
          },
          {
            level: '5,001-10,000',
            holders: 44353,
            shares: 321629635,
            proportion: 1.24,
          },
          {
            level: '10,001-15,000',
            holders: 14786,
            shares: 182609499,
            proportion: 0.7,
          },
          {
            level: '15,001-20,000',
            holders: 7023,
            shares: 124658113,
            proportion: 0.48,
          },
          {
            level: '20,001-30,000',
            holders: 6851,
            shares: 168231335,
            proportion: 0.64,
          },
          {
            level: '30,001-40,000',
            holders: 3201,
            shares: 111283681,
            proportion: 0.42,
          },
          {
            level: '40,001-50,000',
            holders: 1917,
            shares: 86557380,
            proportion: 0.33,
          },
          {
            level: '50,001-100,000',
            holders: 3639,
            shares: 254768395,
            proportion: 0.98,
          },
          {
            level: '100,001-200,000',
            holders: 1832,
            shares: 255478566,
            proportion: 0.98,
          },
          {
            level: '200,001-400,000',
            holders: 1187,
            shares: 332874484,
            proportion: 1.28,
          },
          {
            level: '400,001-600,000',
            holders: 470,
            shares: 229494783,
            proportion: 0.88,
          },
          {
            level: '600,001-800,000',
            holders: 284,
            shares: 197512833,
            proportion: 0.76,
          },
          {
            level: '800,001-1,000,000',
            holders: 222,
            shares: 198593262,
            proportion: 0.76,
          },
          {
            level: '1,000,001以上',
            holders: 1545,
            shares: 22623193300,
            proportion: 87.24,
          },
          {
            level: '合　計',
            holders: 1187706,
            shares: 25932070992,
            proportion: 100,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-get.html'),
        headers: { 'set-cookie': 'foobar' }
      });
      mockAxios.post.mockResolvedValueOnce({
        data: fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-post-no-data.html'),
        headers: { 'set-cookie': 'foobar' }
      });

      const url = 'https://www.tdcc.com.tw/portal/zh/smWeb/qryStock';
      const html = fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-get.html');
      const $ = cheerio.load(html);
      const form = new URLSearchParams({
        SYNCHRONIZER_TOKEN: $('#SYNCHRONIZER_TOKEN').attr('value') as string,
        SYNCHRONIZER_URI: $('#SYNCHRONIZER_URI').attr('value') as string,
        method: $('#method').attr('value') as string,
        firDate: $('#firDate').attr('value') as string,
        scaDate: '20230101',
        sqlMethod: 'StockNo',
        stockNo: '2330',
        stockName: '',
      });
      const data = await scraper.fetchStocksShareholders({ date: '2023-01-01', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(url);
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { headers: { 'Cookie': 'foobar' } });
      expect(data).toBe(null);
    });
  });
});
