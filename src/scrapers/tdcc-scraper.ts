import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';

export class TdccScraper extends Scraper {
  async fetchStocksHolders(options: { date: string, symbol: string }) {
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

    const info = $response('p:eq(0)').toString();
    const data: Record<string, any> = {};
    data.date = date;
    data.symbol = (info.match(/證券代號：(\S+)/) as string[])[1];
    data.name = (info.match(/證券名稱：(.+)/) as string[])[1];
    data.data = $response('.table tr').slice(1).map((_, el) => {
      const td = $response(el).find('td');
      return {
        level: td.eq(1).text().trim(),
        holders: numeral(td.eq(2).text()).value(),
        shares: numeral(td.eq(3).text()).value(),
        proportion: numeral(td.eq(4).text()).value(),
      };
    }).toArray();
    return data;
  }
}



