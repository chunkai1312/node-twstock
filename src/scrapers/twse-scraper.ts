import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
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
}
