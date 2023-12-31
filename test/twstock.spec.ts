import { TwStock } from '../src';
import { TwseScraper } from '../src/scrapers/twse-scraper';
import { TpexScraper } from '../src/scrapers/tpex-scraper';
import { TaifexScraper } from '../src/scrapers/taifex-scraper';
import { TdccScraper } from '../src/scrapers/tdcc-scraper';
import { MisScraper } from '../src/scrapers/mis-scraper';
import { MopsScraper } from '../src/scrapers/mops-scraper';
import { IsinScraper } from '../src/scrapers/isin-scraper';

jest.mock('../src/scrapers/isin-scraper', () => {
  return {
    IsinScraper: function() {
      return {
        fetchStocksInfo: jest.fn(({ symbol }) => {
          if (symbol.split(',').includes('2330')) return require('./fixtures/fetched-stocks-info.json');
          if (symbol.split(',').includes('6488')) return require('./fixtures/fetched-stocks-info.json');
          return [];
        }),
        fetchListedStocks: jest.fn(({ market }) => {
          if (market === 'TSE') return require('./fixtures/fetched-tse-stocks-list.json');
          if (market === 'OTC') return require('./fixtures/fetched-otc-stocks-list.json');
          return [];
        }),
      }
    }
  }
});
jest.mock('../src/scrapers/mis-scraper', () => {
  function MisScraper() {}
  MisScraper.prototype.fetchListedIndices = jest.fn(({ market }) => {
    if (market === 'TSE') return require('./fixtures/fetched-tse-indices-list.json');
    if (market === 'OTC') return require('./fixtures/fetched-otc-indices-list.json');
    return [];
  });
  MisScraper.prototype.fetchStocksQuote = jest.fn();
  MisScraper.prototype.fetchIndicesQuote = jest.fn();
  return { MisScraper };
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
        expect(stocks?.length).toBeGreaterThan(0);
      });

      it('should load stocks and return the list for the TSE market', async () => {
        const stocks = await twstock.stocks.list({ market: 'TSE' });
        expect(stocks).toBeDefined();
        expect(stocks?.length).toBeGreaterThan(0);
        expect(stocks?.every(stock => stock.market === 'TSE')).toBe(true);
      });

      it('should load stocks and return the list for the OTC market', async () => {
        const stocks = await twstock.stocks.list({ market: 'OTC' });
        expect(stocks).toBeDefined();
        expect(stocks?.length).toBeGreaterThan(0);
        expect(stocks?.every(stock => stock.market === 'OTC')).toBe(true);
      });
    });

    describe('.quote()', () => {
      it('should fetch stocks realtime quote', async () => {
        await twstock.stocks.quote({ symbol: '2330' });
        expect(MisScraper.prototype.fetchStocksQuote).toHaveBeenCalled();
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.historical()', () => {
      it('should fetch TSE stocks historical data', async () => {
        await twstock.stocks.historical({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchStocksHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TSE stocks historical data for the symbol', async () => {
        await twstock.stocks.historical({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksHistorical).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch OTC stocks historical data', async () => {
        await twstock.stocks.historical({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchStocksHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC stocks historical data for the symbol', async () => {
        await twstock.stocks.historical({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksHistorical).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.historical({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.instTrades()', () => {
      it('should fetch TSE stocks institutional investors\' trades', async () => {
        await twstock.stocks.instTrades({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchStocksInstInvestorsTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TSE stocks institutional investors\' trades for the symbol', async () => {
        await twstock.stocks.instTrades({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksInstInvestorsTrades).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch OTC institutional investors\' trades', async () => {
        await twstock.stocks.instTrades({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchStocksInstInvestorsTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC stocks institutional investors\' trades for the symbol', async () => {
        await twstock.stocks.instTrades({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksInstInvestorsTrades).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.instTrades({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.finiHoldings()', () => {
      it('should fetch TSE stocks FINI holdings', async () => {
        await twstock.stocks.finiHoldings({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchStocksFiniHoldings).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TSE stocks FINI holdings for the symbol', async () => {
        await twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksFiniHoldings).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch OTC stocks FINI holdings', async () => {
        await twstock.stocks.finiHoldings({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchStocksFiniHoldings).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC stocks FINI holdings for the symbol', async () => {
        await twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksFiniHoldings).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.marginTrades()', () => {
      it('should fetch TSE stocks margin trades', async () => {
        await twstock.stocks.marginTrades({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchStocksMarginTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TSE stocks margin trades for the symbol', async () => {
        await twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksMarginTrades).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch OTC stocks margin trades', async () => {
        await twstock.stocks.marginTrades({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchStocksMarginTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC stocks margin trades for the symbol', async () => {
        await twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksMarginTrades).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.marginTrades({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.shortSales()', () => {
      it('should fetch TSE stocks short sales', async () => {
        await twstock.stocks.shortSales({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchStocksShortSales).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TSE stocks short sales for the symbol', async () => {
        await twstock.stocks.shortSales({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksShortSales).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch OTC stocks short sales', async () => {
        await twstock.stocks.shortSales({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchStocksShortSales).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC stocks short sales for the symbol', async () => {
        await twstock.stocks.shortSales({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksShortSales).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.shortSales({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.values()', () => {
      it('should fetch TSE stocks values', async () => {
        await twstock.stocks.values({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchStocksValues).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TSE stocks values for the symbol', async () => {
        await twstock.stocks.values({ date: '2023-01-30', symbol: '2330' });
        expect(TwseScraper.prototype.fetchStocksValues).toBeCalledWith({ date: '2023-01-30', symbol: '2330' });
      });

      it('should fetch OTC stocks values', async () => {
        await twstock.stocks.values({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchStocksValues).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC stocks values for the symbol', async () => {
        await twstock.stocks.values({ date: '2023-01-30', symbol: '6488' });
        expect(TpexScraper.prototype.fetchStocksValues).toBeCalledWith({ date: '2023-01-30', symbol: '6488' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.values({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.holders()', () => {
      it('should fetch stocks holders for the symbol', async () => {
        await twstock.stocks.holders({ date: '2022-12-30', symbol: '2330' });
        expect(TdccScraper.prototype.fetchStocksHolders).toBeCalledWith({ date: '2022-12-30', symbol: '2330' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.holders({ date: '2022-12-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.eps()', () => {
      it('should fetch TSE stocks quarterly EPS', async () => {
        await twstock.stocks.eps({ market: 'TSE', year: 2023, quarter: 1 });
        expect(MopsScraper.prototype.fetchStocksEps).toBeCalledWith({ market: 'TSE', year: 2023, quarter: 1 });
      });

      it('should fetch TSE stocks quarterly EPS for the symbol', async () => {
        await twstock.stocks.eps({ symbol: '2330', year: 2023, quarter: 1 });
        expect(MopsScraper.prototype.fetchStocksEps).toBeCalledWith({ market: 'TSE', symbol: '2330', year: 2023, quarter: 1 });
      });

      it('should throw an error if the market or symbol is not provided', async () => {
        await expect(() => twstock.stocks.eps({ year: 2023, quarter: 1 })).rejects.toThrow('Either "market" or "symbol" options must be specified');
      });

      it('should throw an error if both market and symbol are provided', async () => {
        await expect(() => twstock.stocks.eps({ market: 'TSE', symbol: '2330', year: 2023, quarter: 1 })).rejects.toThrow('One and only one of the "market" or "symbol" options must be specified');
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.stocks.eps({ symbol: 'foobar', year: 2023, quarter: 1 })).rejects.toThrow('symbol not found');
      });
    });

    describe('.revenue()', () => {
      it('should fetch TSE stocks monthly revenue', async () => {
        await twstock.stocks.revenue({ market: 'TSE', year: 2023, month: 1 });
        expect(MopsScraper.prototype.fetchStocksRevenue).toBeCalledWith({ market: 'TSE', year: 2023, month: 1 });
      });

      it('should fetch TSE stocks monthly revenue for the symbol', async () => {
        await twstock.stocks.revenue({ symbol: '2330', year: 2023, month: 1 });
        expect(MopsScraper.prototype.fetchStocksRevenue).toBeCalledWith({ market: 'TSE', symbol: '2330', year: 2023, month: 1 });
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
        expect(indices?.length).toBeGreaterThan(0);
      });

      it('should load indices and return the list for the TSE market', async () => {
        const indices = await twstock.indices.list({ market: 'TSE' });
        expect(indices).toBeDefined();
        expect(indices?.length).toBeGreaterThan(0);
        expect(indices?.every(stock => stock.market === 'TSE')).toBe(true);
      });

      it('should load indices and return the list for the OTC market', async () => {
        const indices = await twstock.indices.list({ market: 'OTC' });
        expect(indices).toBeDefined();
        expect(indices?.length).toBeGreaterThan(0);
        expect(indices?.every(stock => stock.market === 'OTC')).toBe(true);
      });
    });

    describe('.quote()', () => {
      it('should fetch indices realtime quote', async () => {
        await twstock.indices.quote({ symbol: 'IX0001' });
        expect(MisScraper.prototype.fetchIndicesQuote).toHaveBeenCalled();
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.indices.quote({ symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.historical()', () => {
      it('should fetch TSE indices historical data', async () => {
        await twstock.indices.historical({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchIndicesHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TSE indices historical data for the symbol', async () => {
        await twstock.indices.historical({ date: '2023-01-30', symbol: 'IX0001' });
        expect(TwseScraper.prototype.fetchIndicesHistorical).toBeCalledWith({ date: '2023-01-30', symbol: 'IX0001' });
      });

      it('should fetch OTC indices historical data', async () => {
        await twstock.indices.historical({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchIndicesHistorical).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC indices historical data', async () => {
        await twstock.indices.historical({ date: '2023-01-30', symbol: 'IX0043' });
        expect(TpexScraper.prototype.fetchIndicesHistorical).toBeCalledWith({ date: '2023-01-30', symbol: 'IX0043' });
      });

      it('should throw an error if the symbol is not found', async () => {
        await expect(() => twstock.indices.historical({ date: '2023-01-30', symbol: 'foobar' })).rejects.toThrow('symbol not found');
      });
    });

    describe('.trades()', () => {
      it('should fetch TSE indices trades', async () => {
        await twstock.indices.trades({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchIndicesTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch TSE indices trades for the symbol', async () => {
        await twstock.indices.trades({ date: '2023-01-30', symbol: 'IX0028' });
        expect(TwseScraper.prototype.fetchIndicesTrades).toBeCalledWith({ date: '2023-01-30', symbol: 'IX0028' });
      });

      it('should fetch OTC indices trades', async () => {
        await twstock.indices.trades({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchIndicesTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC indices trades for the symbol', async () => {
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
      it('should fetch TSE market trades', async () => {
        await twstock.market.trades({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchMarketTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC market trades', async () => {
        await twstock.market.trades({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchMarketTrades).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.breadth()', () => {
      it('should fetch TSE market breadth', async () => {
        await twstock.market.breadth({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchMarketBreadth).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC market breadth', async () => {
        await twstock.market.breadth({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchMarketBreadth).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.instTrades()', () => {
      it('should fetch TSE market institutional investors\' trades', async () => {
        await twstock.market.instTrades({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchMarketInstInvestorsTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC market institutional investors\' trades', async () => {
        await twstock.market.instTrades({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchMarketInstInvestorsTrades).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.marginTrades()', () => {
      it('should fetch TSE market margin trades', async () => {
        await twstock.market.marginTrades({ date: '2023-01-30', market: 'TSE' });
        expect(TwseScraper.prototype.fetchMarketMarginTrades).toBeCalledWith({ date: '2023-01-30' });
      });

      it('should fetch OTC market margin trades', async () => {
        await twstock.market.marginTrades({ date: '2023-01-30', market: 'OTC' });
        expect(TpexScraper.prototype.fetchMarketMarginTrades).toBeCalledWith({ date: '2023-01-30' });
      });
    });
  });

  describe('.futopt', () => {
    describe('.txfInstTrades()', () => {
      it('should fetch TXF institutional investors\' trades', async () => {
        await twstock.futopt.txfInstTrades({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchTxfInstTrades).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.txoInstTrades()', () => {
      it('should fetch TXO institutional investors\' trades', async () => {
        await twstock.futopt.txoInstTrades({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchTxoInstTrades).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.txoPutCallRatio()', () => {
      it('should fetch TXO Put/Call ratio', async () => {
        await twstock.futopt.txoPutCallRatio({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchTxoPutCallRatio).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.mxfRetailPosition()', () => {
      it('should fetch MXF retail position', async () => {
        await twstock.futopt.mxfRetailPosition({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchMxfRetailPosition).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.txfLargeTradersPosition()', () => {
      it('should fetch TXF large traders position', async () => {
        await twstock.futopt.txfLargeTradersPosition({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchTxfLargeTradersPosition).toBeCalledWith({ date: '2023-01-30' });
      });
    });

    describe('.txoLargeTradersPosition()', () => {
      it('should fetch TXO large traders position', async () => {
        await twstock.futopt.txoLargeTradersPosition({ date: '2023-01-30' });
        expect(TaifexScraper.prototype.fetchTxoLargeTradersPosition).toBeCalledWith({ date: '2023-01-30' });
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
