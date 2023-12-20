import * as fs from 'fs';
import mockAxios from 'jest-mock-axios';
import { TaifexScraper } from '../../src/scrapers/taifex-scraper';

describe('TaifexScraper', () => {
  let scraper: TaifexScraper;

  beforeEach(() => {
    scraper = new TaifexScraper();
  });

  afterEach(() => {
    mockAxios.reset();
  });

  describe('.fetchTxfInstTrades()', () => {
    it('should fetch TXF institutional investors\' trades for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/txf-inst-trades.csv');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txf = await scraper.fetchTxfInstTrades({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodityId: 'TXF',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txf).toBeDefined();
      expect(txf).toEqual({
        date: '2023-01-30',
        symbol: 'TXF',
        name: '臺股期貨',
        finiLongTradeVolume: 61232,
        finiLongTradeValue: 187462698,
        finiShortTradeVolume: 60146,
        finiShortTradeValue: 184303292,
        finiNetTradeVolume: 1086,
        finiNetTradeValue: 3159406,
        finiLongOiVolume: 32100,
        finiLongOiValue: 99233073,
        finiShortOiVolume: 24001,
        finiShortOiValue: 74192341,
        finiNetOiVolume: 8099,
        finiNetOiValue: 25040732,
        sitcLongTradeVolume: 2237,
        sitcLongTradeValue: 6907887,
        sitcShortTradeVolume: 449,
        sitcShortTradeValue: 1384268,
        sitcNetTradeVolume: 1788,
        sitcNetTradeValue: 5523619,
        sitcLongOiVolume: 10112,
        sitcLongOiValue: 31260237,
        sitcShortOiVolume: 15995,
        sitcShortOiValue: 49446943,
        sitcNetOiVolume: -5883,
        sitcNetOiValue: -18186706,
        dealersLongTradeVolume: 14205,
        dealersLongTradeValue: 43588157,
        dealersShortTradeVolume: 17049,
        dealersShortTradeValue: 52346096,
        dealersNetTradeVolume: -2844,
        dealersNetTradeValue: -8757939,
        dealersLongOiVolume: 10822,
        dealersLongOiValue: 33446397,
        dealersShortOiVolume: 5797,
        dealersShortOiValue: 17917728,
        dealersNetOiVolume: 5025,
        dealersNetOiValue: 15528669,
      });
    });

    it('should return null when no data is available', async () => {
      const data = fs.readFileSync('./test/fixtures/txf-inst-trades-no-data.html');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txf = await scraper.fetchTxfInstTrades({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodityId: 'TXF',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txf).toBe(null);
    });
  });
});
