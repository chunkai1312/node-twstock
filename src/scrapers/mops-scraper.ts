import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { Scraper } from './scraper';

export class MopsScraper extends Scraper {
  async fetchStocksEps(options: { market: 'TSE' | 'OTC', year: number, quarter: number }) {
    const { market, year, quarter } = options;
    const type = { 'TSE': 'sii', 'OTC': 'otc' };
    const form = new URLSearchParams({
      encodeURIComponent: '1',
      step: '1',
      firstin: '1',
      off: '1',
      isQuery: 'Y',
      TYPEK: type[market],
      year: numeral(year).subtract(1911).format(),
      season: numeral(quarter).format('00'),
    });
    const url = 'https://mops.twse.com.tw/mops/web/t163sb04';
    const response = await this.httpService.post(url, form);
    const $ = cheerio.load(response.data);

    const data = $('.even,.odd').map((_, el) => {
      const td = $(el).find('td');
      const symbol = td.eq(0).text().trim();
      const name = td.eq(1).text().trim();
      const eps = numeral(td.eq(td.length - 1).text().trim()).value();
      return { symbol, name, eps, year, quarter };
    }).toArray();

    return _.sortBy(data, 'symbol');
  }
}



