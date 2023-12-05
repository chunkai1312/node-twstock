import * as _ from 'lodash';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';

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
}
