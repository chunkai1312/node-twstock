import * as _ from 'lodash';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { Ticker } from '../interfaces';

export class MisTaifexScraper extends Scraper {
  async fetchFutOptQuote(options: { ticker: Ticker, afterhours?: boolean }) {
    const { ticker, afterhours } = options;
    const body = JSON.stringify({ SymbolID: [this.extractSymbolIdFromTicker(ticker, { afterhours })] });
    const url = `https://mis.taifex.com.tw/futures/api/getQuoteDetail`;

    const response = await this.httpService.post(url, body, {
      headers: { 'Content-Type': 'application/json' },
    });
    const json = (response.data.RtCode === '0') && response.data;
    if (!json) return null;

    const data = json.RtData.QuoteList.map((row: any) => ({
      symbol: ticker.symbol,
      name: ticker.name,
      referencePrice: row.CRefPrice && numeral(row.CRefPrice).value(),
      limitUpPrice: row.CCeilPrice && numeral(row.CCeilPrice).value(),
      limitDownPrice: row.CFloorPrice && numeral(row.CFloorPrice).value(),
      openPrice: row.COpenPrice && numeral(row.COpenPrice).value(),
      highPrice: row.CHighPrice && numeral(row.CHighPrice).value(),
      lowPrice: row.CLowPrice && numeral(row.CLowPrice).value(),
      lastPrice: row.CLastPrice && numeral(row.CLastPrice).value(),
      lastSize: row.CSingleVolume && numeral(row.CSingleVolume).value(),
      testPrice: row.CTestPrice && numeral(row.CTestPrice).value(),
      testSize: row.CTestVolume && numeral(row.CTestVolume).value(),
      testTime: row.CTestTime && DateTime.fromFormat(`${row.CDate} ${row.CTestTime}`, 'yyyyMMdd hhmmss', { zone: 'Asia/Taipei' }).toMillis(),
      totalVoluem: row.CTotalVolume && numeral(row.CTotalVolume).value(),
      openInterest: row.OpenInterest && numeral(row.OpenInterest).value(),
      bidOrders: row.CBidCount && numeral(row.CBidCount).value(),
      askOrders: row.CAskCount && numeral(row.CAskCount).value(),
      bidVolume: row.CBidUnit && numeral(row.CBidUnit).value(),
      askVolume: row.CAskUnit && numeral(row.CAskUnit).value(),
      bidPrice: [row.CBidPrice1, row.CBidPrice2, row.CBidPrice3, row.CBidPrice4, row.CBidPrice5].map(price => numeral(price).value()),
      askPrice: [row.CAskPrice1, row.CAskPrice2, row.CAskPrice3, row.CAskPrice4, row.CAskPrice5].map(price => numeral(price).value()),
      bidSize: [row.CBidSize1, row.CBidSize2, row.CBidSize3, row.CBidSize4, row.CBidSize5].map(size => numeral(size).value()),
      askSize: [row.CAskSize1, row.CAskSize2, row.CAskSize3, row.CAskSize4, row.CAskSize5].map(size => numeral(size).value()),
      extBidPrice: row.CExtBidPrice && numeral(row.CExtBidPrice).value(),
      extAskPrice: row.CExtAskPrice && numeral(row.CExtAskPrice).value(),
      extBidSize: row.CExtBidSize && numeral(row.CExtBidSize).value(),
      extAskSize: row.CExtAskSize && numeral(row.CExtAskSize).value(),
      lastUpdated: DateTime.fromFormat(`${row.CDate} ${row.CTime}`, 'yyyyMMdd hhmmss', { zone: 'Asia/Taipei' }).toMillis(),
    })) as Record<string, any>[];
    return data.find(row => row.symbol.includes(ticker.symbol));
  }

  private extractSymbolIdFromTicker(ticker: Ticker, options: { afterhours?: boolean }) {
    const { symbol, type } = ticker;
    const { afterhours } = options;

    if (type && type.includes('期貨')) {
      return afterhours ? `${symbol}-M` : `${symbol}-F`;
    }
    if (type && type.includes('選擇權')) {
      return afterhours ? `${symbol}-N` : `${symbol}-O`;
    }
  }
}
