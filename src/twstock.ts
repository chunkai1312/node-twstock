import { omit, map } from 'lodash';
import { ScraperFactory } from './scrapers';
import { Exchange } from './enums';
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
      list: this.fetchStocksList.bind(this),
      quote: this.fetchStocksQuote.bind(this),
      historical: this.fetchStocksHistorical.bind(this),
      institutional: this.fetchStocksInstitutional.bind(this),
      values: this.fetchStocksValues.bind(this),
      finiHoldings: this.fetchStocksFiniHoldings.bind(this),
      marginTrades: this.fetchStocksMarginTrades.bind(this),
      shortSales: this.fetchStocksShortSales.bind(this),
      shareholders: this.fetchStocksShareholders.bind(this),
      eps: this.fetchStocksEps.bind(this),
      revenue: this.fetchStocksRevenue.bind(this),
      dividends: this.fetchStocksDividends.bind(this),
      capitalReduction: this.fetchStocksCapitalReduction.bind(this),
      splits: this.fetchStocksSplits.bind(this),
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
      institutional: this.getMarketInstitutional.bind(this),
      marginTrades: this.getMarketMarginTrades.bind(this),
    };
  }

  get futopt() {
    return {
      list: this.getFutOptList.bind(this),
      quote: this.getFutOptQuote.bind(this),
      historical: this.getFutOptHistorical.bind(this),
      institutional: this.getFutOptInstitutional.bind(this),
      largeTraders: this.getFutOptLargeTraders.bind(this),
      mxfRetailPosition: this.getFutOptMxfRetailPosition.bind(this),
      tmfRetailPosition: this.getFutOptTmfRetailPosition.bind(this),
      txoPutCallRatio: this.getFutOptTxoPutCallRatio.bind(this),
      exchangeRates: this.getFutOptExchangeRates.bind(this),
    };
  }

  private async loadStocks(options?: { symbol?: string }) {
    const { symbol } = options ?? {};
    const isinScraper = this._scraper.getIsinScraper();

    const stocks = (symbol)
      ? await isinScraper.fetchListed({ symbol })
      : await Promise.all([
          isinScraper.fetchListedStocks({ exchange: Exchange.TWSE }),
          isinScraper.fetchListedStocks({ exchange: Exchange.TPEx }),
        ]).then(results => results.flat());

    stocks.forEach(({ symbol, ...ticker }) => this._stocks.set(symbol, { symbol, ...ticker }));

    return stocks;
  }

  private async loadIndices() {
    const misScraper = this._scraper.getMisTwseScraper();

    const data = await Promise.all([
      misScraper.fetchListedIndices({ exchange: Exchange.TWSE }),
      misScraper.fetchListedIndices({ exchange: Exchange.TPEx }),
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

  private async loadFutOpt(options?: { type?: 'F' | 'O' }) {
    const { type } = options ?? {};
    const misTaifexScraper = this._scraper.getMisTaifexScraper();

    const futopt = await (() => {
      switch (type) {
        case 'F': return misTaifexScraper.fetchListedFutOpt({ type: 'F' });
        case 'O': return misTaifexScraper.fetchListedFutOpt({ type: 'O' });
        default: return misTaifexScraper.fetchListedFutOpt();
      }
    })() as Ticker[];

    futopt.forEach(({ symbol, ...ticker }) => this._futopt.set(symbol, { symbol, ...ticker }));

    return futopt;
  }

  private async loadFutOptContracts(options: { symbol?: string, type?: 'F' | 'O' }) {
    const { symbol, type } = options;
    const isinScraper = this._scraper.getIsinScraper();

    const futopt = (symbol)
      ? await isinScraper.fetchListed({ symbol })
      : await isinScraper.fetchListedFutOpt({ type });

    futopt.forEach(({ symbol, ...ticker }) => this._futopt.set(symbol, { symbol, ...ticker }));

    return futopt;
  }

  private async fetchStocksList(options?: { exchange: 'TWSE' | 'TPEx' }) {
    const { exchange } = options ?? {};
    const data = await this.loadStocks();
    return exchange ? data.filter(ticker => ticker.exchange === exchange) : data;
  }

  private async fetchStocksQuote(options: { symbol: string, odd?: boolean }) {
    const { symbol, odd } = options;

    if (!this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol) as Ticker;
    return this._scraper.getMisTwseScraper().fetchStocksQuote({ ticker, odd });
  }

  private async fetchStocksHistorical(options: { date: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksHistorical({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksHistorical({ date, symbol });
  }

  private async fetchStocksInstitutional(options: { date: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksInstitutional({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksInstitutional({ date, symbol });
  }

  private async fetchStocksValues(options: { date: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksValues({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksValues({ date, symbol });
  }

  private async fetchStocksSplits(options: { exchange?: 'TWSE' | 'TPEx', startDate: string, endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksSplits({ symbol, startDate, endDate })
      : await this._scraper.getTwseScraper().fetchStocksSplits({ symbol, startDate, endDate });
  }

  private async fetchStocksCapitalReduction(options: { exchange?: 'TWSE' | 'TPEx', startDate: string, endDate: string, symbol?: string }) {
    const { symbol, startDate, endDate } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksCapitalReduction({ symbol, startDate, endDate })
      : await this._scraper.getTwseScraper().fetchStocksCapitalReduction({ symbol, startDate, endDate });
  }

  private async fetchStocksDividends(options: { startDate: string, endDate: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { symbol, startDate, endDate } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksDividends({ symbol, startDate, endDate })
      : await this._scraper.getTwseScraper().fetchStocksDividends({ symbol, startDate, endDate });
  }

  private async fetchStocksFiniHoldings(options: { date: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksFiniHoldings({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksFiniHoldings({ date, symbol });
  }

  private async fetchStocksMarginTrades(options: { date: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksMarginTrades({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksMarginTrades({ date, symbol });
  }

  private async fetchStocksShortSales(options: { date: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchStocksShortSales({ date, symbol })
      : await this._scraper.getTwseScraper().fetchStocksShortSales({ date, symbol });
  }

  private async fetchStocksShareholders(options?: { date?: string, symbol: string }) {
    if (!options) return this._scraper.getTdccScraper().fetchStocksShareholdersRecentWeek();

    const { date, symbol } = options;

    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    return (!date)
      ? this._scraper.getTdccScraper().fetchStocksShareholdersRecentWeek({ symbol })
      : this._scraper.getTdccScraper().fetchStocksShareholders({ date, symbol });
  }

  private async fetchStocksEps(options: { year: number, quarter: number, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { symbol, year, quarter } = options;

    if (!options.exchange && !options.symbol) {
      throw new Error('Either "exchange" or "symbol" options must be specified');
    }
    if (options.exchange && options.symbol) {
      throw new Error('One and only one of the "exchange" or "symbol" options must be specified');
    }
    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange as string;

    return this._scraper.getMopsScraper().fetchStocksEps({ exchange, year, quarter, symbol });
  }

  private async fetchStocksRevenue(options: { exchange?: 'TWSE' | 'TPEx', year: number, month: number, foreign?: boolean, symbol?: string  }) {
    const { symbol, year, month, foreign } = options;

    if (!options.exchange && !options.symbol) {
      throw new Error('Either "exchange" or "symbol" options must be specified');
    }
    if (options.exchange && options.symbol) {
      throw new Error('One and only one of the "exchange" or "symbol" options must be specified');
    }
    if (symbol && !this._stocks.has(symbol)) {
      const stocks = await this.loadStocks({ symbol });
      if (!stocks.length) throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange as string;

    return this._scraper.getMopsScraper().fetchStocksRevenue({ exchange, year, month, foreign, symbol });
  }

  private async getIndicesList(options?: { exchange: 'TWSE' | 'TPEx' }) {
    const { exchange } = options ?? {};
    const data = await this.loadIndices();
    return exchange ? data.filter(ticker => ticker.exchange === exchange) : data;
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

  private async getIndicesHistorical(options: { date: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._indices.has(symbol)) {
      const indices = await this.loadIndices();
      if (!map(indices, 'symbol').includes(symbol)) throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchIndicesHistorical({ date, symbol })
      : await this._scraper.getTwseScraper().fetchIndicesHistorical({ date, symbol });
  }

  private async getIndicesTrades(options: { date: string, exchange?: 'TWSE' | 'TPEx', symbol?: string }) {
    const { date, symbol } = options;

    if (symbol && !this._indices.has(symbol)) {
      const indices = await this.loadIndices();
      if (!map(indices, 'symbol').includes(symbol)) throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol as string) as Ticker;
    const exchange = symbol ? ticker.exchange : options.exchange;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchIndicesTrades({ date, symbol })
      : await this._scraper.getTwseScraper().fetchIndicesTrades({ date, symbol });
  }


  private async getMarketTrades(options: { date: string, exchange?: 'TWSE' | 'TPEx' }) {
    const { date, exchange } = options;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchMarketTrades({ date })
      : await this._scraper.getTwseScraper().fetchMarketTrades({ date });
  }

  private async getMarketBreadth(options: { date: string, exchange?: 'TWSE' | 'TPEx' }) {
    const { date, exchange } = options;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchMarketBreadth({ date })
      : await this._scraper.getTwseScraper().fetchMarketBreadth({ date });
  }

  private async getMarketInstitutional(options: { date: string, exchange?: 'TWSE' | 'TPEx' }) {
    const { date, exchange } = options;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchMarketInstitutional({ date })
      : await this._scraper.getTwseScraper().fetchMarketInstitutional({ date });
  }

  private async getMarketMarginTrades(options: { date: string, exchange?: 'TWSE' | 'TPEx' }) {
    const { date, exchange } = options;

    return (exchange === Exchange.TPEx)
      ? await this._scraper.getTpexScraper().fetchMarketMarginTrades({ date })
      : await this._scraper.getTwseScraper().fetchMarketMarginTrades({ date });
  }

  private async getFutOptList(options?: { type?: 'F' | 'O', availableContracts?: boolean }) {
    const { type, availableContracts } = options ?? {};

    return availableContracts
      ? await this.loadFutOptContracts({ type })
      : await this.loadFutOpt({ type });
  }

  private async getFutOptQuote(options: { symbol: string, afterhours?: boolean }) {
    const { symbol, afterhours } = options;

    if (!this._futopt.has(symbol)) {
      const futopt = (symbol.length === 3)
        ? await this.loadFutOpt()
        : await this.loadFutOptContracts({ symbol });

      if (!map(futopt, 'symbol').includes(symbol)) throw new Error('symbol not found');
    }

    const ticker = this._futopt.get(symbol) as Ticker;

    return (ticker.symbol.length === 3)
      ? this._scraper.getMisTaifexScraper().fetchFutOptQuoteList({ ticker, afterhours })
      : this._scraper.getMisTaifexScraper().fetchFutOptQuoteDetail({ ticker, afterhours });
  }

  private async getFutOptHistorical(options: { date: string, type?: 'F' | 'O', symbol?: string, afterhours?: boolean }) {
    const { date, symbol, afterhours } = options;

    if (symbol && !this._futopt.has(symbol)) {
      const futopt = await this.loadFutOpt();
      if (!map(futopt, 'symbol').includes(symbol)) throw new Error('symbol not found');
    }

    const ticker = this._futopt.get(symbol as string) as Ticker;
    const type = symbol ? ticker.type : options.type;

    return (type === 'O')
      ? this._scraper.getTaifexScraper().fetchOptionsHistorical({ date, symbol, afterhours })
      : this._scraper.getTaifexScraper().fetchFuturesHistorical({ date, symbol, afterhours });
  }

  private async getFutOptInstitutional(options: { date: string, symbol: string }) {
    const { date, symbol } = options;

    const type = (symbol.charAt(2) === 'O') ? 'O' : 'F';
    return (type === 'O')
      ? this._scraper.getTaifexScraper().fetchOptionsInstitutional({ date, symbol })
      : this._scraper.getTaifexScraper().fetchFuturesInstitutional({ date, symbol });
  }

  private async getFutOptLargeTraders(options: { date: string, symbol: string }) {
    const { date, symbol } = options;

    const type = (symbol.charAt(2) === 'O') ? 'O' : 'F';
    return (type === 'O')
      ? this._scraper.getTaifexScraper().fetchOptionsLargeTraders({ date, symbol })
      : this._scraper.getTaifexScraper().fetchFuturesLargeTraders({ date, symbol });
  }

  private async getFutOptMxfRetailPosition(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchMxfRetailPosition({ date });
  }

  private async getFutOptTmfRetailPosition(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchTmfRetailPosition({ date });
  }

  private async getFutOptTxoPutCallRatio(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchTxoPutCallRatio({ date });
  }

  private async getFutOptExchangeRates(options: { date: string }) {
    const { date } = options;
    return this._scraper.getTaifexScraper().fetchExchangeRates({ date });
  }
}
