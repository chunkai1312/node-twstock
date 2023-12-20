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

  describe('.fetchTxoInstTrades()', () => {
    it('should fetch TXO institutional investors\' trades for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/txo-inst-trades.csv');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txo = await scraper.fetchTxoInstTrades({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodityId: 'TXO',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txo).toBeDefined();
      expect(txo).toEqual({
        date: '2023-01-30',
        symbol: 'TXO',
        name: '臺指選擇權',
        calls: {
          finiLongTradeVolume: 58909,
          finiLongTradeValue: 277781,
          finiShortTradeVolume: 49665,
          finiShortTradeValue: 282059,
          finiNetTradeVolume: 9244,
          finiNetTradeValue: -4278,
          finiLongOiVolume: 11735,
          finiLongOiValue: 333628,
          finiShortOiVolume: 7956,
          finiShortOiValue: 182152,
          finiNetOiVolume: 3779,
          finiNetOiValue: 151476,
          sitcLongTradeVolume: 0,
          sitcLongTradeValue: 0,
          sitcShortTradeVolume: 0,
          sitcShortTradeValue: 0,
          sitcNetTradeVolume: 0,
          sitcNetTradeValue: 0,
          sitcLongOiVolume: 0,
          sitcLongOiValue: 0,
          sitcShortOiVolume: 0,
          sitcShortOiValue: 0,
          sitcNetOiVolume: 0,
          sitcNetOiValue: 0,
          dealersLongTradeVolume: 146455,
          dealersLongTradeValue: 790595,
          dealersShortTradeVolume: 150228,
          dealersShortTradeValue: 678924,
          dealersNetTradeVolume: -3773,
          dealersNetTradeValue: 111671,
          dealersLongOiVolume: 33450,
          dealersLongOiValue: 537454,
          dealersShortOiVolume: 37665,
          dealersShortOiValue: 377511,
          dealersNetOiVolume: -4215,
          dealersNetOiValue: 159943,
        },
        puts: {
          finiLongTradeVolume: 29719,
          finiLongTradeValue: 88059,
          finiShortTradeVolume: 27070,
          finiShortTradeValue: 87819,
          finiNetTradeVolume: 2649,
          finiNetTradeValue: 240,
          finiLongOiVolume: 7147,
          finiLongOiValue: 8210,
          finiShortOiVolume: 9383,
          finiShortOiValue: 24009,
          finiNetOiVolume: -2236,
          finiNetOiValue: -15799,
          sitcLongTradeVolume: 141,
          sitcLongTradeValue: 1,
          sitcShortTradeVolume: 111,
          sitcShortTradeValue: 1152,
          sitcNetTradeVolume: 30,
          sitcNetTradeValue: -1151,
          sitcLongOiVolume: 0,
          sitcLongOiValue: 0,
          sitcShortOiVolume: 111,
          sitcShortOiValue: 1027,
          sitcNetOiVolume: -111,
          sitcNetOiValue: -1027,
          dealersLongTradeVolume: 118685,
          dealersLongTradeValue: 324370,
          dealersShortTradeVolume: 152013,
          dealersShortTradeValue: 332610,
          dealersNetTradeVolume: -33328,
          dealersNetTradeValue: -8240,
          dealersLongOiVolume: 24355,
          dealersLongOiValue: 126801,
          dealersShortOiVolume: 32667,
          dealersShortOiValue: 71726,
          dealersNetOiVolume: -8312,
          dealersNetOiValue: 55075,
        },
      });
    });

    it('should return null when no data is available', async () => {
      const data = fs.readFileSync('./test/fixtures/txo-inst-trades-no-data.html');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txo = await scraper.fetchTxoInstTrades({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodityId: 'TXO',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txo).toBe(null);
    });
  });

  describe('.fetchTxoPutCallRatio()', () => {
    it('should fetch TXO Put/Call ratio for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/txo-put-call-ratio.csv');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txo = await scraper.fetchTxoPutCallRatio({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/pcRatioDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txo).toBeDefined();
      expect(txo).toEqual({
        date: '2023-01-30',
        txoPutVolume: 349525,
        txoCallVolume: 410532,
        txoPutCallVolumeRatio: 0.8514,
        txoPutOi: 89495,
        txoCallOi: 87502,
        txoPutCallOiRatio: 1.0228,
      });
    });

    it('should return null when no data is available', async () => {
      const data = fs.readFileSync('./test/fixtures/txo-put-call-ratio-no-data.csv');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txo = await scraper.fetchTxoPutCallRatio({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/pcRatioDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txo).toBe(null);
    });
  });
});
