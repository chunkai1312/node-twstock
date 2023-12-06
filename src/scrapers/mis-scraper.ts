import * as _ from 'lodash';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { Ticker } from '../interfaces';

export class MisScraper extends Scraper {
  async fetchListedIndices(options: { market: 'TSE' | 'OTC' }) {
    const market = options?.market ?? 'TSE';
    const i = { 'TSE': 'TIDX', 'OTC': 'OIDX' };
    const query = new URLSearchParams({
      ex: market.toLowerCase(),
      i: i[market],
    });
    const url = `http://mis.twse.com.tw/stock/api/getCategory.jsp?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.rtmessage === 'OK') && response.data;
    if (!json) return null;

    return json.msgArray.map((row: any) => ({
      name: row.n,
      ex_ch: `${row.ex}_${row.ch}`,
    }));
  }

  async fetchStocksQuote(options: { ticker: Ticker, odd?: boolean }) {
    const query = new URLSearchParams({
      ex_ch: this.extractExChFromTicker(options.ticker),
    });
    const url = options?.odd
      ? `http://mis.twse.com.tw/stock/api/getOddInfo.jsp?${query}`
      : `http://mis.twse.com.tw/stock/api/getStockInfo.jsp?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.rtmessage === 'OK') && response.data;
    if (!json) return null;

    return json.msgArray.map((row: any) => ({
      date: DateTime.fromFormat(row.d, 'yyyyMMdd').toISODate(),
      symbol: row.c,
      name: row.n,
      referencePrice: row.y && numeral(row.y).value(),
      limitUpPrice: row.u && numeral(row.u).value(),
      limitDownPrice: row.w && numeral(row.w).value(),
      openPrice: row.o && numeral(row.o).value(),
      highPrice: row.h && numeral(row.h).value(),
      lowPrice: row.l && numeral(row.l).value(),
      lastPrice: row.z && numeral(row.z).value(),
      lastSize: row.tv && numeral(row.tv).value(),
      totalVoluem: row.v && numeral(row.v).value(),
      bidPrice: row.b && row.b.split('_').slice(0, -1).map((price: string) => numeral(price).value()),
      askPrice: row.a && row.a.split('_').slice(0, -1).map((price: string) => numeral(price).value()),
      bidSize: row.g && row.g.split('_').slice(0, -1).map((size: string) => numeral(size).value()),
      askSize: row.f && row.f.split('_').slice(0, -1).map((size: string) => numeral(size).value()),
      lastUpdated: row.tlong && numeral(row.tlong).value(),
    }));
  }

  async fetchIndicesQuote(options: { ticker: Ticker }) {
    const query = new URLSearchParams({
      ex_ch: this.extractExChFromTicker(options.ticker),
    });
    const url = `http://mis.twse.com.tw/stock/api/getStockInfo.jsp?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.rtmessage === 'OK') && response.data;
    if (!json) return null;

    return json.msgArray.map((row: any) => ({
      date: DateTime.fromFormat(row.d, 'yyyyMMdd').toISODate(),
      symbol: options.ticker.symbol,
      name: row.n,
      previousClose: row.y && numeral(row.y).value(),
      open: row.o && numeral(row.o).value(),
      high: row.h && numeral(row.h).value(),
      low: row.l && numeral(row.l).value(),
      close: row.z && numeral(row.z).value(),
      volume: row.v && numeral(row.v).value(),
      lastUpdated: row.tlong && numeral(row.tlong).value(),
    }));
  }

  private extractExChFromTicker(ticker: Ticker) {
    const ex = ticker.market.toLowerCase();
    const ch = (ticker.alias ? ticker.alias : ticker.symbol) + '.tw';
    return `${ex}_${ch}`;
  }
}
