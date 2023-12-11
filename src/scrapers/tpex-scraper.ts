import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as numeral from 'numeral';
import { Scraper } from './scraper';
import { Exchange, Market } from '../enums';
import { asIndex, isWarrant } from '../utils';

export class TpexScraper extends Scraper {
  async fetchStocksHistorical(options: { date: string }) {
    const { date } = options;
    const [ year, month, day ] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    return json.aaData
      .filter((row: any) => !isWarrant(row[0]))
      .map((row: any) => {
        const [symbol, name, ...values] = row;
        const data: Record<string, any> = {};
        data.date = date,
        data.exchange = Exchange.TPEx;
        data.market = Market.OTC;
        data.symbol = symbol,
        data.name = name,
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

  async fetchStocksInstTrades(options: { date: string }) {
    const { date } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      se: 'EW',
      t: 'D',
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/3insti/daily_trade/3itrade_hedge_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    return json.aaData.map((row: any) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TPEx;
      data.market = Market.OTC;
      data.symbol = symbol;
      data.name = name.trim();
      data.finiWithoutDealersBuy = numeral(values[0]).value();
      data.finiWithoutDealersSell = numeral(values[1]).value();
      data.finiWithoutDealersNetBuySell = numeral(values[2]).value();
      data.finiDealersBuy = numeral(values[3]).value();
      data.finiDealersSell = numeral(values[4]).value();
      data.finiDealersNetBuySell = numeral(values[5]).value();
      data.finiBuy = numeral(values[6]).value();
      data.finiSell = numeral(values[7]).value();
      data.finiNetBuySell = numeral(values[8]).value();
      data.sitcBuy = numeral(values[9]).value();
      data.sitcSell = numeral(values[10]).value();
      data.sitcNetBuySell = numeral(values[11]).value();
      data.dealersForProprietaryBuy = numeral(values[12]).value();
      data.dealersForProprietarySell = numeral(values[13]).value();
      data.dealersForProprietaryNetBuySell = numeral(values[14]).value();
      data.dealersForHedgingBuy = numeral(values[15]).value();
      data.dealersForHedgingSell = numeral(values[16]).value();
      data.dealersForHedgingNetBuySell = numeral(values[17]).value();
      data.dealersBuy = numeral(values[18]).value();
      data.dealersSell = numeral(values[19]).value();
      data.dealersNetBuySell = numeral(values[20]).value();
      data.totalInstInvestorsBuy = data.finiBuy + data.sitcBuy + data.dealersBuy;
      data.totalInstInvestorsSell = data.finiSell + data.sitcSell + data.dealersSell;
      data.totalInstInvestorsNetBuySell = numeral(values[21]).value();
      return data;
    });
  }

  async fetchIndicesHistorical(options: { date: string }) {
    const { date } = options;
    const [ year, month, day ] = date.split('-');
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
        const data: Record<string, any> = {};
        data.date = date,
        data.exchange = Exchange.TPEx;
        data.market = Market.OTC;
        data.symbol = symbol,
        data.name = name,
        data.open = _.minBy(rows, 'time').price;
        data.high = _.maxBy(rows, 'price').price;
        data.low = _.minBy(rows, 'price').price;
        data.close = _.maxBy(rows, 'time').price;
        data.change = numeral(data.close).subtract(prev.price).value();
        return data;
      }).value() as any;
  }
}
