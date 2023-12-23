import * as _ from 'lodash';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { asIndex } from '../utils';

export class TwseScraper extends Scraper {
  async fetchStocksHistorical(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      type: 'ALLBUT0999',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.tables[8].data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
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
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksInstInvestorsTrades(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'ALLBUT0999',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/fund/T86?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
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
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksFiniHoldings(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'ALLBUT0999',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/fund/MI_QFIIS?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.data.map((row: string[]) => {
      const [symbol, name, isin, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.symbol = symbol;
      data.name = name.trim();
      data.issuedShares = numeral(values[0]).value();
      data.availableShares = numeral(values[1]).value();
      data.sharesHeld = numeral(values[2]).value();
      data.availablePercent = numeral(values[3]).value();
      data.heldPercent = numeral(values[4]).value();
      data.upperLimitPercent = numeral(values[5]).value();
      return data;
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksMarginTrades(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'ALL',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.tables[1].data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
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
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksValues(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'ALL',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/BWIBBU_d?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.symbol = symbol;
      data.name = name.trim();
      data.peRatio = numeral(values[2]).value();
      data.pbRatio = numeral(values[3]).value();
      data.dividendYield = numeral(values[0]).value();
      data.dividendYear = numeral(values[1]).add(1911).value();
      return data;
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchIndicesHistorical(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
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

    const data = _(quotes).groupBy('symbol')
      .map(quotes => {
        const [prev, ...rows] = quotes;
        const { date, symbol, name } = prev;
        const data: Record<string, any> = {};
        data.date = date,
        data.symbol = symbol,
        data.name = name.trim();
        data.open = _.minBy(rows, 'time').price;
        data.high = _.maxBy(rows, 'price').price;
        data.low = _.minBy(rows, 'price').price;
        data.close = _.maxBy(rows, 'time').price;
        data.change = numeral(data.close).subtract(prev.price).value();
        return data;
      }).value() as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchIndicesTrades(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/BFIAMU?${query}`;
    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const market = await this.fetchMarketTrades({ date });
    if (!market) return null;

    const data = json.data.map((row: string[]) => {
      const data: Record<string, any> = {};
      data.date = date,
      data.symbol = asIndex(row[0].trim());
      data.name = row[0].trim();
      data.tradeVolume = numeral(row[1]).value();
      data.tradeValue = numeral(row[2]).value();
      data.tradeWeight = +numeral(data.tradeValue).divide(market.tradeValue).multiply(100).format('0.00');
      return data;
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchMarketTrades(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/FMTQIK?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.data.map((row: string[]) => {
      const [year, month, day] = row[0].split('/');
      return {
        date: `${+year + 1911}-${month}-${day}`,
        tradeVolume: numeral(row[1]).value(),
        tradeValue: numeral(row[2]).value(),
        transaction: numeral(row[3]).value(),
        index: numeral(row[4]).value(),
        change: numeral(row[5]).value(),
      };
    }) as Record<string, any>[];

    return data.find(data => data.date === date);
  }

  async fetchMarketBreadth(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const raw = json.tables[7].data.map((row: string[]) => row[2]);
    const [up, limitUp] = raw[0].replace(')', '').split('(');
    const [down, limitDown] = raw[1].replace(')', '').split('(');
    const [unchanged, unmatched, notApplicable] = raw.slice(2);

    const data: Record<string, any> = {};
    data.date = date;
    data.up = numeral(up).value();
    data.limitUp = numeral(limitUp).value();
    data.down = numeral(down).value();
    data.limitDown = numeral(limitDown).value();
    data.unchanged = numeral(unchanged).value();
    data.unmatched = numeral(unmatched).value();
    data.notApplicable = numeral(notApplicable).value();
    return data;
  }

  async fetchMarketInstInvestorsTrades(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      dayDate: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      type: 'day',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/fund/BFI82U?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const values = json.data.map((row: string []) => row.slice(1)).flat();
    const data: Record<string, any> = {};
    data.date = date;
    data.finiWithoutDealersBuy = numeral(values[9]).value();
    data.finiWithoutDealersSell = numeral(values[10]).value();
    data.finiWithoutDealersNetBuySell = numeral(values[11]).value();
    data.finiDealersBuy = numeral(values[12]).value();
    data.finiDealersSell = numeral(values[13]).value();
    data.finiDealersNetBuySell = numeral(values[14]).value();
    data.finiBuy = data.finiWithoutDealersBuy + data.finiDealersBuy;
    data.finiSell = data.finiWithoutDealersSell + data.finiDealersSell;
    data.finiNetBuySell = data.finiWithoutDealersNetBuySell + data.finiDealersNetBuySell;
    data.sitcBuy = numeral(values[6]).value();
    data.sitcSell = numeral(values[7]).value();
    data.sitcNetBuySell = numeral(values[8]).value();
    data.dealersForProprietaryBuy = numeral(values[0]).value();
    data.dealersForProprietarySell = numeral(values[1]).value();
    data.dealersForProprietaryNetBuySell = numeral(values[2]).value();
    data.dealersForHedgingBuy = numeral(values[3]).value();
    data.dealersForHedgingSell = numeral(values[4]).value();
    data.dealersForHedgingNetBuySell = numeral(values[5]).value();
    data.dealersBuy = data.dealersForProprietaryBuy + data.dealersForHedgingBuy;
    data.dealersSell = data.dealersForProprietarySell + data.dealersForHedgingSell;
    data.dealersNetBuySell = data.dealersForProprietaryNetBuySell + data.dealersForHedgingNetBuySell;
    data.totalInstInvestorsBuy = numeral(values[15]).value();
    data.totalInstInvestorsSell = numeral(values[16]).value();
    data.totalInstInvestorsNetBuySell = numeral(values[17]).value();
    return data;
  }

  async fetchMarketMarginTrades(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      selectType: 'MS',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/marginTrading/MI_MARGN?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const values = json.tables[0].data.map((row: string []) => row.slice(1)).flat();
    const data: Record<string, any> = {};
    data.date = date;
    data.marginBuy = numeral(values[0]).value();
    data.marginSell = numeral(values[1]).value();
    data.marginRedeem = numeral(values[2]).value();
    data.marginBalancePrev = numeral(values[3]).value();
    data.marginBalance = numeral(values[4]).value();
    data.shortBuy = numeral(values[5]).value();
    data.shortSell = numeral(values[6]).value();
    data.shortRedeem = numeral(values[7]).value();
    data.shortBalancePrev = numeral(values[8]).value();
    data.shortBalance = numeral(values[9]).value();
    data.marginBuyValue = numeral(values[10]).value();
    data.marginSellValue = numeral(values[11]).value();
    data.marginRedeemValue = numeral(values[12]).value();
    data.marginBalancePrevValue = numeral(values[13]).value();
    data.marginBalanceValue = numeral(values[14]).value();
    return data;
  }
}
