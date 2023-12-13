import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { Exchange, Market } from '../enums';
import { asIndex, asIndustry, asMarket, getExchangeByMarket } from '../utils';

export class TwseScraper extends Scraper {
  async fetchListedStocks(options: { market: 'TSE' | 'OTC' }) {
    const { market } = options;
    const url = {
      'TSE': 'https://isin.twse.com.tw/isin/class_main.jsp?market=1',
      'OTC': 'https://isin.twse.com.tw/isin/class_main.jsp?market=2',
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
        listedDate: DateTime.fromFormat(td.eq(7).text().trim(), 'yyyy/MM/dd').toISODate() as string,
      };
    }).toArray();
  }

  async fetchStocksHistorical(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      type: 'ALLBUT0999',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    return json.tables[8].data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TWSE;
      data.market = Market.TSE;
      data.symbol = symbol;
      data.name = name.trim();
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

  async fetchStocksInstTrades(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'ALLBUT0999',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/fund/T86?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    return json.data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TWSE;
      data.market = Market.TSE;
      data.symbol = symbol;
      data.name = name.trim();
      data.finiWithoutDealersBuy = numeral(values[0]).value();
      data.finiWithoutDealersSell = numeral(values[1]).value();
      data.finiWithoutDealersNetBuySell = numeral(values[2]).value();
      data.finiDealersBuy = numeral(values[3]).value();
      data.finiDealersSell = numeral(values[4]).value();
      data.finiDealersNetBuySell = numeral(values[5]).value();
      data.finiBuy = data.finiWithoutDealersBuy + data.finiDealersBuy;
      data.finiSell = data.finiWithoutDealersSell + data.finiDealersSell;
      data.finiNetBuySell = data.finiWithoutDealersNetBuySell + data.finiDealersNetBuySell;
      data.sitcBuy = numeral(values[6]).value();
      data.sitcSell = numeral(values[7]).value();
      data.sitcNetBuySell = numeral(values[8]).value();
      data.dealersForProprietaryBuy = numeral(values[10]).value();
      data.dealersForProprietarySell = numeral(values[11]).value();
      data.dealersForProprietaryNetBuySell = numeral(values[12]).value();
      data.dealersForHedgingBuy = numeral(values[13]).value();
      data.dealersForHedgingSell = numeral(values[14]).value();
      data.dealersForHedgingNetBuySell = numeral(values[15]).value();
      data.dealersBuy = data.dealersForProprietaryBuy + data.dealersForHedgingBuy;
      data.dealersSell = data.dealersForProprietarySell + data.dealersForHedgingSell;
      data.dealersNetBuySell = numeral(values[9]).value();
      data.totalInstInvestorsBuy = data.finiBuy + data.sitcBuy + data.dealersBuy;
      data.totalInstInvestorsSell = data.finiSell + data.sitcSell + data.dealersSell;
      data.totalInstInvestorsNetBuySell = numeral(values[16]).value();
      return data;
    });
  }

  async fetchStocksMarginTrades(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'ALL',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    return json.tables[1].data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TWSE;
      data.market = Market.TSE;
      data.symbol = symbol;
      data.name = name.trim();
      data.marginBuy = numeral(values[0]).value();
      data.marginSell = numeral(values[1]).value();
      data.marginRedeem = numeral(values[2]).value();
      data.marginBalancePrev = numeral(values[3]).value();
      data.marginBalance = numeral(values[4]).value();
      data.marginQuota = numeral(values[5]).value();
      data.shortBuy = numeral(values[6]).value();
      data.shortSell = numeral(values[7]).value();
      data.shortRedeem = numeral(values[8]).value();
      data.shortBalancePrev = numeral(values[9]).value();
      data.shortBalance = numeral(values[10]).value();
      data.shortQuota = numeral(values[11]).value();
      data.offset = numeral(values[12]).value();
      data.note = values[13].trim();
      return data;
    });
  }

  async fetchStocksValues(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'ALL',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    return json.data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TWSE;
      data.market = Market.TSE;
      data.symbol = symbol;
      data.name = name.trim();
      data.peRatio = numeral(values[2]).value();
      data.pbRatio = numeral(values[3]).value();
      data.dividendYield = numeral(values[0]).value();
      data.dividendYear = numeral(values[1]).add(1911).value();
      return data;
    });
  }

  async fetchIndicesHistorical(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/TAIEX/MI_5MINS_INDEX?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const indices = json.fields.slice(1).map((index: string) => ({
      symbol: asIndex(index),
      name: index,
    }));

    const quotes = json.data.flatMap((row: string[]) => {
      const [time, ...values] = row;
      return values.map((value: any, i: number) => ({
        date,
        time,
        symbol: indices[i].symbol,
        name: indices[i].name,
        price: numeral(value).value(),
      }));
    });

    return _(quotes).groupBy('symbol')
      .map(quotes => {
        const [prev, ...rows] = quotes;
        const { date, symbol, name } = prev;
        const data: Record<string, any> = {};
        data.date = date,
        data.exchange = Exchange.TWSE;
        data.market = Market.TSE;
        data.symbol = symbol,
        data.name = name.trim();
        data.open = _.minBy(rows, 'time').price;
        data.high = _.maxBy(rows, 'price').price;
        data.low = _.minBy(rows, 'price').price;
        data.close = _.maxBy(rows, 'time').price;
        data.change = numeral(data.close).subtract(prev.price).value();
        return data;
      }).value() as any;
  }
}
