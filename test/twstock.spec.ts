import { TwStock } from '../src';

jest.mock('../src/scrapers', () => ({
  IsinScraper: {
    fetchStocksInfo: jest.fn(({ symbol }) => {
      if (symbol.split(',').includes('2330')) return require('./fixtures/fetched-stocks-info.json');
      if (symbol.split(',').includes('2303')) return require('./fixtures/fetched-stocks-info.json');
      return [];
    }),
    fetchListedStocks: jest.fn(({ market }) => {
      if (market === 'TSE') return require('./fixtures/fetched-tse-stocks-list.json');
      if (market === 'OTC') return require('./fixtures/fetched-otc-stocks-list.json');
      return [];
    }),
  },
  TwseScraper: {
    fetchStocksHistorical: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-stocks-historical.json');
      return null;
    }),
    fetchStocksInstTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-stocks-inst-trades.json');
      return null;
    }),
    fetchStocksFiniHoldings: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-stocks-fini-holdings.json');
      return null;
    }),
    fetchStocksMarginTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-stocks-margin-trades.json');
      return null;
    }),
    fetchStocksValues: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-stocks-values.json');
      return null;
    }),
    fetchIndicesHistorical: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-indices-historical.json');
      return null;
    }),
    fetchIndicesTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-indices-trades.json');
      return null;
    }),
    fetchMarketTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-market-trades.json');
      return null;
    }),
    fetchMarketBreadth: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-market-breadth.json');
      return null;
    }),
    fetchMarketInstTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-market-inst-trades.json');
      return null;
    }),
    fetchMarketMarginTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-tse-market-margin-trades.json');
      return null;
    }),
  },
  TpexScraper: {
    fetchStocksHistorical: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-stocks-historical.json');
      return null;
    }),
    fetchStocksInstTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-stocks-inst-trades.json');
      return null;
    }),
    fetchStocksFiniHoldings: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-stocks-fini-holdings.json');
      return null;
    }),
    fetchStocksMarginTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-stocks-margin-trades.json');
      return null;
    }),
    fetchStocksValues: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-stocks-values.json');
      return null;
    }),
    fetchIndicesHistorical: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-indices-historical.json');
      return null;
    }),
    fetchIndicesTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-indices-trades.json');
      return null;
    }),
    fetchMarketTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-market-trades.json');
      return null;
    }),
    fetchMarketBreadth: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-market-breadth.json');
      return null;
    }),
    fetchMarketInstTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-market-inst-trades.json');
      return null;
    }),
    fetchMarketMarginTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') return require('./fixtures/fetched-otc-market-margin-trades.json');
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
    fetchIndicesQuote: jest.fn(({ ticker }) => {
      if (ticker.symbol === 'IX0001' && ticker.market === 'TSE' && ticker.alias === 't00') {
        return require('./fixtures/fetched-indices-quote.json');
      }
      return null;
    }),
  },
  TdccScraper: {
    fetchStocksHolders: jest.fn(({ date, symbol }) => {
      if (date === '2022-12-30' && symbol === '2330') {
        return require('./fixtures/fetched-stocks-holders.json');
      }
      return null;
    }),
  },
  MopsScraper: {
    fetchStocksEps: jest.fn(({ market, year, quarter }) => {
      if (market === 'TSE' && year === 2023 && quarter === 1) {
        return require('./fixtures/fetched-tse-stocks-eps.json');
      }
      return null;
    }),
    fetchStocksRevenue: jest.fn(({ market, year, month, foreign }) => {
      if (market === 'TSE' && year === 2023 && month === 1 && !foreign) {
        return require('./fixtures/fetched-tse-stocks-revenue.json');
      }
      return null;
    }),
  },
  TaifexScraper: {
    fetchTxfInstTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') {
        return require('./fixtures/fetched-txf-inst-trades.json');
      }
      return null;
    }),
    fetchTxoInstTrades: jest.fn(({ date }) => {
      if (date === '2023-01-30') {
        return require('./fixtures/fetched-txo-inst-trades.json');
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

  describe('.stocks', () => {
    describe('.list()', () => {
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

    describe('.quote()', () => {
      it('should fetch stocks realtime quote', async () => {
        const stock = await twstock.stocks.quote({ symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should return null if the quote for the symbol is not found', async () => {
        const stock = await twstock.stocks.quote({ symbol: '2303' });
        expect(stock).toBe(null);
      });
    });

    describe('.historical()', () => {
      it('should fetch stocks historical data for the symbol', async () => {
        const stock = await twstock.stocks.historical({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });

      it('should throw an error if the symbol is not found', async () => {
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

      it('should fetch stocks historical data for the stock', async () => {
        const stock = await twstock.stocks.historical({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330')
      });
    });

    describe('.instTrades()', () => {
      it('should fetch stocks institutional investors\' trades for the symbol', async () => {
        const stock = await twstock.stocks.instTrades({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.instTrades({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should fetch stocks institutional investors\' trades for the TSE market', async () => {
        const stocks = await twstock.stocks.instTrades({ date: '2023-01-30', market: 'TSE' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'TSE')).toBe(true);
      });

      it('should fetch stocks institutional investors\' trades for the OTC market', async () => {
        const stocks = await twstock.stocks.instTrades({ date: '2023-01-30', market: 'OTC' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'OTC')).toBe(true);
      });

      it('should fetch stocks institutional investors\' trades for the stock', async () => {
        const stock = await twstock.stocks.instTrades({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });
    });

    describe('.finiHoldings()', () => {
      it('should fetch stocks FINI holdings for the symbol', async () => {
        const stock = await twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should fetch stocks FINI holdings for the TSE market', async () => {
        const stocks = await twstock.stocks.finiHoldings({ date: '2023-01-30', market: 'TSE' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'TSE')).toBe(true);
      });

      it('should fetch stocks FINI holdings for the OTC market', async () => {
        const stocks = await twstock.stocks.finiHoldings({ date: '2023-01-30', market: 'OTC' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'OTC')).toBe(true);
      });

      it('should fetch stocks FINI holdings for the stock', async () => {
        const stock = await twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });
    });

    describe('.marginTrades()', () => {
      it('should fetch stocks margin trades for the symbol', async () => {
        const stock = await twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.marginTrades({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should fetch stocks margin trades for the TSE market', async () => {
        const stocks = await twstock.stocks.marginTrades({ date: '2023-01-30', market: 'TSE' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'TSE')).toBe(true);
      });

      it('should fetch stocks margin trades for the OTC market', async () => {
        const stocks = await twstock.stocks.marginTrades({ date: '2023-01-30', market: 'OTC' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'OTC')).toBe(true);
      });

      it('should fetch stocks margin trades for the stock', async () => {
        const stock = await twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });
    });

    describe('.values()', () => {
      it('should fetch stocks values for the symbol', async () => {
        const stock = await twstock.stocks.values({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.values({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should fetch stocks values for the TSE market', async () => {
        const stocks = await twstock.stocks.values({ date: '2023-01-30', market: 'TSE' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'TSE')).toBe(true);
      });

      it('should fetch stocks values for the OTC market', async () => {
        const stocks = await twstock.stocks.values({ date: '2023-01-30', market: 'OTC' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every((stock: any) => stock.market === 'OTC')).toBe(true);
      });

      it('should fetch stocks values for the stock', async () => {
        const stock = await twstock.stocks.values({ date: '2023-01-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock.symbol).toBe('2330')
      });
    });

    describe('.holders()', () => {
      it('should fetch stocks holders for the symbol', async () => {
        const stock = await twstock.stocks.holders({ date: '2022-12-30', symbol: '2330' });
        expect(stock).toBeDefined();
        expect(stock?.symbol).toBe('2330');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.holders({ date: '2022-12-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should return null when no data is available', async () => {
        const stock = await twstock.stocks.holders({ date: '2023-01-01', symbol: '2330' });
        expect(stock).toBe(null);
      });
    });

    describe('.eps()', () => {
      it('should fetch stocks quarterly EPS for the market', async () => {
        const stocks = await twstock.stocks.eps({ market: 'TSE', year: 2023, quarter: 1 });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
      });
    });

    describe('.revenue()', () => {
      it('should fetch stocks monthly revenue for the market', async () => {
        const stocks = await twstock.stocks.revenue({ market: 'TSE', year: 2023, month: 1 });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
      });
    });
  });

  describe('.indices', () => {
    describe('.list()', () => {
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

    describe('.quote()', () => {
      it('should fetch indices realtime quote', async () => {
        const index = await twstock.indices.quote({ symbol: 'IX0001' });
        expect(index).toBeDefined();
        expect(index.symbol).toBe('IX0001');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.indices.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should return null if the quote for the symbol is not found', async () => {
        const index = await twstock.indices.quote({ symbol: 'TW50' });
        expect(index).toBe(null);
      });
    });

    describe('.historical()', () => {
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

      it('should fetch indices historical data for the OTC market', async () => {
        const indices = await twstock.indices.historical({ date: '2023-01-30', market: 'OTC' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every((index: any) => index.market === 'OTC')).toBe(true);
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.indices.historical({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.trades()', () => {
      it('should fetch indices trades for the symbol', async () => {
        const index = await twstock.indices.trades({ date: '2023-01-30', symbol: 'IX0028' });
        expect(index).toBeDefined();
        expect(index.symbol).toBe('IX0028');
      });

      it('should fetch indices trades for the TSE market', async () => {
        const indices = await twstock.indices.trades({ date: '2023-01-30', market: 'TSE' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every((index: any) => index.market === 'TSE')).toBe(true);
      });

      it('should fetch indices trades for the OTC market', async () => {
        const indices = await twstock.indices.trades({ date: '2023-01-30', market: 'OTC' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every((index: any) => index.market === 'OTC')).toBe(true);
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.indices.trades({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });
  });

  describe('.market', () => {
    describe('.trades()', () => {
      it('should fetch market trades for the TSE market', async () => {
        const market = await twstock.market.trades({ date: '2023-01-30', market: 'TSE' });
        expect(market).toBeDefined();
        expect(market?.market).toBe('TSE');
      });

      it('should fetch market trades for the TSE market', async () => {
        const market = await twstock.market.trades({ date: '2023-01-30', market: 'OTC' });
        expect(market).toBeDefined();
        expect(market?.market).toBe('OTC');
      });
    });

    describe('.breadth()', () => {
      it('should fetch market breadth for the TSE market', async () => {
        const market = await twstock.market.breadth({ date: '2023-01-30', market: 'TSE' });
        expect(market).toBeDefined();
        expect(market?.market).toBe('TSE');
      });

      it('should fetch market breadth for the TSE market', async () => {
        const market = await twstock.market.breadth({ date: '2023-01-30', market: 'OTC' });
        expect(market).toBeDefined();
        expect(market?.market).toBe('OTC');
      });
    });

    describe('.instTrades()', () => {
      it('should fetch market institutional investors\' trades for the TSE market', async () => {
        const market = await twstock.market.instTrades({ date: '2023-01-30', market: 'TSE' });
        expect(market).toBeDefined();
        expect(market?.market).toBe('TSE');
      });

      it('should fetch market institutional investors\' trades for the OTC market', async () => {
        const market = await twstock.market.instTrades({ date: '2023-01-30', market: 'OTC' });
        expect(market).toBeDefined();
        expect(market?.market).toBe('OTC');
      });
    });

    describe('.marginTrades()', () => {
      it('should fetch market margin trades for the TSE market', async () => {
        const market = await twstock.market.marginTrades({ date: '2023-01-30', market: 'TSE' });
        expect(market).toBeDefined();
        expect(market?.market).toBe('TSE');
      });

      it('should fetch market margin trades for the OTC market', async () => {
        const market = await twstock.market.marginTrades({ date: '2023-01-30', market: 'OTC' });
        expect(market).toBeDefined();
        expect(market?.market).toBe('OTC');
      });
    });
  });

  describe('.futopt', () => {
    describe('.txfInstTrades()', () => {
      it('should fetch TXF institutional investors\' trades', async () => {
        const txf = await twstock.futopt.txfInstTrades({ date: '2023-01-30' });
        expect(txf).toBeDefined();
      });

      it('should return null when no data is available', async () => {
        const txf = await twstock.futopt.txfInstTrades({ date: '2023-01-01' });
        expect(txf).toBe(null);
      });
    });

    describe('.txoInstTrades()', () => {
      it('should fetch TXO institutional investors\' trades', async () => {
        const txo = await twstock.futopt.txoInstTrades({ date: '2023-01-30' });
        expect(txo).toBeDefined();
      });

      it('should return null when no data is available', async () => {
        const txo = await twstock.futopt.txoInstTrades({ date: '2023-01-01' });
        expect(txo).toBe(null);
      });
    });
  });
});
