import * as fs from 'fs';
import mockAxios from 'jest-mock-axios';
import { TwseScraper } from '../../src/scrapers/twse-scraper';

describe('TwseScraper', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchListedStocks()', () => {
    it('should fetch listed stocks for TSE market', async () => {
      const data = fs.readFileSync('./test/fixtures/tse-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new TwseScraper();
      const listedStocks = await scraper.fetchListedStocks({ market: 'TSE' });

      expect(listedStocks).toBeDefined();
      expect(listedStocks.length).toBeGreaterThan(0);
      expect(listedStocks[0].symbol).toBe('1101');
      expect(listedStocks[0].name).toBe('台泥');
      expect(listedStocks[0].exchange).toBe('TWSE');
      expect(listedStocks[0].market).toBe('TSE');
      expect(listedStocks[0].industry).toBe('01');
      expect(listedStocks[0].listedDate).toBe('1962-02-09');
    });

    it('should fetch listed stocks for OTC market', async () => {
      const data = fs.readFileSync('./test/fixtures/otc-listed-stocks.html');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new TwseScraper();
      const listedStocks = await scraper.fetchListedStocks({ market: 'OTC' });

      expect(listedStocks).toBeDefined();
      expect(listedStocks.length).toBeGreaterThan(0);
      expect(listedStocks[0].symbol).toBe('1240');
      expect(listedStocks[0].name).toBe('茂生農經');
      expect(listedStocks[0].exchange).toBe('TPEx');
      expect(listedStocks[0].market).toBe('OTC');
      expect(listedStocks[0].industry).toBe('33');
      expect(listedStocks[0].listedDate).toBe('2018-08-08');
    });
  });
});
