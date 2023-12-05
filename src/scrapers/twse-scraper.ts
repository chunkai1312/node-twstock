import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { Market } from '../enums';
import { asIndustry, asMarket, getExchangeByMarket } from '../utils';

export class TwseScraper extends Scraper {
  async fetchListedStocks(options?: { market: 'TSE' | 'OTC' }) {
    const market = options?.market ?? 'TSE';
    const url = {
      'TSE': 'https://isin.twse.com.tw/isin/class_main.jsp?market=1&issuetype=1',
      'OTC': 'https://isin.twse.com.tw/isin/class_main.jsp?market=2&issuetype=4',
    };
    const response = await this.httpService.get(url[market], { responseType: 'arraybuffer' });
    const page = iconv.decode(response.data, 'big5');
    const $ = cheerio.load(page);

    return $('.h4 tr').slice(1).map((_, el) => {
      const td = $(el).find('td');
      return {
        symbol: td.eq(2).text().trim(),
        name: td.eq(3).text().trim(),
        exchange: getExchangeByMarket(market as Market),
        market: asMarket(td.eq(4).text().trim()),
        industry: asIndustry(td.eq(6).text().trim()),
        listedDate: DateTime.fromFormat(td.eq(7).text().trim(), 'yyyy/MM/dd').toISODate(),
      };
    }).toArray();
  }

  async fetchStocksHistorical(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      type: 'ALLBUT0999',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    return json.tables[8].data.map((row: any) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = { date, symbol, name };
      data.open = numeral(values[3]).value();
      data.high = numeral(values[4]).value();
      data.low = numeral(values[5]).value();
      data.close = numeral(values[6]).value();
      data.volume = numeral(values[0]).value();
      data.turnover = numeral(values[2]).value();
      data.transaction = numeral(values[1]).value();
      data.change = values[7].includes('green') ? numeral(values[8]).multiply(-1).value() : numeral(values[8]).value();
      return data;
    });
  }
}
