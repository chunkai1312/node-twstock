import * as fs from 'fs';
import * as cheerio from 'cheerio';
import mockAxios from 'jest-mock-axios';
import { TdccScraper } from '../../src/scrapers/tdcc-scraper';
import { StockShareholders } from '../../src';

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
        data: fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-post-2303.html'),
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
        scaDate: '20241025',
        sqlMethod: 'StockNo',
        stockNo: '2303',
        stockName: '',
      });
      const data = await scraper.fetchStocksShareholders({ date: '2024-10-25', symbol: '2303' });
      expect(mockAxios.get).toHaveBeenCalledWith(url);
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { headers: { 'Cookie': 'foobar' } });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2024-10-25',
        symbol: '2303',
        shareholders: [
          { level: 1, holders: 201486, shares: 47916024, proportion: 0.38 },
          { level: 2, holders: 423252, shares: 926497493, proportion: 7.39 },
          { level: 3, holders: 78823, shares: 606124154, proportion: 4.83 },
          { level: 4, holders: 25003, shares: 315054387, proportion: 2.51 },
          { level: 5, holders: 14472, shares: 264495684, proportion: 2.11 },
          { level: 6, holders: 12166, shares: 306451622, proportion: 2.44 },
          { level: 7, holders: 5342, shares: 189771715, proportion: 1.51 },
          { level: 8, holders: 3218, shares: 148334732, proportion: 1.18 },
          { level: 9, holders: 5010, shares: 353757442, proportion: 2.82 },
          { level: 10, holders: 2054, shares: 283070535, proportion: 2.25 },
          { level: 11, holders: 823, shares: 231965707, proportion: 1.85 },
          { level: 12, holders: 254, shares: 125078832, proportion: 0.99 },
          { level: 13, holders: 136, shares: 94916211, proportion: 0.75 },
          { level: 14, holders: 92, shares: 83665649, proportion: 0.66 },
          { level: 15, holders: 608, shares: 8551366197, proportion: 68.25 },
          { level: 16, holders: null, shares: 0, proportion: 0 },
          { level: 17, holders: 772739, shares: 12528466384, proportion: 100 },
        ],
      });
    });

    it('should fetch stocks holders with difference adjustment', async () => {
      mockAxios.get.mockResolvedValueOnce({
        data: fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-get.html'),
        headers: { 'set-cookie': 'foobar' }
      });
      mockAxios.post.mockResolvedValueOnce({
        data: fs.readFileSync('./test/fixtures/tdcc-stocks-shareholders-post-2330.html'),
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
        scaDate: '20241025',
        sqlMethod: 'StockNo',
        stockNo: '2330',
        stockName: '',
      });
      const data = await scraper.fetchStocksShareholders({ date: '2024-10-25', symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(url);
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { headers: { 'Cookie': 'foobar' } });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2024-10-25',
        symbol: '2330',
        shareholders: [
          { level: 1, holders: 960910, shares: 147319215, proportion: 0.56 },
          { level: 2, holders: 337223, shares: 647931196, proportion: 2.49 },
          { level: 3, holders: 40892, shares: 296223356, proportion: 1.14 },
          { level: 4, holders: 14153, shares: 174406522, proportion: 0.67 },
          { level: 5, holders: 6711, shares: 118641299, proportion: 0.45 },
          { level: 6, holders: 6737, shares: 165024973, proportion: 0.63 },
          { level: 7, holders: 3181, shares: 110495161, proportion: 0.42 },
          { level: 8, holders: 1894, shares: 85501551, proportion: 0.32 },
          { level: 9, holders: 3759, shares: 262586941, proportion: 1.01 },
          { level: 10, holders: 1909, shares: 265381189, proportion: 1.02 },
          { level: 11, holders: 1265, shares: 353791243, proportion: 1.36 },
          { level: 12, holders: 547, shares: 269911145, proportion: 1.04 },
          { level: 13, holders: 321, shares: 224407805, proportion: 0.86 },
          { level: 14, holders: 204, shares: 184470065, proportion: 0.71 },
          { level: 15, holders: 1541, shares: 22626650581, proportion: 87.25 },
          { level: 16, holders: null, shares: -9000, proportion: -0 },
          { level: 17, holders: 1381247, shares: 25932733242, proportion: 100 },
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

  describe('.fetchStocksShareholdersRecentWeek()', () => {
    it('should fetch stocks holders', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/TDCC_OD_1-5.csv').toString() });

      const data = await scraper.fetchStocksShareholdersRecentWeek() as StockShareholders[];
      expect(mockAxios.get).toHaveBeenCalledWith('https://smart.tdcc.com.tw/opendata/getOD.ashx?id=1-5');
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
    });

    it('should fetch stocks holders for the specified stock', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/TDCC_OD_1-5.csv').toString() });

      const data = await scraper.fetchStocksShareholdersRecentWeek({ symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith('https://smart.tdcc.com.tw/opendata/getOD.ashx?id=1-5');
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2024-10-25',
        symbol: '2330',
        shareholders: [
          { level: 1, holders: 960910, shares: 147319215, proportion: 0.56 },
          { level: 2, holders: 337223, shares: 647931196, proportion: 2.49 },
          { level: 3, holders: 40892, shares: 296223356, proportion: 1.14 },
          { level: 4, holders: 14153, shares: 174406522, proportion: 0.67 },
          { level: 5, holders: 6711, shares: 118641299, proportion: 0.45 },
          { level: 6, holders: 6737, shares: 165024973, proportion: 0.63 },
          { level: 7, holders: 3181, shares: 110495161, proportion: 0.42 },
          { level: 8, holders: 1894, shares: 85501551, proportion: 0.32 },
          { level: 9, holders: 3759, shares: 262586941, proportion: 1.01 },
          { level: 10, holders: 1909, shares: 265381189, proportion: 1.02 },
          { level: 11, holders: 1265, shares: 353791243, proportion: 1.36 },
          { level: 12, holders: 547, shares: 269911145, proportion: 1.04 },
          { level: 13, holders: 321, shares: 224407805, proportion: 0.86 },
          { level: 14, holders: 204, shares: 184470065, proportion: 0.71 },
          { level: 15, holders: 1541, shares: 22626650581, proportion: 87.25 },
          { level: 16, holders: null, shares: -9000, proportion: -0 },
          { level: 17, holders: 1381247, shares: 25932733242, proportion: 100 },
        ],
      })
    });
  });
});
