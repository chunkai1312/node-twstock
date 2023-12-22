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

      const txf = await scraper.fetchTxfInstTrades({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
        commodityId: 'TXF',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txf).toBe(null);
    });
  });

  describe('.fetchMxfInstTrades()', () => {
    it('should fetch MXF institutional investors\' trades for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/mxf-inst-trades.csv');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txf = await scraper.fetchMxfInstTrades({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodityId: 'MXF',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txf).toBeDefined();
      expect(txf).toEqual({
        date: '2023-01-30',
        symbol: 'MXF',
        name: '小型臺指期貨',
        finiLongTradeVolume: 76626,
        finiLongTradeValue: 58456520,
        finiShortTradeVolume: 71944,
        finiShortTradeValue: 54942167,
        finiNetTradeVolume: 4682,
        finiNetTradeValue: 3514353,
        finiLongOiVolume: 5383,
        finiLongOiValue: 4159828,
        finiShortOiVolume: 2406,
        finiShortOiValue: 1859422,
        finiNetOiVolume: 2977,
        finiNetOiValue: 2300406,
        sitcLongTradeVolume: 8,
        sitcLongTradeValue: 6161,
        sitcShortTradeVolume: 9,
        sitcShortTradeValue: 6937,
        sitcNetTradeVolume: -1,
        sitcNetTradeValue: -776,
        sitcLongOiVolume: 89,
        sitcLongOiValue: 68784,
        sitcShortOiVolume: 12,
        sitcShortOiValue: 9274,
        sitcNetOiVolume: 77,
        sitcNetOiValue: 59510,
        dealersLongTradeVolume: 16135,
        dealersLongTradeValue: 12314862,
        dealersShortTradeVolume: 16475,
        dealersShortTradeValue: 12593227,
        dealersNetTradeVolume: -340,
        dealersNetTradeValue: -278365,
        dealersLongOiVolume: 8469,
        dealersLongOiValue: 6528692,
        dealersShortOiVolume: 2690,
        dealersShortOiValue: 2077468,
        dealersNetOiVolume: 5779,
        dealersNetOiValue: 4451224,
      });
    });

    it('should return null when no data is available', async () => {
      const data = fs.readFileSync('./test/fixtures/mxf-inst-trades-no-data.html');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txf = await scraper.fetchMxfInstTrades({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
        commodityId: 'MXF',
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

  describe('.fetchMxfRetailPosition()', () => {
    it('should fetch MXF retail investors\' position for the given date', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation((url: string) => {
        return new Promise((resolve, reject) => {
          switch (url) {
            case 'https://www.taifex.com.tw/cht/3/futDataDown':
              return resolve({ data: fs.readFileSync('./test/fixtures/mxf-market-trades.csv') });
            case 'https://www.taifex.com.tw/cht/3/futContractsDateDown':
              return resolve({ data: fs.readFileSync('./test/fixtures/mxf-inst-trades.csv') });
            default: return reject();
          }
        });
      });

      const mxf = await scraper.fetchMxfRetailPosition({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'MTX',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(mxf).toBeDefined();
      expect(mxf).toEqual({
        date: '2023-01-30',
        mxfRetailLongOi: 30126,
        mxfRetailShortOi: 38959,
        mxfRetailNetOi: -8833,
        mxfRetailLongShortRatio: -0.2004,
      });
    });

    it('should return null when no data is available', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation((url: string) => {
        return new Promise((resolve, reject) => {
          switch (url) {
            case 'https://www.taifex.com.tw/cht/3/futDataDown':
              return resolve({ data: fs.readFileSync('./test/fixtures/mxf-market-trades-no-data.csv') });
            case 'https://www.taifex.com.tw/cht/3/futContractsDateDown':
              return resolve({ data: fs.readFileSync('./test/fixtures/mxf-inst-trades-no-data.html') });
            default: return reject();
          }
        });
      });

      const mxf = await scraper.fetchMxfRetailPosition({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
        commodity_id: 'MTX',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(mxf).toBe(null);
    });
  });

  describe('.fetchTxfLargeTradersPosition()', () => {
    it('should fetch TXF large traders position for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/txf-large-traders-position.csv');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txf = await scraper.fetchTxfLargeTradersPosition({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txf).toBeDefined();
      expect(txf).toEqual({
        frontMonth: {
          topFiveLongOi: 30643,
          topFiveShortOi: 29456,
          topFiveNetOi: 1187,
          topTenLongOi: 40363,
          topTenShortOi: 36869,
          topTenNetOi: 3494,
          topFiveSpecificLongOi: 30643,
          topFiveSpecificShortOi: 29456,
          topFiveSpecificNetOi: 1187,
          topTenSpecificLongOi: 38860,
          topTenSpecificShortOi: 34209,
          topTenSpecificNetOi: 4651,
          topFiveNonspecificLongOi: 0,
          topFiveNonspecificShortOi: 0,
          topFiveNonspecificNetOi: 0,
          topTenNonspecificLongOi: 1503,
          topTenNonspecificShortOi: 2660,
          topTenNonspecificNetOi: -1157,
          marketOi: 68173,
        },
        allMonths: {
          topFiveLongOi: 30828,
          topFiveShortOi: 29523,
          topFiveNetOi: 1305,
          topTenLongOi: 40572,
          topTenShortOi: 37209,
          topTenNetOi: 3363,
          topFiveSpecificLongOi: 30828,
          topFiveSpecificShortOi: 29523,
          topFiveSpecificNetOi: 1305,
          topTenSpecificLongOi: 39045,
          topTenSpecificShortOi: 34493,
          topTenSpecificNetOi: 4552,
          marketOi: 72437,
        },
        backMonths: {
          topFiveLongOi: 185,
          topFiveShortOi: 67,
          topFiveNetOi: 118,
          topTenLongOi: 209,
          topTenShortOi: 340,
          topTenNetOi: -131,
          topFiveSpecificLongOi: 185,
          topFiveSpecificShortOi: 67,
          topFiveSpecificNetOi: 118,
          topTenSpecificLongOi: 185,
          topTenSpecificShortOi: 284,
          topTenSpecificNetOi: -99,
          marketOi: 4264,
        },
      });
    });

    it('should return null when no data is available', async () => {
      const data = fs.readFileSync('./test/fixtures/txf-large-traders-position-no-data.html');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txf = await scraper.fetchTxfLargeTradersPosition({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txf).toBe(null);
    });
  });

  describe('.fetchTxoLargeTradersPosition()', () => {
    it('should fetch TXO large traders position for the given date', async () => {
      const data = fs.readFileSync('./test/fixtures/txo-large-traders-position.csv');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txo = await scraper.fetchTxoLargeTradersPosition({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderOptDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txo).toBeDefined();
      expect(txo).toEqual({
        calls: {
          frontMonth: {
            topFiveLongOi: 16007,
            topFiveShortOi: 11593,
            topFiveNetOi: 4414,
            topTenLongOi: 19936,
            topTenShortOi: 17255,
            topTenNetOi: 2681,
            topFiveSpecificLongOi: 2636,
            topFiveSpecificShortOi: 5158,
            topFiveSpecificNetOi: -2522,
            topTenSpecificLongOi: 5237,
            topTenSpecificShortOi: 6533,
            topTenSpecificNetOi: -1296,
            topFiveNonspecificLongOi: 13371,
            topFiveNonspecificShortOi: 6435,
            topFiveNonspecificNetOi: 6936,
            topTenNonspecificLongOi: 14699,
            topTenNonspecificShortOi: 10722,
            topTenNonspecificNetOi: 3977,
            marketOi: 37196,
          },
          allMonths: {
            topFiveLongOi: 32966,
            topFiveShortOi: 33968,
            topFiveNetOi: -1002,
            topTenLongOi: 43496,
            topTenShortOi: 43773,
            topTenNetOi: -277,
            topFiveSpecificLongOi: 0,
            topFiveSpecificShortOi: 3000,
            topFiveSpecificNetOi: -3000,
            topTenSpecificLongOi: 7195,
            topTenSpecificShortOi: 5160,
            topTenSpecificNetOi: 2035,
            marketOi: 87502,
          },
          backMonths: {
            topFiveLongOi: 16959,
            topFiveShortOi: 22375,
            topFiveNetOi: -5416,
            topTenLongOi: 23560,
            topTenShortOi: 26518,
            topTenNetOi: -2958,
            topFiveSpecificLongOi: -2636,
            topFiveSpecificShortOi: -2158,
            topFiveSpecificNetOi: -478,
            topTenSpecificLongOi: 1958,
            topTenSpecificShortOi: -1373,
            topTenSpecificNetOi: 3331,
            marketOi: 50306,
          },
        },
        puts: {
          frontMonth: {
            topFiveLongOi: 9716,
            topFiveShortOi: 4483,
            topFiveNetOi: 5233,
            topTenLongOi: 11749,
            topTenShortOi: 6670,
            topTenNetOi: 5079,
            topFiveSpecificLongOi: 0,
            topFiveSpecificShortOi: 570,
            topFiveSpecificNetOi: -570,
            topTenSpecificLongOi: 0,
            topTenSpecificShortOi: 930,
            topTenSpecificNetOi: -930,
            topFiveNonspecificLongOi: 9716,
            topFiveNonspecificShortOi: 3913,
            topFiveNonspecificNetOi: 5803,
            topTenNonspecificLongOi: 11749,
            topTenNonspecificShortOi: 5740,
            topTenNonspecificNetOi: 6009,
            marketOi: 23838,
          },
          allMonths: {
            topFiveLongOi: 13841,
            topFiveShortOi: 9469,
            topFiveNetOi: 4372,
            topTenLongOi: 17629,
            topTenShortOi: 11668,
            topTenNetOi: 5961,
            topFiveSpecificLongOi: 3474,
            topFiveSpecificShortOi: 1837,
            topFiveSpecificNetOi: 1637,
            topTenSpecificLongOi: 3474,
            topTenSpecificShortOi: 2208,
            topTenSpecificNetOi: 1266,
            marketOi: 34848,
          },
          backMonths: {
            topFiveLongOi: 4125,
            topFiveShortOi: 4986,
            topFiveNetOi: -861,
            topTenLongOi: 5880,
            topTenShortOi: 4998,
            topTenNetOi: 882,
            topFiveSpecificLongOi: 3474,
            topFiveSpecificShortOi: 1267,
            topFiveSpecificNetOi: 2207,
            topTenSpecificLongOi: 3474,
            topTenSpecificShortOi: 1278,
            topTenSpecificNetOi: 2196,
            marketOi: 11010,
          },
        },
      });
    });

    it('should return null when no data is available', async () => {
      const data = fs.readFileSync('./test/fixtures/txo-large-traders-position-no-data.html');
      mockAxios.post.mockResolvedValueOnce({ data });

      const txo = await scraper.fetchTxoLargeTradersPosition({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderOptDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(txo).toBe(null);
    });
  });
});
