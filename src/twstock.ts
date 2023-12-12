import { TwseScraper, TpexScraper, MisScraper } from './scrapers';
import { Market } from './enums';
import { Ticker } from './interfaces';
import { getMarketIndices } from './utils';

export class TwStock {
  private readonly _stocks = new Map<string, Ticker>();
  private readonly _indices = new Map<string, Ticker>();

  get stocks() {
    return {
      list: this.getStocksList.bind(this),
      quote: this.getStocksQuote.bind(this),
      historical: this.getStocksHistorical.bind(this),
      instTrades: this.getStocksInstTrades.bind(this),
      values: this.getStocksValues.bind(this),
    };
  }

  get indices() {
    return {
      list: this.getIndicesList.bind(this),
      quote: this.getIndicesQuote.bind(this),
      historical: this.getIndicesHistorical.bind(this),
    };
  }

  private async loadStocks() {
    const results = await Promise.all([
      TwseScraper.fetchListedStocks({ market: Market.TSE }),
      TwseScraper.fetchListedStocks({ market: Market.OTC }),
    ]);
    results.flat().forEach((ticker) => {
      const { symbol } = ticker;
      this._stocks.set(symbol, ticker);
    });
  }

  private async loadIndices() {
    const indices = getMarketIndices();
    indices.forEach(ticker => {
      const { symbol } = ticker;
      this._indices.set(symbol, ticker);
    });
    const results = await Promise.all([
      MisScraper.fetchListedIndices({ market: Market.TSE }),
      MisScraper.fetchListedIndices({ market: Market.OTC }),
    ]);
    results.flat().forEach(ticker => {
      const { symbol } = ticker;
      if (symbol && !this._indices.has(symbol)) {
        this._indices.set(symbol, ticker);
      }
    });
  }

  private async getStocksList(params?: { market: 'TSE' | 'OTC' }) {
    const { market } = params ?? {};

    if (!this._stocks.size) {
      await this.loadStocks();
    }

    const data = Array.from(this._stocks.values());
    return market ? data.filter(ticker => ticker.market === market) : data;
  }

  private async getStocksQuote(params: { symbol: string, odd?: boolean }) {
    const { symbol, odd } = params;

    if (!this._stocks.size) {
      await this.loadStocks();
    }
    if (!this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol) as Ticker;
    const data = await MisScraper.fetchStocksQuote({ ticker, odd });

    /* istanbul ignore next */
    return data ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getStocksHistorical(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (!this._stocks.size) {
      await this.loadStocks();
    }
    if (symbol && !this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchStocksHistorical({ date })
      : await TwseScraper.fetchStocksHistorical({ date });

    /* istanbul ignore next */
    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getStocksInstTrades(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (!this._stocks.size) {
      await this.loadStocks();
    }
    if (symbol && !this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchStocksInstTrades({ date })
      : await TwseScraper.fetchStocksInstTrades({ date });

    /* istanbul ignore next */
    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getStocksValues(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (!this._stocks.size) {
      await this.loadStocks();
    }
    if (symbol && !this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchStocksValues({ date })
      : await TwseScraper.fetchStocksValues({ date });

    /* istanbul ignore next */
    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getIndicesList(params?: { market: 'TSE' | 'OTC' }) {
    const { market } = params ?? {};

    if (!this._indices.size) {
      await this.loadIndices();
    }

    const data = Array.from(this._indices.values());
    return market ? data.filter(ticker => ticker.market === market) : data;
  }

  private async getIndicesQuote(params: { symbol: string }) {
    const { symbol } = params;

    if (!this._indices.size) {
      await this.loadIndices();
    }
    if (!this._indices.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol) as Ticker;
    const data = await MisScraper.fetchIndicesQuote({ ticker });

    /* istanbul ignore next */
    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getIndicesHistorical(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (!this._indices.size) {
      await this.loadIndices();
    }

    if (symbol && !this._indices.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchIndicesHistorical({ date })
      : await TwseScraper.fetchIndicesHistorical({ date });

    /* istanbul ignore next */
    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }
}
