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

  describe('.fetchStocksInfo()', () => {
    it('should fetch stocks info', async () => {
      const data = fs.readFileSync('./test/fixtures/stocks-info.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchStocksInfo({ symbol: '2330' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/single_main.jsp?owncode=2330',
        { responseType: 'arraybuffer' },
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        symbol: '2330',
        name: '台積電',
        exchange: 'TWSE',
        market: 'TSE',
        industry: '24',
        listedDate: '1994-09-05',
      });
    });
  });

  describe('.fetchListedStocks()', () => {
    it('should fetch listed stocks for TSE market', async () => {
      const data = fs.readFileSync('./test/fixtures/tse-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchListedStocks({ market: 'TSE' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=1',
        { responseType: 'arraybuffer' },
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        symbol: '0050',
        name: '元大台灣50',
        exchange: 'TWSE',
        market: 'TSE',
        industry: '00',
        listedDate: '2003-06-30',
      });
    });

    it('should fetch listed stocks for OTC market', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const stocks = await scraper.fetchListedStocks({ market: 'OTC' });
      expect(mockAxios.get).toHaveBeenCalledWith(
        'https://isin.twse.com.tw/isin/class_main.jsp?market=2',
        { responseType: 'arraybuffer' },
      );
      expect(stocks).toBeDefined();
      expect(stocks.length).toBeGreaterThan(0);
      expect(stocks[0]).toEqual({
        symbol: '006201',
        name: '元大富櫃50',
        exchange: 'TPEx',
        market: 'OTC',
        industry: '00',
        listedDate: '2011-01-27',
      });
    });
  });
});
