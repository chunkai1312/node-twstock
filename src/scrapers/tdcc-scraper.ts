import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as numeral from 'numeral';
import * as csvtojson from 'csvtojson';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { StockShareholders } from '../interfaces';

export class TdccScraper extends Scraper {
  async fetchStocksShareholders(options: { date: string, symbol: string }) {
    const { date, symbol } = options;

    const url = 'https://www.tdcc.com.tw/portal/zh/smWeb/qryStock';
    const request = await this.httpService.get(url);
    const $request = cheerio.load(request.data);

    const token = $request('#SYNCHRONIZER_TOKEN').attr('value') as string;
    const uri = $request('#SYNCHRONIZER_URI').attr('value') as string;
    const method = $request('#method').attr('value') as string;
    const firDate = $request('#firDate').attr('value') as string;
    const scaDate = $request('#scaDate').find('option').map((_, el) => {
      return $request(el).attr('value');
    }).toArray();
    const cookie = request.headers['set-cookie'];

    const form = new URLSearchParams({
      SYNCHRONIZER_TOKEN: token,
      SYNCHRONIZER_URI: uri,
      method,
      firDate,
      scaDate: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      sqlMethod: 'StockNo',
      stockNo: symbol,
      stockName: '',
    });
    const response = await this.httpService.post(url, form, { headers: { 'Cookie': cookie } });
    const $response = cheerio.load(response.data);

    const message = $response('.table tr').find('td').eq(0).text();
    if (message === '查無此資料') return null;

    const data: Record<string, any> = {};
    data.date = date;
    data.symbol = symbol;
    data.shareholders = $response('.table tr').slice(1).map((_, el) => {
      const td = $response(el).find('td');
      return {
        level: numeral(td.eq(0).text()).value(),
        holders: numeral(td.eq(2).text()).value(),
        shares: numeral(td.eq(3).text()).value(),
        proportion: numeral(td.eq(4).text()).value(),
      };
    }).toArray();

    if (data.shareholders.length === 16) {
      data.shareholders = [
        ...data.shareholders.slice(0, -1),
        { level: 16, holders: null, shares: 0, proportion: 0 },
        { ...data.shareholders[data.shareholders.length - 1], level: 17 }
      ];
    }

    return data as StockShareholders;
  }

  async fetchStocksShareholdersRecentWeek(options?: { symbol: string }) {
    const url = 'https://smart.tdcc.com.tw/opendata/getOD.ashx?id=1-5';
    const response = await this.httpService.get(url);
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(response.data);
    const [ fields, ...rows ] = json;

    const distributions = rows.map(row => ({
      date: DateTime.fromFormat(row[0], 'yyyyMMdd').toISODate(),
      symbol: row[1],
      level: numeral(row[2]).value(),
      holders: row[2] === '16' ? null : numeral(row[3]).value(),
      shares: row[2] === '16' ? numeral(row[4]).multiply(-1).value() : numeral(row[4]).value(),
      proportion: row[2] === '16' ? numeral(row[5]).multiply(-1).value() : numeral(row[5]).value(),
    }));

    const data = _(distributions).groupBy('symbol')
      .map(rows => {
        const { date, symbol } = rows[0];
        const shareholders = rows.map(row => _.omit(row, ['date', 'symbol']));
        return { date, symbol, shareholders };
      }).value() as StockShareholders[];

    return options?.symbol ? data.find(data => data.symbol === options.symbol) : data;
  }
}
