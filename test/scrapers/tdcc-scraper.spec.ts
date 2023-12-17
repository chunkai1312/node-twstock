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
      const getPage = fs.readFileSync('./test/fixtures/tdcc-stocks-holders-get.html');
      mockAxios.get.mockResolvedValueOnce({
        data: getPage,
        headers: { 'set-cookie': 'foobar' }
      });
      const postPage = fs.readFileSync('./test/fixtures/tdcc-stocks-holders-post.html');
      mockAxios.post.mockResolvedValueOnce({
        data: postPage,
        headers: { 'set-cookie': 'foobar' }
      });

      const url = 'https://www.tdcc.com.tw/portal/zh/smWeb/qryStock';
      const $ = cheerio.load(getPage);
      const form = new URLSearchParams({
        SYNCHRONIZER_TOKEN: $('#SYNCHRONIZER_TOKEN').attr('value') as string,
        SYNCHRONIZER_URI: $('#SYNCHRONIZER_URI').attr('value') as string,
        method: $('#method').attr('value') as string,
        firDate: $('#firDate').attr('value') as string,
        scaDate: '20221230',
        sqlMethod: 'StockNo',
        stockNo: '2330',
        stockName: '',
      });

      const stock = await scraper.fetchStocksHolders({ date: '2022-12-30', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(url);
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { headers: { 'Cookie': 'foobar' } });
      expect(stock).toBeDefined();
      expect(stock).toEqual({
        date: '2022-12-30',
        symbol: '2330',
        name: '台積電',
        data: [
          {
            level: '1-999',
            holders: 891264,
            shares: 166263025,
            proportion: 0.64
          },
          {
            level: '1,000-5,000',
            holders: 474847,
            shares: 908747643,
            proportion: 3.5
          },
          {
            level: '5,001-10,000',
            holders: 53563,
            shares: 388466934,
            proportion: 1.49
          },
          {
            level: '10,001-15,000',
            holders: 17291,
            shares: 213713625,
            proportion: 0.82
          },
          {
            level: '15,001-20,000',
            holders: 8087,
            shares: 143283211,
            proportion: 0.55
          },
          {
            level: '20,001-30,000',
            holders: 7573,
            shares: 185964113,
            proportion: 0.71
          },
          {
            level: '30,001-40,000',
            holders: 3510,
            shares: 122286105,
            proportion: 0.47
          },
          {
            level: '40,001-50,000',
            holders: 2014,
            shares: 91016746,
            proportion: 0.35
          },
          {
            level: '50,001-100,000',
            holders: 3868,
            shares: 269893313,
            proportion: 1.04
          },
          {
            level: '100,001-200,000',
            holders: 1969,
            shares: 273285995,
            proportion: 1.05
          },
          {
            level: '200,001-400,000',
            holders: 1151,
            shares: 323991208,
            proportion: 1.24
          },
          {
            level: '400,001-600,000',
            holders: 478,
            shares: 230533243,
            proportion: 0.88
          },
          {
            level: '600,001-800,000',
            holders: 302,
            shares: 208633842,
            proportion: 0.8
          },
          {
            level: '800,001-1,000,000',
            holders: 225,
            shares: 202876066,
            proportion: 0.78
          },
          {
            level: '1,000,001以上',
            holders: 1458,
            shares: 22201425389,
            proportion: 85.61
          },
          {
            level: '合　計',
            holders: 1467600,
            shares: 25930380458,
            proportion: 100
          }
        ]
      });
    });

    it('should return null when no data is available', async () => {
      const getPage = fs.readFileSync('./test/fixtures/tdcc-stocks-holders-get.html');
      mockAxios.get.mockResolvedValueOnce({
        data: getPage,
        headers: { 'set-cookie': 'foobar' }
      });
      const postPage = fs.readFileSync('./test/fixtures/tdcc-stocks-holders-post-no-data.html');
      mockAxios.post.mockResolvedValueOnce({
        data: postPage,
        headers: { 'set-cookie': 'foobar' }
      });

      const url = 'https://www.tdcc.com.tw/portal/zh/smWeb/qryStock';
      const $ = cheerio.load(getPage);
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

      const stock = await scraper.fetchStocksHolders({ date: '2023-01-01', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(url);
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { headers: { 'Cookie': 'foobar' } });
      expect(stock).toBe(null);
    });
  });
});
