import { omit, map } from 'lodash';
import { ScraperFactory } from './scrapers';
import { Market } from './enums';
import { RateLimitOptions, Ticker } from './interfaces';

export class TwStock {
  private readonly _scraper: ScraperFactory;
  private readonly _stocks = new Map<string, Ticker>();
  private readonly _indices = new Map<string, Ticker>();
  private readonly _futopt = new Map<string, Ticker>();

  constructor(options?: RateLimitOptions) {
    this._scraper = new ScraperFactory(options);
  }

  get stocks() {
    return {
      list: this.getStocksList.bind(this),
      quote: this.getStocksQuote.bind(this),
      historical: this.getStocksHistorical.bind(this),
      instTrades: this.getStocksInstTrades.bind(this),
      finiHoldings: this.getStocksFiniHoldings.bind(this),
      marginTrades: this.getStocksMarginTrades.bind(this),
      shortSales: this.getStocksShortSales.bind(this),
      values: this.getStocksValues.bind(this),
      holders: this.getStocksHolders.bind(this),
      eps: this.getStocksEps.bind(this),
      revenue: this.getStocksRevenue.bind(this),
    };
  }

  get indices() {
    return {
      list: this.getIndicesList.bind(this),
      quote: this.getIndicesQuote.bind(this),
      historical: this.getIndicesHistorical.bind(this),
      trades: this.getIndicesTrades.bind(this),
    };
  }

  get market() {
    return {
      trades: this.getMarketTrades.bind(this),
      breadth: this.getMarketBreadth.bind(this),
      instTrades: this.getMarketInstTrades.bind(this),
      marginTrades: this.getMarketMarginTrades.bind(this),
    };
  }

  get futopt() {
    return {
      list: this.getFutOptList.bind(this),
      quote: this.getFutOptQuote.bind(this),
      historical: this.getFutOptHistorical.bind(this),
      txfInstTrades: this.getFutOptTxfInstTrades.bind(this),
      txoInstTrades: this.getFutOptTxoInstTrades.bind(this),
      txoPutCallRatio: this.getFutOptTxoPutCallRatio.bind(this),
      mxfRetailPosition: this.getFutOptMxfRetailPosition.bind(this),
      txfLargeTradersPosition: this.getFutOptTxfLargeTradersPosition.bind(this),
      txoLargeTradersPosition: this.getFutOptTxoLargeTradersPosition.bind(this),
      exchangeRates: this.getFutOptExchangeRates.bind(this),
    };
  }

  private async loadStocks(options?: { symbol?: string }) {
    const { symbol } = options ?? {};
    const isinScraper = this._scraper.getIsinScraper();

    const stocks = (symbol)
      ? await isinScraper.fetchStocksInfo({ symbol })
      : await Promise.all([
          isinScraper.fetchListedStocks({ market: Market.TSE }),
          isinScraper.fetchListedStocks({ market: Market.OTC }),
        ]).then(results => results.flat());

    stocks.forEach(({ symbol, ...ticker }) => this._stocks.set(symbol, { symbol, ...ticker }));

    return stocks;
  }

  private async loadIndices() {
    const misScraper = this._scraper.getMisTwseScraper();

    const data = await Promise.all([
      misScraper.fetchListedIndices({ market: Market.TSE }),
      misScraper.fetchListedIndices({ market: Market.OTC }),
    ]).then(results => results.flat());

    const indices = data
      .filter(({ symbol, ...ticker }) => {
        const isExist = this._indices.has(symbol);
        if (!isExist) this._indices.set(symbol, { symbol, ...ticker });
        return !isExist;
      })
      .map(ticker => omit(ticker, 'ex_ch'));

    return indices;
  }

  private async loadFutOpt(options?: { symbol?: string }) {
    const { symbol } = options ?? {};
    const isinScraper = this._scraper.getIsinScraper();

    const futopt = (symbol)
      ? await isinScraper.fetchStocksInfo({ symbol })
      : await isinScraper.fetchListedFutOpt();

    futopt.forEach(({ symbol, ...ticker }) => this._futopt.set(symbol, { symbol, ...ticker }));

    return futopt;
  }

  private async getStocksList(options?: { market: 'TSE' | 'OTC' }) {
    const { market } = options ?? {};
    const data = await this.loadStocks();
    return market ? data.filter(ticker => ticker.market === market) : data;
  }

  private async getStocksQuote(options: { symbol: string, odd?: boolean }) {
    const { symbol, odd } = options;

    if (!this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol) as Ticker;
    return this._scraper.getMisTwseScraper().fetchStocksQuote({ ticker, odd });
  }

  private async getStocksHistorical(options: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchStocksHistorical({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksHistorical({ date, symbol });
  }

  private async getStocksInstTrades(options: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchStocksInstInvestorsTrades({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksInstInvestorsTrades({ date, symbol });
  }

  private async getStocksFiniHoldings(options: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchStocksFiniHoldings({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksFiniHoldings({ date, symbol });
  }

  private async getStocksMarginTrades(options: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchStocksMarginTrades({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksMarginTrades({ date, symbol });
  }

  private async getStocksShortSales(options: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchStocksShortSales({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksShortSales({ date, symbol });
  }

  private async getStocksValues(options: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchStocksValues({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksValues({ date, symbol });
  }

  private async getStocksHolders(options: { date: string, symbol: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    return this._scraper.getTdccScraper().fetchStocksHolders({ date, symbol });
  }

  private async getStocksEps(options: { year: number, quarter: number, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { symbol, year, quarter } = options;

    if (!options.market && !options.symbol) {
      throw new Error('Either "market" or "symbol" options must be specified');
    }
    if (options.market && options.symbol) {
      throw new Error('One and only one of the "market" or "symbol" options must be specified');
    }
    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market as string;

    return this._scraper.getMopsScraper().fetchStocksEps({ market, year, quarter, symbol });
  }

  private async getStocksRevenue(options: { market?: 'TSE' | 'OTC', year: number, month: number, foreign?: boolean, symbol?: string  }) {
    const { symbol, year, month, foreign } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market as string;

    return this._scraper.getMopsScraper().fetchStocksRevenue({ market, year, month, foreign, symbol });
  }

  private async getIndicesList(options?: { market: 'TSE' | 'OTC' }) {
    const { market } = options ?? {};
    const data = await this.loadIndices();
    return market ? data.filter(ticker => ticker.market === market) : data;
  }

  private async getIndicesQuote(options: { symbol: string }) {
    const { symbol } = options;

    if (!this._indices.has(symbol)) {
      const indices = await this.loadIndices();
      if (!map(indices, 'symbol').includes(symbol)) throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol) as Ticker;
    return this._scraper.getMisTwseScraper().fetchIndicesQuote({ ticker });
  }

  private async getIndicesHistorical(options: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._indices.has(symbol)) {
      const indices = await this.loadIndices();
      if (!map(indices, 'symbol').includes(symbol)) throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchIndicesHistorical({ date, symbol })
      : await this._scraper.getTwseScraper().fetchIndicesHistorical({ date, symbol });
  }

  private async getIndicesTrades(options: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._indices.has(symbol)) {
      const indices = await this.loadIndices();
      if (!map(indices, 'symbol').includes(symbol)) throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : options.market;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchIndicesTrades({ date, symbol })
      : await this._scraper.getTwseScraper().fetchIndicesTrades({ date, symbol });
  }


  private async getMarketTrades(options: { date: string, market?: 'TSE' | 'OTC' }) {
    const { date, market } = options;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchMarketTrades({ date })
      : await this._scraper.getTwseScraper().fetchMarketTrades({ date });
  }

  private async getMarketBreadth(options: { date: string, market?: 'TSE' | 'OTC' }) {
    const { date, market } = options;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchMarketBreadth({ date })
      : await this._scraper.getTwseScraper().fetchMarketBreadth({ date });
  }

  private async getMarketInstTrades(options: { date: string, market?: 'TSE' | 'OTC' }) {
    const { date, market } = options;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchMarketInstInvestorsTrades({ date })
      : await this._scraper.getTwseScraper().fetchMarketInstInvestorsTrades({ date });
  }

  private async getMarketMarginTrades(options: { date: string, market?: 'TSE' | 'OTC' }) {
    const { date, market } = options;

    return (market === Market.OTC)
      ? await this._scraper.getTpexScraper().fetchMarketMarginTrades({ date })
      : await this._scraper.getTwseScraper().fetchMarketMarginTrades({ date });
  }

  private async getFutOptList() {
    const data = await this.loadFutOpt();
    return data;
  }

  private async getFutOptQuote(options: { symbol: string, afterhours?: boolean }) {
    const { symbol, afterhours } = options;

    if (!this._futopt.has(symbol)) {
      const futopt = await this.loadFutOpt({ symbol });
      if (!futopt.length) throw new Error('symbol not found');
    }

    const ticker = this._futopt.get(symbol) as Ticker;
    return this._scraper.getMisTaifexScraper().fetchFutOptQuote({ ticker, afterhours });
  }

  private async getFutOptHistorical(options: { date: string, symbol: string, afterhours?: boolean }) {
    const { date, symbol, afterhours } = options;

    const type = (symbol.charAt(2) === 'O') ? 'O' : 'F';
    return (type === 'O')
      ? this._scraper.getTaifexScraper().fetchOptionsHistorical({ date, symbol, afterhours })
      : this._scraper.getTaifexScraper().fetchFuturesHistorical({ date, symbol, afterhours });
  }

  private async getFutOptTxfInstTrades(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchTxfInstTrades({ date });
  }

  private async getFutOptTxoInstTrades(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchTxoInstTrades({ date });
  }

  private async getFutOptTxoPutCallRatio(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchTxoPutCallRatio({ date });
  }

  private async getFutOptMxfRetailPosition(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchMxfRetailPosition({ date });
  }

  private async getFutOptTxfLargeTradersPosition(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchTxfLargeTradersPosition({ date });
  }

  private async getFutOptTxoLargeTradersPosition(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchTxoLargeTradersPosition({ date });
  }

  private async getFutOptExchangeRates(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchExchangeRates({ date });
  }
}
