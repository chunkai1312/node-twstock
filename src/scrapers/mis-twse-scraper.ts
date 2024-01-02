import * as _ from 'lodash';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { Ticker } from '../interfaces';
import { asExchange, asIndex } from '../utils';
import { Market } from '../enums';

export class MisTwseScraper extends Scraper {
  async fetchListedIndices(options: { market: 'TSE' | 'OTC' }) {
    const { market } = options;
    const i = { 'TSE': 'TIDX', 'OTC': 'OIDX' };
    const query = new URLSearchParams({
      ex: market.toLowerCase(),
      i: i[market],
    });
    const url = `https://mis.twse.com.tw/stock/api/getCategory.jsp?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.rtmessage === 'OK') && response.data;
    if (!json) return null;

    const data = json.msgArray.map((row: any) => ({
      symbol: asIndex(row.n) ?? (row.ch).replace('.tw', ''),
      exchange: asExchange(row.ex.toUpperCase() as Market),
      market: row.ex.toUpperCase(),
      name: row.n,
      ex_ch: `${row.ex}_${row.ch}`,
    }));

    return data;
  }

  async fetchStocksQuote(options: { ticker: Ticker, odd?: boolean }) {
    const { ticker, odd } = options;
    const query = new URLSearchParams({
      ex_ch: this.extractExChFromTicker(ticker),
    });
    const url = odd
      ? `https://mis.twse.com.tw/stock/api/getOddInfo.jsp?${query}`
      : `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.rtmessage === 'OK') && response.data;
    if (!json) return null;

    const data = json.msgArray.map((row: any) => ({
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
      lastSize: row.s && numeral(row.s).value(),
      totalVoluem: row.v && numeral(row.v).value(),
      bidPrice: row.b && row.b.split('_').slice(0, -1).map((price: string) => numeral(price).value()),
      askPrice: row.a && row.a.split('_').slice(0, -1).map((price: string) => numeral(price).value()),
      bidSize: row.g && row.g.split('_').slice(0, -1).map((size: string) => numeral(size).value()),
      askSize: row.f && row.f.split('_').slice(0, -1).map((size: string) => numeral(size).value()),
      lastUpdated: row.tlong && numeral(row.tlong).value(),
    })) as Record<string, any>[];

    return data.find(row => row.symbol === ticker.symbol);
  }

  async fetchIndicesQuote(options: { ticker: Ticker }) {
    const { ticker } = options;
    const query = new URLSearchParams({
      ex_ch: this.extractExChFromTicker(ticker),
    });
    const url = `https://mis.twse.com.tw/stock/api/getStockInfo.jsp?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.rtmessage === 'OK') && response.data;
    if (!json) return null;

    const data = json.msgArray.map((row: any) => ({
      date: DateTime.fromFormat(row.d, 'yyyyMMdd').toISODate(),
      symbol: ticker.symbol,
      name: row.n,
      previousClose: row.y && numeral(row.y).value(),
      open: row.o && numeral(row.o).value(),
      high: row.h && numeral(row.h).value(),
      low: row.l && numeral(row.l).value(),
      close: row.z && numeral(row.z).value(),
      volume: row.v && numeral(row.v).value(),
      lastUpdated: row.tlong && numeral(row.tlong).value(),
    })) as Record<string, any>[];

    return data.find(row => row.symbol === ticker.symbol);
  }

  private extractExChFromTicker(ticker: Ticker) {
    const { symbol, market, ex_ch } = ticker;
    const ex = market.toLowerCase();
    const ch = `${symbol}.tw`;
    return ex_ch ? ex_ch : `${ex}_${ch}`;
  }
}
