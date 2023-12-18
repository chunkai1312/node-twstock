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

  async fetchStocksRevenue(options: { market: 'TSE' | 'OTC', year: number, month: number, foreign?: boolean }) {
    const { market, year, month, foreign = false } = options;
    const type = { 'TSE': 'sii', 'OTC': 'otc' };
    const suffix = `${numeral(year).subtract(1911).value()}_${month}_${+foreign}`;
    const url = `https://mops.twse.com.tw/nas/t21/${type[market]}/t21sc03_${suffix}.html`;
    const response = await this.httpService.get(url, { responseType: 'arraybuffer' });
    const page = iconv.decode(response.data, 'big5');
    const $ = cheerio.load(page);

    const data = $('tr [align=right]')
      .filter((_, el) => {
        const th = $(el).find('th');
        const td = $(el).find('td');
        return (th.length === 0) && !!td.eq(0).text();
      })
      .map((_, el) => {
        const td = $(el).find('td');
        const symbol = td.eq(0).text().trim();
        const name = td.eq(1).text().trim();
        const revenue = numeral(td.eq(2).text().trim()).value();
        return { symbol, name, revenue, year, month };
      })
      .toArray();

    return _.sortBy(data, 'symbol');
  }
}



