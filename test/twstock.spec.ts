import { TwStock } from '../src';
import { TwseScraper } from '../src/scrapers/twse-scraper';
import { TpexScraper } from '../src/scrapers/tpex-scraper';
import { TaifexScraper } from '../src/scrapers/taifex-scraper';
import { TdccScraper } from '../src/scrapers/tdcc-scraper';
import { MisTwseScraper } from '../src/scrapers/mis-twse-scraper';
import { MisTaifexScraper } from '../src/scrapers/mis-taifex-scraper';
import { MopsScraper } from '../src/scrapers/mops-scraper';
import { IsinScraper } from '../src/scrapers/isin-scraper';

jest.mock('../src/scrapers/isin-scraper', () => {
  return {
    IsinScraper: function() {
      return {
        fetchListed: jest.fn(({ symbol }) => {
          if (symbol.split(',').includes('2330')) return require('./fixtures/fetched-stocks-list.json');
          if (symbol.split(',').includes('6488')) return require('./fixtures/fetched-stocks-list.json');
          if (symbol.split(',').includes('TXFA4')) return require('./fixtures/fetched-stocks-list.json');
          return [];
        }),
        fetchListedStocks: jest.fn(({ exchange }) => {
          if (exchange === 'TWSE') return require('./fixtures/fetched-twse-stocks-list.json');
          if (exchange === 'TPEx') return require('./fixtures/fetched-tpex-stocks-list.json');
          return [];
        }),
        fetchListedFutOpt: jest.fn(options => {
          if (options?.type === 'F') return require('./fixtures/fetched-taifex-futures-contracts.json');
          if (options?.type === 'O') return require('./fixtures/fetched-taifex-options-contracts.json');
          return require('./fixtures/fetched-taifex-futopt-contracts.json');
        }),
      }
    }
  }
});
jest.mock('../src/scrapers/mis-twse-scraper', () => {
  function MisTwseScraper() {}
  MisTwseScraper.prototype.fetchListedIndices = jest.fn(({ exchange }) => {
    if (exchange === 'TWSE') return require('./fixtures/fetched-twse-indices-list.json');
    if (exchange === 'TPEx') return require('./fixtures/fetched-tpex-indices-list.json');
    return [];
  });
  MisTwseScraper.prototype.fetchStocksQuote = jest.fn();
  MisTwseScraper.prototype.fetchIndicesQuote = jest.fn();
  return { MisTwseScraper };
});
jest.mock('../src/scrapers/mis-taifex-scraper', () => {
  function MisTaifexScraper() {}
  MisTaifexScraper.prototype.fetchListedFutOpt = jest.fn((options) => {
    if (options?.type === 'F') return require('./fixtures/fetched-taifex-futures-list.json');
    if (options?.type === 'O') return require('./fixtures/fetched-taifex-options-list.json');
    return require('./fixtures/fetched-taifex-futopt-list.json');;
  });
  MisTaifexScraper.prototype.fetchFutOptQuoteList = jest.fn();
  MisTaifexScraper.prototype.fetchFutOptQuoteDetail = jest.fn();
  return { MisTaifexScraper };
});
jest.mock('../src/scrapers/twse-scraper');
jest.mock('../src/scrapers/tpex-scraper');
jest.mock('../src/scrapers/taifex-scraper');
jest.mock('../src/scrapers/tdcc-scraper');
jest.mock('../src/scrapers/mops-scraper');

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

      it('should load stocks and return the list for the TWSE listed', async () => {
        const stocks = await twstock.stocks.list({ exchange: 'TWSE' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every(stock => stock.exchange === 'TWSE')).toBe(true);
      });

      it('should load stocks and return the list for the TPEx listed', async () => {
        const stocks = await twstock.stocks.list({ exchange: 'TPEx' });
        expect(stocks).toBeDefined();
        expect(stocks.length).toBeGreaterThan(0);
        expect(stocks.every(stock => stock.exchange === 'TPEx')).toBe(true);
      });
    });

    describe('.quote()', () => {
      it('should fetch stocks realtime quote', async () => {
        await twstock.stocks.quote({ symbol: '2330' });
        expect(MisTwseScraper.prototype.fetchStocksQuote).toHaveBeenCalled();
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.historical()', () => {
      it('should fetch TWSE listed stocks historical data', async () => {
        await twstock.stocks.historical({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks historical data for the symbol', async () => {
        await twstock.stocks.historical({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksHistorical).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed stocks historical data', async () => {
        await twstock.stocks.historical({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks historical data for the symbol', async () => {
        await twstock.stocks.historical({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksHistorical).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.historical({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.institutional()', () => {
      it('should fetch TWSE listed stocks institutional investors\' trades', async () => {
        await twstock.stocks.institutional({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksInstitutional).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks institutional investors\' trades for the symbol', async () => {
        await twstock.stocks.institutional({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksInstitutional).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed institutional investors\' trades', async () => {
        await twstock.stocks.institutional({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksInstitutional).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks institutional investors\' trades for the symbol', async () => {
        await twstock.stocks.institutional({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksInstitutional).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.institutional({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.finiHoldings()', () => {
      it('should fetch TWSE listed stocks FINI holdings', async () => {
        await twstock.stocks.finiHoldings({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksFiniHoldings).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks FINI holdings for the symbol', async () => {
        await twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksFiniHoldings).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed stocks FINI holdings', async () => {
        await twstock.stocks.finiHoldings({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksFiniHoldings).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks FINI holdings for the symbol', async () => {
        await twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksFiniHoldings).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.marginTrades()', () => {
      it('should fetch TWSE listed stocks margin trades', async () => {
        await twstock.stocks.marginTrades({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksMarginTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks margin trades for the symbol', async () => {
        await twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksMarginTrades).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed stocks margin trades', async () => {
        await twstock.stocks.marginTrades({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksMarginTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks margin trades for the symbol', async () => {
        await twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksMarginTrades).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.marginTrades({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.shortSales()', () => {
      it('should fetch TWSE listed stocks short sales', async () => {
        await twstock.stocks.shortSales({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksShortSales).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks short sales for the symbol', async () => {
        await twstock.stocks.shortSales({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksShortSales).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed stocks short sales', async () => {
        await twstock.stocks.shortSales({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksShortSales).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks short sales for the symbol', async () => {
        await twstock.stocks.shortSales({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksShortSales).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.shortSales({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.values()', () => {
      it('should fetch TWSE listed stocks values', async () => {
        await twstock.stocks.values({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksValues).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks values for the symbol', async () => {
        await twstock.stocks.values({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksValues).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed stocks values', async () => {
        await twstock.stocks.values({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksValues).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks values for the symbol', async () => {
        await twstock.stocks.values({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksValues).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.values({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.dividends()', () => {
      it('should fetch TWSE listed stocks dividends', async () => {
        await twstock.stocks.dividends({ startDate: '2023-01-30', endDate: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksDividends).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks dividends for the symbol', async () => {
        await twstock.stocks.dividends({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksDividends).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed stocks dividends', async () => {
        await twstock.stocks.dividends({ startDate: '2023-01-30', endDate: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksDividends).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks dividends for the symbol', async () => {
        await twstock.stocks.dividends({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksDividends).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.dividends({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.capitalReductions()', () => {
      it('should fetch TWSE listed stocks capital reductions', async () => {
        await twstock.stocks.capitalReductions({ startDate: '2023-01-30', endDate: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksCapitalReductions).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks capital reductions for the symbol', async () => {
        await twstock.stocks.capitalReductions({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksCapitalReductions).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed stocks capital reductions', async () => {
        await twstock.stocks.capitalReductions({ startDate: '2023-01-30', endDate: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksCapitalReductions).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks capital reductions for the symbol', async () => {
        await twstock.stocks.capitalReductions({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksCapitalReductions).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.capitalReductions({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.splits()', () => {
      it('should fetch TWSE listed stocks change of par value', async () => {
        await twstock.stocks.splits({ startDate: '2023-01-30', endDate: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchStocksSplits).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30' });
      });

      it('should fetch TWSE listed stocks change of par value for the symbol', async () => {
        await twstock.stocks.splits({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksSplits).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '2330' });
      });

      it('should fetch TPEx listed stocks change of par value', async () => {
        await twstock.stocks.splits({ startDate: '2023-01-30', endDate: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchStocksSplits).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30' });
      });

      it('should fetch TPEx listed stocks change of par value for the symbol', async () => {
        await twstock.stocks.splits({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksSplits).toBeCalledWith({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.splits({ startDate: '2023-01-30', endDate: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.shareholders()', () => {
      it('should fetch stocks holders for the symbol', async () => {
        await twstock.stocks.shareholders({ date: '2022-12-30', symbol: '2330' });
        expect(TdccScraper.prototype.fetchStocksShareholders).toBeCalledWith({ date: '2022-12-30', symbol: '2330' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.shareholders({ date: '2022-12-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });

      it('should fetch stocks holders from the recent week', async () => {
        await twstock.stocks.shareholders();
        expect(TdccScraper.prototype.fetchStocksShareholdersRecentWeek).toBeCalledWith();
      });

      it('should fetch stocks holders for the symbol from the recent week', async () => {
        await twstock.stocks.shareholders({ symbol: '2330' });
        expect(TdccScraper.prototype.fetchStocksShareholdersRecentWeek).toBeCalledWith({ symbol: '2330' });
      });
    });

    describe('.eps()', () => {
      it('should fetch TWSE listed stocks quarterly EPS', async () => {
        await twstock.stocks.eps({ exchange: 'TWSE', year: 2023, quarter: 1 });
        expect(MopsScraper.prototype.fetchStocksEps).toBeCalledWith({ exchange: 'TWSE', year: 2023, quarter: 1 });
      });

      it('should fetch TWSE listed stocks quarterly EPS for the symbol', async () => {
        await twstock.stocks.eps({ symbol: '2330', year: 2023, quarter: 1 });
        expect(MopsScraper.prototype.fetchStocksEps).toBeCalledWith({ exchange: 'TWSE', symbol: '2330', year: 2023, quarter: 1 });
      });

      it('should throw an error if the exchange or symbol is not provided', async () => {
        await expect(() => twstock.stocks.eps({ year: 2023, quarter: 1 })).rejects.toThrow('Either "exchange" or "symbol" options must be specified');
      });

      it('should throw an error if both exchange and symbol are provided', async () => {
        await expect(() => twstock.stocks.eps({ exchange: 'TWSE', symbol: '2330', year: 2023, quarter: 1 })).rejects.toThrow('One and only one of the "exchange" or "symbol" options must be specified');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.eps({ symbol: 'foobar', year: 2023, quarter: 1 })).rejects.toThrow('symbol not found');
      });
    });

    describe('.revenue()', () => {
      it('should fetch TWSE listed stocks monthly revenue', async () => {
        await twstock.stocks.revenue({ exchange: 'TWSE', year: 2023, month: 1 });
        expect(MopsScraper.prototype.fetchStocksRevenue).toBeCalledWith({ exchange: 'TWSE', year: 2023, month: 1 });
      });

      it('should fetch TWSE listed stocks monthly revenue for the symbol', async () => {
        await twstock.stocks.revenue({ symbol: '2330', year: 2023, month: 1 });
        expect(MopsScraper.prototype.fetchStocksRevenue).toBeCalledWith({ exchange: 'TWSE', symbol: '2330', year: 2023, month: 1 });
      });

      it('should throw an error if the exchange or symbol is not provided', async () => {
        await expect(() => twstock.stocks.revenue({ year: 2023, month: 1 })).rejects.toThrow('Either "exchange" or "symbol" options must be specified');
      });

      it('should throw an error if both exchange and symbol are provided', async () => {
        await expect(() => twstock.stocks.revenue({ exchange: 'TWSE', symbol: '2330', year: 2023, month: 1 })).rejects.toThrow('One and only one of the "exchange" or "symbol" options must be specified');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.revenue({ symbol: 'foobar', year: 2023, month: 1 })).rejects.toThrow('symbol not found');
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

      it('should load indices and return the list for the TWSE listed', async () => {
        const indices = await twstock.indices.list({ exchange: 'TWSE' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every(stock => stock.exchange === 'TWSE')).toBe(true);
      });

      it('should load indices and return the list for the TPEx listed', async () => {
        const indices = await twstock.indices.list({ exchange: 'TPEx' });
        expect(indices).toBeDefined();
        expect(indices.length).toBeGreaterThan(0);
        expect(indices.every(stock => stock.exchange === 'TPEx')).toBe(true);
      });
    });

    describe('.quote()', () => {
      it('should fetch indices realtime quote', async () => {
        await twstock.indices.quote({ symbol: 'IX0001' });
        expect(MisTwseScraper.prototype.fetchIndicesQuote).toHaveBeenCalled();
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.indices.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.historical()', () => {
      it('should fetch TWSE listed indices historical data', async () => {
        await twstock.indices.historical({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchIndicesHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TWSE listed indices historical data for the symbol', async () => {
        await twstock.indices.historical({ date: '2023-01-30', symbol: 'IX0001' });
        expect(TwseScraper.prototype.fetchIndicesHistorical).toBeCalledWith({ date: '2023-01-30', symbol: 'IX0001' });
      });

      it('should fetch TPEx listed indices historical data', async () => {
        await twstock.indices.historical({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchIndicesHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx listed indices historical data', async () => {
        await twstock.indices.historical({ date: '2023-01-30', symbol: 'IX0043' });
        expect(TpexScraper.prototype.fetchIndicesHistorical).toBeCalledWith({ date: '2023-01-30', symbol: 'IX0043' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.indices.historical({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.trades()', () => {
      it('should fetch TWSE listed indices trades', async () => {
        await twstock.indices.trades({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchIndicesTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TWSE listed indices trades for the symbol', async () => {
        await twstock.indices.trades({ date: '2023-01-30', symbol: 'IX0028' });
        expect(TwseScraper.prototype.fetchIndicesTrades).toBeCalledWith({ date: '2023-01-30', symbol: 'IX0028' });
      });

      it('should fetch TPEx listed indices trades', async () => {
        await twstock.indices.trades({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchIndicesTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx listed indices trades for the symbol', async () => {
        await twstock.indices.trades({ date: '2023-01-30', symbol: 'IX0053' });
        expect(TpexScraper.prototype.fetchIndicesTrades).toBeCalledWith({ date: '2023-01-30', symbol: 'IX0053' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.indices.trades({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });
  });

  describe('.market', () => {
    describe('.trades()', () => {
      it('should fetch TWSE market trades', async () => {
        await twstock.market.trades({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchMarketTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx market trades', async () => {
        await twstock.market.trades({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchMarketTrades).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.breadth()', () => {
      it('should fetch TWSE market breadth', async () => {
        await twstock.market.breadth({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchMarketBreadth).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx market breadth', async () => {
        await twstock.market.breadth({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchMarketBreadth).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.institutional()', () => {
      it('should fetch TWSE market institutional investors\' trades', async () => {
        await twstock.market.institutional({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchMarketInstitutional).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx market institutional investors\' trades', async () => {
        await twstock.market.institutional({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchMarketInstitutional).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.marginTrades()', () => {
      it('should fetch TWSE market margin trades', async () => {
        await twstock.market.marginTrades({ date: '2023-01-30', exchange: 'TWSE' });
        expect(TwseScraper.prototype.fetchMarketMarginTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TPEx market margin trades', async () => {
        await twstock.market.marginTrades({ date: '2023-01-30', exchange: 'TPEx' });
        expect(TpexScraper.prototype.fetchMarketMarginTrades).toBeCalledWith({ date: '2023-01-30' });
      });
    });
  });

  describe('.futopt', () => {
    describe('.list()', () => {
      it('should load futures & options and return the list', async () => {
        const futopt = await twstock.futopt.list();
        expect(futopt).toBeDefined();
        expect(futopt.length).toBeGreaterThan(0);
      });

      it('should load futures and return the list', async () => {
        const futopt = await twstock.futopt.list({ type: 'F' });
        expect(futopt).toBeDefined();
        expect(futopt.length).toBeGreaterThan(0);
      });

      it('should load options and return the list', async () => {
        const futopt = await twstock.futopt.list({ type: 'O' });
        expect(futopt).toBeDefined();
        expect(futopt.length).toBeGreaterThan(0);
      });

      it('should load available futures & options contracts and return the list', async () => {
        const futopt = await twstock.futopt.list({ availableContracts: true });
        expect(futopt).toBeDefined();
        expect(futopt.length).toBeGreaterThan(0);
      });

      it('should load available futures contracts and return the list', async () => {
        const futopt = await twstock.futopt.list({ type: 'F', availableContracts: true });
        expect(futopt).toBeDefined();
        expect(futopt.length).toBeGreaterThan(0);
      });

      it('should load available options contracts and return the list', async () => {
        const futopt = await twstock.futopt.list({ type: 'O', availableContracts: true });
        expect(futopt).toBeDefined();
        expect(futopt.length).toBeGreaterThan(0);
      });
    });

    describe('.quote()', () => {
      it('should fetch futopt realtime quote list', async () => {
        await twstock.futopt.quote({ symbol: 'TXF' });
        expect(MisTaifexScraper.prototype.fetchFutOptQuoteList).toHaveBeenCalled();
      });

      it('should fetch futopt realtime quote detail', async () => {
        await twstock.futopt.quote({ symbol: 'TXFA4' });
        expect(MisTaifexScraper.prototype.fetchFutOptQuoteDetail).toHaveBeenCalled();
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.futopt.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.historical()', () => {
      it('should fetch futures historical data', async () => {
        await twstock.futopt.historical({ date: '2023-01-30', type: 'F' });
        expect(TaifexScraper.prototype.fetchFuturesHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch options historical data', async () => {
        await twstock.futopt.historical({ date: '2023-01-30', type: 'O' });
        expect(TaifexScraper.prototype.fetchOptionsHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TXF historical data', async () => {
        await twstock.futopt.historical({ date: '2023-01-30', symbol: 'TXF' });
        expect(TaifexScraper.prototype.fetchFuturesHistorical).toBeCalledWith({ date: '2023-01-30', symbol: 'TXF' });
      });

      it('should fetch TXO historical data', async () => {
        await twstock.futopt.historical({ date: '2023-01-30', symbol: 'TXO' });
        expect(TaifexScraper.prototype.fetchOptionsHistorical).toBeCalledWith({ date: '2023-01-30', symbol: 'TXO' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.futopt.historical({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.institutional()', () => {
      it('should fetch futures institutional investors\' trades', async () => {
        await twstock.futopt.institutional({ date: '2023-01-30', symbol: 'TXF' });
        expect(TaifexScraper.prototype.fetchFuturesInstitutional).toBeCalledWith({ date: '2023-01-30', symbol: 'TXF' });
      });

      it('should fetch options institutional investors\' trades', async () => {
        await twstock.futopt.institutional({ date: '2023-01-30', symbol: 'TXO' });
        expect(TaifexScraper.prototype.fetchOptionsInstitutional).toBeCalledWith({ date: '2023-01-30', symbol: 'TXO' });
      });
    });

    describe('.largeTraders()', () => {
      it('should fetch futures large traders\' position', async () => {
        await twstock.futopt.largeTraders({ date: '2023-01-30', symbol: 'TXF' });
        expect(TaifexScraper.prototype.fetchFuturesLargeTraders).toBeCalledWith({ date: '2023-01-30', symbol: 'TXF' });
      });

      it('should fetch options large traders\' position', async () => {
        await twstock.futopt.largeTraders({ date: '2023-01-30', symbol: 'TXO' });
        expect(TaifexScraper.prototype.fetchOptionsLargeTraders).toBeCalledWith({ date: '2023-01-30', symbol: 'TXO' });
      });
    });

    describe('.mxfRetailPosition()', () => {
      it('should fetch MXF retail position', async () => {
        await twstock.futopt.mxfRetailPosition({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchMxfRetailPosition).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.tmfRetailPosition()', () => {
      it('should fetch TMF retail position', async () => {
        await twstock.futopt.tmfRetailPosition({ date: '2024-08-09' });
        expect(TaifexScraper.prototype.fetchTmfRetailPosition).toBeCalledWith({ date: '2024-08-09' });
      });
    });

    describe('.txoPutCallRatio()', () => {
      it('should fetch TXO Put/Call ratio', async () => {
        await twstock.futopt.txoPutCallRatio({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchTxoPutCallRatio).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.exchangeRates()', () => {
      it('should fetch exchange rates', async () => {
        await twstock.futopt.exchangeRates({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchExchangeRates).toBeCalledWith({ date: '2023-01-30' });
      });
    });
  });
});
