import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { asIndex } from '../utils';

export class TpexScraper extends Scraper {
  async fetchStocksHistorical(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const isWarrant = (symbol: string) => {
      const rules = [
        /^7[0-3][0-9][0-9][0-9][0-9]$/,
        /^7[0-3][0-9][0-9][0-9]P$/,
        /^7[0-3][0-9][0-9][0-9]F$/,
        /^7[0-3][0-9][0-9][0-9]Q$/,
        /^7[0-3][0-9][0-9][0-9]C$/,
        /^7[0-3][0-9][0-9][0-9]B$/,
        /^7[0-3][0-9][0-9][0-9]X$/,
        /^7[0-3][0-9][0-9][0-9]Y$/,
      ];
      return rules.some(regex => regex.test(symbol));
    };

    return json.aaData
      .filter((row: any) => !isWarrant(row[0]))
      .map((row: any) => {
        const [symbol, name, ...values] = row;
        const data: Record<string, any> = { date, symbol, name };
        data.open = numeral(values[2]).value();
        data.high = numeral(values[3]).value();
        data.low = numeral(values[4]).value();
        data.close = numeral(values[0]).value();
        data.volume = numeral(values[6]).value();
        data.turnover = numeral(values[7]).value();
        data.transaction = numeral(values[8]).value();
        data.change = numeral(values[1]).value();
        return data;
      });
  }

  async fetchIndicesHistorical(options?: { date: string }) {
    const date = options?.date ?? DateTime.local().toISODate();
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
    });
    const url = `https://www.tpex.org.tw/web/stock/iNdex_info/minute_index/1MIN_print.php?${query}`;

    const response = await this.httpService.get(url);
    const page = response.data;
    const $ = cheerio.load(page);

    const total = $('tfoot tr td').text().trim();
    if (total === '共0筆') return null;

    const indices = $('thead tr th').slice(1, -7).map((_, el) => {
      const name = $(el).text().trim();
      const index = (name !== '櫃買指數') ? `櫃買${name.replace('類', '')}類指數` : name;
      return {
        symbol: asIndex(index),
        name: index,
      };
    }).toArray();

    const quotes = $('tbody tr').map((_, el) => {
      const td = $(el).find('td');
      const row = td.map((_, el) => $(el).text().trim()).toArray();
      const [time, ...values] = row;
      return values.slice(0, -7).map((value: any, i: number) => ({
        date,
        time,
        symbol: indices[i].symbol,
        name: indices[i].name,
        price: numeral(value).value(),
      }));
    }).toArray() as any;

    return _(quotes).groupBy('symbol')
      .map(quotes => {
        const [prev, ...rows] = quotes;
        const { date, symbol, name } = prev;
        const data: Record<string, any> = { date, symbol, name};
        data.open = _.minBy(rows, 'time').price;
        data.high = _.maxBy(rows, 'price').price;
        data.low = _.minBy(rows, 'price').price;
        data.close = _.maxBy(rows, 'time').price;
        data.change = numeral(data.close).subtract(prev.price).value();
        return data;
      }).value() as any;
  }
}
