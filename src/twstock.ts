import { IsinScraper, TwseScraper, TpexScraper, MisScraper, TdccScraper, MopsScraper, TaifexScraper } from './scrapers';
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
      finiHoldings: this.getStocksFiniHoldings.bind(this),
      marginTrades: this.getStocksMarginTrades.bind(this),
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
      txfInstTrades: this.getFutOptTxfInstTrades.bind(this),
      txoInstTrades: this.getFutOptTxoInstTrades.bind(this),
    };
  }

  private async loadStocks(options?: { symbol?: string }) {
    const { symbol } = options ?? {};

    if (symbol) {
      const results = await IsinScraper.fetchStocksInfo({ symbol });
      results.forEach((ticker) => {
        const { symbol } = ticker;
        this._stocks.set(symbol, ticker);
      });
    } else {
      const results = await Promise.all([
        IsinScraper.fetchListedStocks({ market: Market.TSE }),
        IsinScraper.fetchListedStocks({ market: Market.OTC }),
      ]);
      results.flat().forEach((ticker) => {
        const { symbol } = ticker;
        this._stocks.set(symbol, ticker);
      });
    }
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
    await this.loadStocks();
    const data = Array.from(this._stocks.values());
    return market ? data.filter(ticker => ticker.market === market) : data;
  }

  private async getStocksQuote(params: { symbol: string, odd?: boolean }) {
    const { symbol, odd } = params;

    if (!this._stocks.has(symbol)) {
      await this.loadStocks({ symbol });
    }
    if (!this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol) as Ticker;
    const data = await MisScraper.fetchStocksQuote({ ticker, odd });

    return data ? data.find((row: any) => row.symbol === symbol) : null;
  }

  private async getStocksHistorical(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (symbol && !this._stocks.has(symbol)) {
      await this.loadStocks({ symbol });
    }
    if (symbol && !this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchStocksHistorical({ date })
      : await TwseScraper.fetchStocksHistorical({ date });

    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getStocksInstTrades(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (symbol && !this._stocks.has(symbol)) {
      await this.loadStocks({ symbol });
    }
    if (symbol && !this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchStocksInstTrades({ date })
      : await TwseScraper.fetchStocksInstTrades({ date });

    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getStocksFiniHoldings(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (symbol && !this._stocks.has(symbol)) {
      await this.loadStocks({ symbol });
    }
    if (symbol && !this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchStocksFiniHoldings({ date })
      : await TwseScraper.fetchStocksFiniHoldings({ date });

    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getStocksMarginTrades(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (symbol && !this._stocks.has(symbol)) {
      await this.loadStocks({ symbol });
    }
    if (symbol && !this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchStocksMarginTrades({ date })
      : await TwseScraper.fetchStocksMarginTrades({ date });

    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getStocksValues(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (symbol && !this._stocks.has(symbol)) {
      await this.loadStocks({ symbol });
    }
    if (symbol && !this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._stocks.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchStocksValues({ date })
      : await TwseScraper.fetchStocksValues({ date });

    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getStocksHolders(params: { date: string, symbol: string }) {
    const { date, symbol } = params;

    if (!this._stocks.has(symbol)) {
      await this.loadStocks({ symbol });
    }
    if (!this._stocks.has(symbol)) {
      throw new Error('symbol not found');
    }

    return TdccScraper.fetchStocksHolders({ date, symbol });
  }

  private async getStocksEps(params: { market: 'TSE' | 'OTC', year: number, quarter: number }) {
    const { market, year, quarter } = params;
    return MopsScraper.fetchStocksEps({ market, year, quarter });
  }

  private async getStocksRevenue(params: { market: 'TSE' | 'OTC', year: number, month: number, foreign?: boolean }) {
    const { market, year, month, foreign } = params;
    return MopsScraper.fetchStocksRevenue({ market, year, month, foreign });
  }

  private async getIndicesList(params?: { market: 'TSE' | 'OTC' }) {
    const { market } = params ?? {};
    await this.loadIndices();
    const data = Array.from(this._indices.values());
    return market ? data.filter(ticker => ticker.market === market) : data;
  }

  private async getIndicesQuote(params: { symbol: string }) {
    const { symbol } = params;

    if (!this._indices.has(symbol)) {
      await this.loadIndices();
    }
    if (!this._indices.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol) as Ticker;
    const data = await MisScraper.fetchIndicesQuote({ ticker });

    return data ? data.find((row: any) => row.symbol === symbol) : null;
  }

  private async getIndicesHistorical(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (symbol && !this._indices.has(symbol)) {
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

    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }

  private async getIndicesTrades(params: { date: string, market?: 'TSE' | 'OTC', symbol?: string }) {
    const { date, symbol } = params;

    if (symbol && !this._indices.has(symbol)) {
      await this.loadIndices();
    }
    if (symbol && !this._indices.has(symbol)) {
      throw new Error('symbol not found');
    }

    const ticker = this._indices.get(symbol as string) as Ticker;
    const market = symbol ? ticker.market : params.market;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchIndicesTrades({ date })
      : await TwseScraper.fetchIndicesTrades({ date });

    return data && symbol ? data.find((row: any) => row.symbol === symbol) : data;
  }


  private async getMarketTrades(params: { date: string, market?: 'TSE' | 'OTC' }) {
    const { date, market } = params;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchMarketTrades({ date })
      : await TwseScraper.fetchMarketTrades({ date });

    return data;
  }

  private async getMarketBreadth(params: { date: string, market?: 'TSE' | 'OTC' }) {
    const { date, market } = params;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchMarketBreadth({ date })
      : await TwseScraper.fetchMarketBreadth({ date });

    return data;
  }

  private async getMarketInstTrades(params: { date: string, market?: 'TSE' | 'OTC' }) {
    const { date, market } = params;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchMarketInstTrades({ date })
      : await TwseScraper.fetchMarketInstTrades({ date });

    return data;
  }

  private async getMarketMarginTrades(params: { date: string, market?: 'TSE' | 'OTC' }) {
    const { date, market } = params;

    const data = (market === Market.OTC)
      ? await TpexScraper.fetchMarketMarginTrades({ date })
      : await TwseScraper.fetchMarketMarginTrades({ date });

    return data;
  }

  private async getFutOptTxfInstTrades(params: { date: string }) {
    const { date } = params;
    return TaifexScraper.fetchTxfInstTrades({ date });
  }

  private async getFutOptTxoInstTrades(params: { date: string }) {
    const { date } = params;
    return TaifexScraper.fetchTxoInstTrades({ date });
  }
}
