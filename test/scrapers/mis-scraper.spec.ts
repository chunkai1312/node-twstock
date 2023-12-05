import mockAxios from 'jest-mock-axios';
import { MisScraper } from '../../src/scrapers/mis-scraper';

describe('TpexScraper', () => {
  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchStocksHistorical()', () => {
    it('should fetch listed indices for TSE market', async () => {
      const data = require('../fixtures/tse-listed-indices.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new MisScraper();
      const indices = await scraper.fetchListedIndices({ market: 'TSE' });

      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0].name).toBe('發行量加權股價指數');
      expect(indices[0].ex_ch).toBe('tse_t00.tw');
    });

    it('should fetch listed indices for OTC market', async () => {
      const data = require('../fixtures/otc-listed-indices.json');
      mockAxios.get.mockResolvedValueOnce({ data });

      const scraper = new MisScraper();
      const indices = await scraper.fetchListedIndices({ market: 'OTC' });

      expect(indices).toBeDefined();
      expect(indices.length).toBeGreaterThan(0);
      expect(indices[0].name).toBe('櫃買指數');
      expect(indices[0].ex_ch).toBe('otc_o00.tw');
    });
  });
});
