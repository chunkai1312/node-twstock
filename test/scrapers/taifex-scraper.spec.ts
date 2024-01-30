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

  describe('.fetchListedStockFutOpt()', () => {
    it('should fetch listed stock futures & options', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-listed-stock-futopt.html') });

      const data = await scraper.fetchListedStockFutOpt();
      expect(mockAxios.get).toHaveBeenCalledWith('https://www.taifex.com.tw/cht/2/stockLists');
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        symbol: 'CAF',
        name: '南亞期貨',
        exchange: 'TAIFEX',
        type: '股票期貨',
        underlyingSymbol: '1303',
        underlyingName: '南亞',
      });
    });

    it('should return empty array when no data is available', async () => {
      mockAxios.get.mockResolvedValueOnce({ data: {} });

      const data = await scraper.fetchListedStockFutOpt();
      expect(mockAxios.get).toHaveBeenCalledWith('https://www.taifex.com.tw/cht/2/stockLists');
      expect(data?.length).toBe(0);
    });
  });

  describe('.fetchFuturesHistorical()', () => {
    it('should fetch futures historical data for the given date of regular trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-historical.csv') });

      const data = await scraper.fetchFuturesHistorical({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'ZFF',
        contractMonth: '202301',
        open: 1580.4,
        high: 1586,
        low: 1553.2,
        close: 1570.2,
        change: 19.8,
        changePercent: 1.28,
        volume: 647,
        settlementPrice: 0,
        openInterest: 186,
        bestBid: 1569.4,
        bestAsk: 1570.2,
        historicalHigh: 1586,
        historicalLow: 1352,
        session: '一般',
        volumeSpread: null,
      });
    });

    it('should fetch futures historical data for the given date of after-hours trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-historical.csv') });

      const data = await scraper.fetchFuturesHistorical({ date: '2023-01-30', afterhours: true });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'ZEF',
        contractMonth: '202301',
        open: 690.55,
        high: 699.25,
        low: 689.6,
        close: 699.25,
        change: 7.25,
        changePercent: 1.05,
        volume: 649,
        settlementPrice: null,
        openInterest: null,
        bestBid: 698.8,
        bestAsk: 699.3,
        historicalHigh: 703,
        historicalLow: 564.2,
        session: '盤後',
        volumeSpread: null,
      });
    });

    it('should fetch TXF historical data for the given date of regular trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-historical.csv') });

      const data = await scraper.fetchFuturesHistorical({ date: '2023-01-30', symbol: 'TXF' });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'TXF',
        contractMonth: '202301',
        open: 15558,
        high: 15559,
        low: 15364,
        close: 15451,
        change: 526,
        changePercent: 3.52,
        volume: 45946,
        settlementPrice: 0,
        openInterest: 14509,
        bestBid: 15450,
        bestAsk: 15451,
        historicalHigh: 15559,
        historicalLow: 12631,
        session: '一般',
        volumeSpread: null,
      });
    });

    it('should fetch TXF historical data for the given date of after-hours trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-historical.csv') });

      const data = await scraper.fetchFuturesHistorical({ date: '2023-01-30', symbol: 'TXF', afterhours: true });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'TXF',
        contractMonth: '202301',
        open: 14918,
        high: 15054,
        low: 14828,
        close: 15048,
        change: 123,
        changePercent: 0.82,
        volume: 31299,
        settlementPrice: null,
        openInterest: null,
        bestBid: 15048,
        bestAsk: 15054,
        historicalHigh: 15082,
        historicalLow: 12631,
        session: '盤後',
        volumeSpread: null,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-historical-no-data.csv') });

      const data = await scraper.fetchFuturesHistorical({ date: '2023-01-01', symbol: 'GTF' });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });

  describe('.fetchOptionsHistorical()', () => {
    it('should fetch options historical data for the given date of regular trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-historical.csv') });

      const data = await scraper.fetchOptionsHistorical({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/optDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'CAO',
        contractMonth: '202301',
        strikePrice: 57.5,
        type: '買權',
        open: null,
        high: null,
        low: null,
        close: null,
        volume: 0,
        settlementPrice: 0,
        openInterest: 0,
        bestBid: null,
        bestAsk: null,
        historicalHigh: null,
        historicalLow: null,
        session: '一般',
        change: null,
        changePercent: null,
      });
    });

    it('should fetch options historical data for the given date of after-hours trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-historical.csv') });

      const data = await scraper.fetchOptionsHistorical({ date: '2023-01-30', afterhours: true });
      const url = 'https://www.taifex.com.tw/cht/3/optDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'TGO',
        contractMonth: '202302',
        strikePrice: 5800,
        type: '買權',
        open: null,
        high: null,
        low: null,
        close: null,
        volume: 0,
        settlementPrice: null,
        openInterest: null,
        bestBid: null,
        bestAsk: null,
        historicalHigh: null,
        historicalLow: null,
        session: '盤後',
        change: null,
        changePercent: null,
      });
    });

    it('should fetch TXO historical data for the given date of regular trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-historical.csv') });

      const data = await scraper.fetchOptionsHistorical({ date: '2023-01-30', symbol: 'TXO' });
      const url = 'https://www.taifex.com.tw/cht/3/optDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'TXO',
        contractMonth: '202301',
        strikePrice: 10700,
        type: '買權',
        open: null,
        high: null,
        low: null,
        close: null,
        volume: 0,
        settlementPrice: 0,
        openInterest: 0,
        bestBid: null,
        bestAsk: null,
        historicalHigh: null,
        historicalLow: null,
        session: '一般',
        change: null,
        changePercent: null,
      });
    });

    it('should fetch TXO historical data for the given date of after-hours trading', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-historical.csv') });

      const data = await scraper.fetchOptionsHistorical({ date: '2023-01-30', symbol: 'TXO', afterhours: true });
      const url = 'https://www.taifex.com.tw/cht/3/optDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data?.length).toBeGreaterThan(0);
      expect(data?.[0]).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'TXO',
        contractMonth: '202301',
        strikePrice: 10700,
        type: '買權',
        open: null,
        high: null,
        low: null,
        close: null,
        volume: 0,
        settlementPrice: null,
        openInterest: null,
        bestBid: null,
        bestAsk: null,
        historicalHigh: null,
        historicalLow: null,
        session: '盤後',
        change: null,
        changePercent: null,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-historical-no-data.csv') });

      const data = await scraper.fetchOptionsHistorical({ date: '2023-01-01', symbol: 'TXO' });
      const url = 'https://www.taifex.com.tw/cht/3/optDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });

  describe('.fetchFuturesInstitutional()', () => {
    it('should fetch futures institutional investors\' trades for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-institutional.csv') });

      const data = await scraper.fetchFuturesInstitutional({ date: '2023-01-30', symbol: 'MXF' });
      const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodityId: 'MXF',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'MXF',
        name: '小型臺指期貨',
        institutional: [
          {
            investor: '自營商',
            longTradeVolume: 16135,
            longTradeValue: 12314862,
            shortTradeVolume: 16475,
            shortTradeValue: 12593227,
            netTradeVolume: -340,
            netTradeValue: -278365,
            longOiVolume: 8469,
            longOiValue: 6528692,
            shortOiVolume: 2690,
            shortOiValue: 2077468,
            netOiVolume: 5779,
            netOiValue: 4451224,
          },
          {
            investor: '投信',
            longTradeVolume: 8,
            longTradeValue: 6161,
            shortTradeVolume: 9,
            shortTradeValue: 6937,
            netTradeVolume: -1,
            netTradeValue: -776,
            longOiVolume: 89,
            longOiValue: 68784,
            shortOiVolume: 12,
            shortOiValue: 9274,
            netOiVolume: 77,
            netOiValue: 59510,
          },
          {
            investor: '外資及陸資',
            longTradeVolume: 76626,
            longTradeValue: 58456520,
            shortTradeVolume: 71944,
            shortTradeValue: 54942167,
            netTradeVolume: 4682,
            netTradeValue: 3514353,
            longOiVolume: 5383,
            longOiValue: 4159828,
            shortOiVolume: 2406,
            shortOiValue: 1859422,
            netOiVolume: 2977,
            netOiValue: 2300406,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-institutional-no-data.html') });

      const data = await scraper.fetchFuturesInstitutional({ date: '2023-01-01', symbol: 'TXF' });
      const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
        commodityId: 'TXF',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });

  describe('.fetchOptionsInstitutional()', () => {
    it('should fetch options institutional investors\' trades for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-institutional.csv') });

      const data = await scraper.fetchOptionsInstitutional({ date: '2023-01-30', symbol: 'TXO' });
      const url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodityId: 'TXO',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'TXO',
        name: '臺指選擇權',
        institutional: [
          {
            type: 'CALL',
            investor: '自營商',
            longTradeVolume: 146455,
            longTradeValue: 790595,
            shortTradeVolume: 150228,
            shortTradeValue: 678924,
            netTradeVolume: -3773,
            netTradeValue: 111671,
            longOiVolume: 33450,
            longOiValue: 537454,
            shortOiVolume: 37665,
            shortOiValue: 377511,
            netOiVolume: -4215,
            netOiValue: 159943,
          },
          {
            type: 'CALL',
            investor: '投信',
            longTradeVolume: 0,
            longTradeValue: 0,
            shortTradeVolume: 0,
            shortTradeValue: 0,
            netTradeVolume: 0,
            netTradeValue: 0,
            longOiVolume: 0,
            longOiValue: 0,
            shortOiVolume: 0,
            shortOiValue: 0,
            netOiVolume: 0,
            netOiValue: 0,
          },
          {
            type: 'CALL',
            investor: '外資及陸資',
            longTradeVolume: 58909,
            longTradeValue: 277781,
            shortTradeVolume: 49665,
            shortTradeValue: 282059,
            netTradeVolume: 9244,
            netTradeValue: -4278,
            longOiVolume: 11735,
            longOiValue: 333628,
            shortOiVolume: 7956,
            shortOiValue: 182152,
            netOiVolume: 3779,
            netOiValue: 151476,
          },
          {
            type: 'PUT',
            investor: '自營商',
            longTradeVolume: 118685,
            longTradeValue: 324370,
            shortTradeVolume: 152013,
            shortTradeValue: 332610,
            netTradeVolume: -33328,
            netTradeValue: -8240,
            longOiVolume: 24355,
            longOiValue: 126801,
            shortOiVolume: 32667,
            shortOiValue: 71726,
            netOiVolume: -8312,
            netOiValue: 55075,
          },
          {
            type: 'PUT',
            investor: '投信',
            longTradeVolume: 141,
            longTradeValue: 1,
            shortTradeVolume: 111,
            shortTradeValue: 1152,
            netTradeVolume: 30,
            netTradeValue: -1151,
            longOiVolume: 0,
            longOiValue: 0,
            shortOiVolume: 111,
            shortOiValue: 1027,
            netOiVolume: -111,
            netOiValue: -1027,
          },
          {
            type: 'PUT',
            investor: '外資及陸資',
            longTradeVolume: 29719,
            longTradeValue: 88059,
            shortTradeVolume: 27070,
            shortTradeValue: 87819,
            netTradeVolume: 2649,
            netTradeValue: 240,
            longOiVolume: 7147,
            longOiValue: 8210,
            shortOiVolume: 9383,
            shortOiValue: 24009,
            netOiVolume: -2236,
            netOiValue: -15799,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-institutional-no-data.html') });

      const data = await scraper.fetchOptionsInstitutional({ date: '2023-01-30', symbol: 'TXO' });
      const url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodityId: 'TXO',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });

  describe('.fetchFuturesLargeTraders()', () => {
    it('should fetch TXF large traders position for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-large-traders-position.csv') });

      const data = await scraper.fetchFuturesLargeTraders({ date: '2023-01-30', symbol: 'TXF' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'TXF',
        name: '臺股期貨(TX+MTX/4)',
        largeTraders: [
          {
            contractMonth: '666666',
            traderType: '0',
            topFiveLongOi: 33,
            topFiveShortOi: 40,
            topTenLongOi: 43,
            topTenShortOi: 42,
            marketOi: 48,
          },
          {
            contractMonth: '666666',
            traderType: '1',
            topFiveLongOi: 5,
            topFiveShortOi: 2,
            topTenLongOi: 5,
            topTenShortOi: 2,
            marketOi: 48,
          },
          {
            contractMonth: '202302',
            traderType: '0',
            topFiveLongOi: 30643,
            topFiveShortOi: 29456,
            topTenLongOi: 40363,
            topTenShortOi: 36869,
            marketOi: 68173,
          },
          {
            contractMonth: '202302',
            traderType: '1',
            topFiveLongOi: 30643,
            topFiveShortOi: 29456,
            topTenLongOi: 38860,
            topTenShortOi: 34209,
            marketOi: 68173,
          },
          {
            contractMonth: '999999',
            traderType: '0',
            topFiveLongOi: 30828,
            topFiveShortOi: 29523,
            topTenLongOi: 40572,
            topTenShortOi: 37209,
            marketOi: 72437,
          },
          {
            contractMonth: '999999',
            traderType: '1',
            topFiveLongOi: 30828,
            topFiveShortOi: 29523,
            topTenLongOi: 39045,
            topTenShortOi: 34493,
            marketOi: 72437,
          },
        ],
      });
    });

    it('should fetch GTF large traders position for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-large-traders-position.csv') });

      const data = await scraper.fetchFuturesLargeTraders({ date: '2023-01-30', symbol: 'GTF' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'GTF',
        name: '櫃買期貨',
        largeTraders: [
          {
            contractMonth: '202302',
            traderType: '0',
            topFiveLongOi: 79,
            topFiveShortOi: 81,
            topTenLongOi: 89,
            topTenShortOi: 87,
            marketOi: 89,
          },
          {
            contractMonth: '202302',
            traderType: '1',
            topFiveLongOi: 0,
            topFiveShortOi: 0,
            topTenLongOi: 0,
            topTenShortOi: 0,
            marketOi: 89,
          },
          {
            contractMonth: '999999',
            traderType: '0',
            topFiveLongOi: 79,
            topFiveShortOi: 81,
            topTenLongOi: 89,
            topTenShortOi: 87,
            marketOi: 89,
          },
          {
            contractMonth: '999999',
            traderType: '1',
            topFiveLongOi: 0,
            topFiveShortOi: 0,
            topTenLongOi: 0,
            topTenShortOi: 0,
            marketOi: 89,
          },
        ],
      });
    });

    it('should fetch CDF large traders position for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-large-traders-position.csv') });

      const data = await scraper.fetchFuturesLargeTraders({ date: '2023-01-30', symbol: 'CDF' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'CDF',
        name: '台積電期貨',
        largeTraders: [
          {
            contractMonth: '202302',
            traderType: '0',
            topFiveLongOi: 14099,
            topFiveShortOi: 14910,
            topTenLongOi: 16817,
            topTenShortOi: 18233,
            marketOi: 21166,
          },
          {
            contractMonth: '202302',
            traderType: '1',
            topFiveLongOi: 11648,
            topFiveShortOi: 14910,
            topTenLongOi: 13866,
            topTenShortOi: 18233,
            marketOi: 21166,
          },
          {
            contractMonth: '999999',
            traderType: '0',
            topFiveLongOi: 17661,
            topFiveShortOi: 20549,
            topTenLongOi: 20677,
            topTenShortOi: 24702,
            marketOi: 28401,
          },
          {
            contractMonth: '999999',
            traderType: '1',
            topFiveLongOi: 15210,
            topFiveShortOi: 20549,
            topTenLongOi: 17110,
            topTenShortOi: 24702,
            marketOi: 28401,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-futures-large-traders-position-no-data.html') });

      const data = await scraper.fetchFuturesLargeTraders({ date: '2023-01-01', symbol: 'TXF' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });

  describe('.fetchOptionsLargeTraders()', () => {
    it('should fetch options large traders position for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-large-traders-position.csv') });

      const data = await scraper.fetchOptionsLargeTraders({ date: '2023-01-30', symbol: 'TXO' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderOptDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        exchange: 'TAIFEX',
        symbol: 'TXO',
        name: '臺指',
        largeTraders: [
          {
            type: '買權',
            contractMonth: '666666',
            traderType: '0',
            topFiveLongOi: 6025,
            topFiveShortOi: 9114,
            topTenLongOi: 8186,
            topTenShortOi: 12264,
            marketOi: 21650,
          },
          {
            type: '買權',
            contractMonth: '666666',
            traderType: '1',
            topFiveLongOi: 0,
            topFiveShortOi: 0,
            topTenLongOi: 0,
            topTenShortOi: 0,
            marketOi: 21650,
          },
          {
            type: '買權',
            contractMonth: '202302',
            traderType: '0',
            topFiveLongOi: 16007,
            topFiveShortOi: 11593,
            topTenLongOi: 19936,
            topTenShortOi: 17255,
            marketOi: 37196,
          },
          {
            type: '買權',
            contractMonth: '202302',
            traderType: '1',
            topFiveLongOi: 2636,
            topFiveShortOi: 5158,
            topTenLongOi: 5237,
            topTenShortOi: 6533,
            marketOi: 37196,
          },
          {
            type: '買權',
            contractMonth: '999999',
            traderType: '0',
            topFiveLongOi: 32966,
            topFiveShortOi: 33968,
            topTenLongOi: 43496,
            topTenShortOi: 43773,
            marketOi: 87502,
          },
          {
            type: '買權',
            contractMonth: '999999',
            traderType: '1',
            topFiveLongOi: 0,
            topFiveShortOi: 3000,
            topTenLongOi: 7195,
            topTenShortOi: 5160,
            marketOi: 87502,
          },
          {
            type: '賣權',
            contractMonth: '666666',
            traderType: '0',
            topFiveLongOi: 9716,
            topFiveShortOi: 4483,
            topTenLongOi: 11749,
            topTenShortOi: 6670,
            marketOi: 23838,
          },
          {
            type: '賣權',
            contractMonth: '666666',
            traderType: '1',
            topFiveLongOi: 0,
            topFiveShortOi: 570,
            topTenLongOi: 0,
            topTenShortOi: 930,
            marketOi: 23838,
          },
          {
            type: '賣權',
            contractMonth: '202302',
            traderType: '0',
            topFiveLongOi: 13841,
            topFiveShortOi: 9469,
            topTenLongOi: 17629,
            topTenShortOi: 11668,
            marketOi: 34848,
          },
          {
            type: '賣權',
            contractMonth: '202302',
            traderType: '1',
            topFiveLongOi: 3474,
            topFiveShortOi: 1837,
            topTenLongOi: 3474,
            topTenShortOi: 2208,
            marketOi: 34848,
          },
          {
            type: '賣權',
            contractMonth: '999999',
            traderType: '0',
            topFiveLongOi: 35939,
            topFiveShortOi: 23080,
            topTenLongOi: 48027,
            topTenShortOi: 28460,
            marketOi: 89495,
          },
          {
            type: '賣權',
            contractMonth: '999999',
            traderType: '1',
            topFiveLongOi: 0,
            topFiveShortOi: 2470,
            topTenLongOi: 7762,
            topTenShortOi: 4531,
            marketOi: 89495,
          },
        ],
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-options-large-traders-position-no-data.html') });

      const data = await scraper.fetchOptionsLargeTraders({ date: '2023-01-01', symbol: 'TXO' });
      const url = 'https://www.taifex.com.tw/cht/3/largeTraderOptDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });

  describe('.fetchMxfRetailPosition()', () => {
    it('should fetch MXF retail investors\' position for the given date', async () => {
      // @ts-ignore
      mockAxios.post.mockImplementation((url: string) => {
        return new Promise((resolve, reject) => {
          switch (url) {
            case 'https://www.taifex.com.tw/cht/3/futDataDown':
              return resolve({ data: fs.readFileSync('./test/fixtures/taifex-futures-historical.csv') });
            case 'https://www.taifex.com.tw/cht/3/futContractsDateDown':
              return resolve({ data: fs.readFileSync('./test/fixtures/taifex-futures-institutional.csv') });
            default: return reject();
          }
        });
      });

      const data = await scraper.fetchMxfRetailPosition({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
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
              return resolve({ data: fs.readFileSync('./test/fixtures/taifex-futures-historical-no-data.csv') });
            case 'https://www.taifex.com.tw/cht/3/futContractsDateDown':
              return resolve({ data: fs.readFileSync('./test/fixtures/taifex-futures-institutional-no-data.html') });
            default: return reject();
          }
        });
      });

      const data = await scraper.fetchMxfRetailPosition({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/futDataDown';
      const form = new URLSearchParams({
        down_type: '1',
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
        commodity_id: 'all',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });

  describe('.fetchTxoPutCallRatio()', () => {
    it('should fetch TXO Put/Call ratio for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-txo-put-call-ratio.csv') });

      const data = await scraper.fetchTxoPutCallRatio({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/pcRatioDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
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
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-txo-put-call-ratio-no-data.csv') });

      const data = await scraper.fetchTxoPutCallRatio({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/pcRatioDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });

  describe('.fetchExchangeRates()', () => {
    it('should fetch exchange rates for the given date', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-exchange-rates.csv') });

      const data = await scraper.fetchExchangeRates({ date: '2023-01-30' });
      const url = 'https://www.taifex.com.tw/cht/3/dailyFXRateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/30',
        queryEndDate: '2023/01/30',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBeDefined();
      expect(data).toEqual({
        date: '2023-01-30',
        usdtwd: 30.137,
        cnytwd: 4.464224,
        eurusd: 1.08835,
        usdjpy: 129.925,
        gbpusd: 1.23865,
        audusd: 0.70825,
        usdhkd: 7.83585,
        usdcny: 6.7508,
        usdzar: 17.2262,
        nzdusd: 0.64805,
      });
    });

    it('should return null when no data is available', async () => {
      mockAxios.post.mockResolvedValueOnce({ data: fs.readFileSync('./test/fixtures/taifex-exchange-rates-no-data.csv') });

      const data = await scraper.fetchExchangeRates({ date: '2023-01-01' });
      const url = 'https://www.taifex.com.tw/cht/3/dailyFXRateDown';
      const form = new URLSearchParams({
        queryStartDate: '2023/01/01',
        queryEndDate: '2023/01/01',
      });
      expect(mockAxios.post).toHaveBeenCalledWith(url, form, { responseType: 'arraybuffer' });
      expect(data).toBe(null);
    });
  });
});
