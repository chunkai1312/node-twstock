import * as fs from 'fs';
import mockAxios from 'jest-mock-axios';
import { IsinScraper } from '../../src/scrapers/isin-scraper';

describe('IsinScraper', () => {
  let scraper: IsinScraper;

  beforeEach(() => {
    scraper = new IsinScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchListed()', () => {
    it('should fetch listed by symbol', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/isin-query.html') });

      const data = await scraper.fetchListed({ symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/single_main.jsp?owncode=2330',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data.length).toBe(1);
      expect(data[0]).toEqual({
        symbol: '2330',
        name: '台積電',
        exchange: 'TWSE',
        type: '股票',
        industry: '24',
        listedDate: '1994-09-05',
      });
    });

    it('should return empty array when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/isin-query-no-data.html') });

      const data = await scraper.fetchListed({ symbol: 'foobar' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/single_main.jsp?owncode=foobar',
        { responseType: 'arraybuffer' },
      );
      expect(data.length).toBe(0);
    });
  });

  describe('.fetchListedStocks()', () => {
    it('should fetch listed stocks for TWSE listed', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/isin-twse-listed-stocks.html') });

      const data = await scraper.fetchListedStocks({ exchange: 'TWSE' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=1',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
        symbol: '0050',
        name: '元大台灣50',
        exchange: 'TWSE',
        type: 'ETF',
        industry: '00',
        listedDate: '2003-06-30',
      });
    });

    it('should fetch listed stocks for TPEx listed', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/isin-tpex-listed-stocks.html') });

      const data = await scraper.fetchListedStocks({ exchange: 'TPEx' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=2',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
        symbol: '006201',
        name: '元大富櫃50',
        exchange: 'TPEx',
        type: 'ETF',
        industry: '00',
        listedDate: '2011-01-27',
      });
    });
  });

  describe('.fetchListedFutOpt()', () => {
    it('should fetch listed futures & options', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/isin-taifex-listed-futopt.html') });

      const data = await scraper.fetchListedFutOpt();
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=7',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
        symbol: 'BRFC4',
        name: '布蘭特原油期貨2024/03',
        exchange: 'TAIFEX',
        type: '原油期貨',
        listedDate: '2023-11-01',
      });
    });

    it('should fetch listed futures', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/isin-taifex-listed-futopt.html') });

      const data = await scraper.fetchListedFutOpt({ type: 'F' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=7',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
        symbol: 'BRFC4',
        name: '布蘭特原油期貨2024/03',
        exchange: 'TAIFEX',
        type: '原油期貨',
        listedDate: '2023-11-01',
      });
    });

    it('should fetch listed options', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/isin-taifex-listed-futopt.html') });

      const data = await scraper.fetchListedFutOpt({ type: 'O' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=7',
        { responseType: 'arraybuffer' },
      );
      expect(data).toBeDefined();
      expect(data.length).toBeGreaterThan(0);
      expect(data[0]).toEqual({
        symbol: 'CAO00500C4',
        name: '南亞股票選擇權,2024/03,履約價50.0,買權',
        exchange: 'TAIFEX',
        type: '股票選擇權買權',
        listedDate: '2023-10-23'
      });
    });
  });
});
