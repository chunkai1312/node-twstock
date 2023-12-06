import { TwStock } from '../src';

jest.mock('../src/scrapers', () => ({
  TwseScraper: {
    fetchListedStocks: jest.fn(({ market }) => {
      if (market === 'TSE') return require('./fixtures/fetched-tse-stocks-list.json');
      if (market === 'OTC') return require('./fixtures/fetched-otc-stocks-list.json');
      return [];
    }),
    fetchStocksHistorical: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-stocks-historical.json');
      return null;
    }),
    fetchIndicesHistorical: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-indices-historical.json');
      return null;
    }),
  },
  TpexScraper: {
    fetchStocksHistorical: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-stocks-historical.json');
      return null;
    }),
    fetchIndicesHistorical: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-indices-historical.json');
      return null;
    }),
  },
  MisScraper: {
    fetchListedIndices: jest.fn(({ market }) => {
      if (market === 'TSE') return require('./fixtures/fetched-tse-indices-list.json');
      if (market === 'OTC') return require('./fixtures/fetched-otc-indices-list.json');
      return [];
    }),
    fetchStocksQuote: jest.fn(({ ticker, odd }) => {
      if (ticker.symbol === '2330' && ticker.market === 'TSE') {
        return odd
          ? require('./fixtures/fetched-stocks-quote.json')
          : require('./fixtures/fetched-stocks-quote-odd.json');
      }
      return null;
    }),
    fetchIndicesQuote: jest.fn(({ ticker, odd }) => {
      if (ticker.symbol === 'IX0001' && ticker.market === 'TSE' && ticker.alias === 't00') {
        return require('./fixtures/fetched-indices-quote.json');
      }
      return null;
    }),
  },
}));

describe('TwStock', () => {
  let twstock: TwStock;

  beforeEach(() => {
    twstock = new TwStock();
  });

  describe('stocks', () => {
    describe('list()', () => {
      it('should load stocks and return the list', async () => {
        const stocks = await twstock.stocks.list();
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
      });

      it('should load stocks and return the list for the TSE market', async () => {
        const stocks = await twstock.stocks.list({ market: 'TSE' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every(stock => stock.market === 'TSE')).toBe(true);
      });

      it('should load stocks and return the list for the OTC market', async () => {
        const stocks = await twstock.stocks.list({ market: 'OTC' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every(stock => stock.market === 'OTC')).toBe(true);
      });
    });

    describe('quote()', () => {
      it('should fetch stocks realtime quote', async () => {
        const stock = await twstock.stocks.quote({ symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });

      it('should throw an error if symbol is not found', async () => {
        await expect(() => twstock.stocks.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('historical()', () => {
      it('should fetch stocks historical data for the symbol', async () => {
        const stock = await twstock.stocks.historical({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });

      it('should throw an error if symbol is not found', async () => {
        await expect(() => twstock.stocks.historical({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should fetch stocks historical data for the TSE market', async () => {
        const stocks = await twstock.stocks.historical({ date: '2023-01-30', market: 'TSE' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'TSE')).toBe(true);
      });

      it('should fetch stocks historical data for the OTC market', async () => {
        const stocks = await twstock.stocks.historical({ date: '2023-01-30', market: 'OTC' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'OTC')).toBe(true);
      });
    });
  });

  describe('indices', () => {
    describe('list()', () => {
      it('should load indices and return the list', async () => {
        const indices = await twstock.indices.list();
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
      });

      it('should load indices and return the list for the TSE market', async () => {
        const indices = await twstock.indices.list({ market: 'TSE' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every(stock => stock.market === 'TSE')).toBe(true);
      });

      it('should load indices and return the list for the OTC market', async () => {
        const indices = await twstock.indices.list({ market: 'OTC' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every(stock => stock.market === 'OTC')).toBe(true);
      });
    });

    describe('quote()', () => {
      it('should fetch indices realtime quote', async () => {
        const index = await twstock.indices.quote({ symbol: 'IX0001' });
        expect(index).toBeDefined();
        expect(index.symbol).toBe('IX0001');
      });

      it('should throw an error if symbol is not found', async () => {
        await expect(() => twstock.indices.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('historical()', () => {
      it('should fetch indices historical data for the symbol', async () => {
        const index = await twstock.indices.historical({ date: '2023-01-30', symbol: 'IX0001' });
        expect(index).toBeDefined();
        expect(index.symbol).toBe('IX0001');
      });

      it('should fetch indices historical data for the TSE market', async () => {
        const indices = await twstock.indices.historical({ date: '2023-01-30', market: 'TSE' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every((index: any) => index.market === 'TSE')).toBe(true);
      });

      it('should fetch indices historical data for the TSE market', async () => {
        const indices = await twstock.indices.historical({ date: '2023-01-30', market: 'OTC' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every((index: any) => index.market === 'OTC')).toBe(true);
      });

      it('should throw an error if symbol is not found', async () => {
        await expect(() => twstock.indices.historical({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });
  });
});