import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { Exchange } from '../enums';
import { asIndex, isWarrant } from '../utils';
import { IndexHistorical, IndexTrades, MarketBreadth, MarketInstitutional, MarketMarginTrades, MarketTrades, StockCapitalReductions, StockDividends, StockFiniHoldings, StockHistorical, StockInstitutional, StockMarginTrades, StockShortSales, StockSplits, StockValues } from '../interfaces';


export class TpexScraper extends Scraper {
  async fetchStocksHistorical(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/afterTrading/dailyQuotes?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return null;

    const data = json.tables[0].data
      .filter((row: string[]) => !isWarrant(row[0]))
      .map((row: string[]) => {
        const [symbol, name, ...values] = row;
        const data: Record<string, any> = {};
        data.date = date,
        data.exchange = Exchange.TPEx;
        data.symbol = symbol,
        data.name = name.trim();
        data.open = numeral(values[2]).value();
        data.high = numeral(values[3]).value();
        data.low = numeral(values[4]).value();
        data.close = numeral(values[0]).value();
        data.volume = numeral(values[6]).value();
        data.turnover = numeral(values[7]).value();
        data.transaction = numeral(values[8]).value();
        data.change = numeral(values[1]).value();
        return data;
      }) as StockHistorical[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksInstitutional(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      type: 'Daily',
      sect: 'EW',
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/insti/dailyTrade?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].totalCount > 0 || response.data.tables[1].totalCount > 0) && response.data;
    if (!json) return null;

    const data = (json.tables[0].data || json.tables[1].data).map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TPEx;
      data.symbol = symbol;
      data.name = name.trim();
      data.institutional = ((values) => {
        switch (values.length) {
          case 22: return [
            {
              investor: '外資及陸資(不含外資自營商)',
              totalBuy: numeral(values[0]).value(),
              totalSell: numeral(values[1]).value(),
              difference: numeral(values[2]).value(),
            },
            {
              investor: '外資自營商',
              totalBuy: numeral(values[3]).value(),
              totalSell: numeral(values[4]).value(),
              difference: numeral(values[5]).value(),
            },
            {
              investor: '外資及陸資',
              totalBuy: numeral(values[6]).value(),
              totalSell: numeral(values[7]).value(),
              difference: numeral(values[8]).value(),
            },
            {
              investor: '投信',
              totalBuy: numeral(values[9]).value(),
              totalSell: numeral(values[10]).value(),
              difference: numeral(values[11]).value(),
            },
            {
              investor: '自營商(自行買賣)',
              totalBuy: numeral(values[12]).value(),
              totalSell: numeral(values[13]).value(),
              difference: numeral(values[14]).value(),
            },
            {
              investor: '自營商(避險)',
              totalBuy: numeral(values[15]).value(),
              totalSell: numeral(values[16]).value(),
              difference: numeral(values[17]).value(),
            },
            {
              investor: '自營商',
              totalBuy: numeral(values[18]).value(),
              totalSell: numeral(values[19]).value(),
              difference: numeral(values[20]).value(),
            },
            {
              investor: '三大法人',
              difference: numeral(values[21]).value(),
            },
          ];
          case 14: return [
            {
              investor: '外資及陸資',
              totalBuy: numeral(values[0]).value(),
              totalSell: numeral(values[1]).value(),
              difference: numeral(values[2]).value(),
            },
            {
              investor: '投信',
              totalBuy: numeral(values[3]).value(),
              totalSell: numeral(values[4]).value(),
              difference: numeral(values[5]).value(),
            },
            {
              investor: '自營商',
              difference: numeral(values[6]).value(),
            },
            {
              investor: '自營商(自行買賣)',
              totalBuy: numeral(values[7]).value(),
              totalSell: numeral(values[8]).value(),
              difference: numeral(values[9]).value(),
            },
            {
              investor: '自營商(避險)',
              totalBuy: numeral(values[10]).value(),
              totalSell: numeral(values[11]).value(),
              difference: numeral(values[12]).value(),
            },
            {
              investor: '三大法人',
              difference: numeral(values[13]).value(),
            },
          ];
        }
      })(values);
      return data;
    }) as StockInstitutional[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksFiniHoldings(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const [year, month, day] = date.split('-');
    const form = new URLSearchParams({
      years: year,
      months: month,
      days: day,
      bcode: '',
      step: '2',
    });
    const url = `https://mops.twse.com.tw/server-java/t13sa150_otc`;
    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    const page = iconv.decode(response.data, 'big5');
    const $ = cheerio.load(page);

    const message = $('h3').text().trim();
    if (message === '查無所需資料') return null;

    const data = $('table:eq(0) tr').slice(2).map((_, el) => {
      const td = $(el).find('td');
      return {
        date,
        exchange: Exchange.TPEx,
        symbol: td.eq(0).text().trim(),
        name: td.eq(1).text().trim().split('(')[0],
        issuedShares: numeral(td.eq(2).text()).value(),
        availableShares: numeral(td.eq(3).text()).value(),
        sharesHeld: numeral(td.eq(4).text()).value(),
        availablePercent: numeral(td.eq(5).text()).value(),
        heldPercent: numeral(td.eq(6).text()).value(),
        upperLimitPercent: numeral(td.eq(7).text()).value(),
      };
    }).toArray() as StockFiniHoldings[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksMarginTrades(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/margin/balance?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return null;

    const data = json.tables[0].data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TPEx;
      data.symbol = symbol;
      data.name = name.trim();
      data.marginBuy = numeral(values[1]).value();
      data.marginSell = numeral(values[2]).value();
      data.marginRedeem = numeral(values[3]).value();
      data.marginBalancePrev = numeral(values[0]).value();
      data.marginBalance = numeral(values[4]).value();
      data.marginQuota = numeral(values[7]).value();
      data.shortBuy = numeral(values[10]).value();
      data.shortSell = numeral(values[9]).value();
      data.shortRedeem = numeral(values[11]).value();
      data.shortBalancePrev = numeral(values[8]).value();
      data.shortBalance = numeral(values[12]).value();
      data.shortQuota = numeral(values[15]).value();
      data.offset = numeral(values[16]).value();
      data.note = values[17].trim();
      return data;
    }) as StockMarginTrades[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksShortSales(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/margin/sbl?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return null;

    const data = json.tables[0].data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TPEx;
      data.symbol = symbol;
      data.name = name.trim();
      data.marginShortBalancePrev = numeral(values[0]).value();
      data.marginShortSell = numeral(values[1]).value();
      data.marginShortBuy = numeral(values[2]).value();
      data.marginShortRedeem = numeral(values[3]).value();
      data.marginShortBalance = numeral(values[4]).value();
      data.marginShortQuota = numeral(values[5]).value();
      data.sblShortBalancePrev = numeral(values[6]).value();
      data.sblShortSale = numeral(values[7]).value();
      data.sblShortReturn = numeral(values[8]).value();
      data.sblShortAdjustment = numeral(values[9]).value();
      data.sblShortBalance = numeral(values[10]).value();
      data.sblShortQuota = numeral(values[11]).value();
      data.note = values[12].trim();
      return data;
    }) as StockShortSales[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksValues(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/afterTrading/peQryDate?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return null;

    const data = json.tables[0].data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TPEx;
      data.symbol = symbol;
      data.name = name.trim();
      data.peRatio = numeral(values[0]).value();
      data.pbRatio = numeral(values[4]).value();
      data.dividendYield = numeral(values[3]).value();
      data.dividendYear = numeral(values[2]).add(1911).value();
      return data;
    }) as StockValues[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksDividends(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const form = new URLSearchParams({
      startDate: DateTime.fromISO(startDate).toFormat('yyyy/MM/dd'),
      endDate: DateTime.fromISO(endDate).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/bulletin/exDailyQ`;

    const response = await this.httpService.post(url, form);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return [];

    const data = json.tables[0].data.map((row: string[]) => {
      const [date, symbol, name, ...values] = row;
      const [year, month, day] = date.split('/');
      const data: Record<string, any> = {};
      data.date = `${+year + 1911}-${month}-${day}`;
      data.exchange = Exchange.TPEx;
      data.symbol = symbol;
      data.name = name.trim();
      data.previousClose = numeral(values[0]).value();
      data.referencePrice = numeral(values[1]).value();
      data.dividend = numeral(values[4]).value();
      data.dividendType = values[5].trim().replace('除', '');
      data.limitUpPrice = numeral(values[6]).value();
      data.limitDownPrice = numeral(values[7]).value();
      data.openingReferencePrice = numeral(values[8]).value();
      data.exdividendReferencePrice = numeral(values[9]).value();
      data.cashDividend = numeral(values[10]).value();
      data.stockDividendShares = numeral(values[11]).value();

      return data;
    }) as StockDividends[];

    return symbol ? data.filter((data) => data.symbol === symbol) : data;
  }

  async fetchStocksCapitalReduction(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const form = new URLSearchParams({
      startDate: DateTime.fromISO(startDate).toFormat('yyyy/MM/dd'),
      endDate: DateTime.fromISO(endDate).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/bulletin/revivt`;

    const response = await this.httpService.post(url, form);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return [];

    const data = json.tables[0].data.map((row: string[]) => {
      const [date, symbol, name, ...values] = row;

      const data: Record<string, any> = {};
      data.resumeDate = `${date}`.replace(/(\d{3})(\d{2})(\d{2})/, (_, year, month, day) => `${+year + 1911}-${month}-${day}`);
      data.exchange = Exchange.TPEx;
      data.symbol = symbol;
      data.name = name.trim();
      data.previousClose = numeral(values[0]).value();
      data.referencePrice = numeral(values[1]).value();
      data.limitUpPrice = numeral(values[2]).value();
      data.limitDownPrice = numeral(values[3]).value();
      data.openingReferencePrice = numeral(values[4]).value();
      data.exrightReferencePrice = numeral(values[5]).value();
      data.reason = values[6].trim();

      if (values[7]) {
        const $ = cheerio.load(values[7]);
        const haltDate = $(`th:contains('停止買賣日期')`).next('td').text().trim();
        const sharesPerThousand = $(`th:contains('每壹仟股換發新股票')`).next('td').text().trim();
        const refundPerShare = $(`th:contains('每股退還股款')`).next('td').text().trim();
        const [year, month, day] = haltDate.split('/');
        data.haltDate = `${+year + 1911}-${month}-${day}`;
        data.sharesPerThousand = numeral(sharesPerThousand.replace(' 股', '')).value();
        data.refundPerShare = numeral(refundPerShare.replace(' 元/股', '')).value();
      }

      return data;
    }) as StockCapitalReductions[];

    return symbol ? data.filter((data) => data.symbol === symbol) : data;
  }

  async fetchStocksSplits(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const form = new URLSearchParams({
      startDate: DateTime.fromISO(startDate).toFormat('yyyy/MM/dd'),
      endDate: DateTime.fromISO(endDate).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/bulletin/pvChgRslt`;

    const response = await this.httpService.post(url, form);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return [];

    const data = json.tables[0].data.map((row: string[]) => {
      const [date, symbol, name, ...values] = row;

      const data: Record<string, any> = {};
      data.resumeDate = `${date}`.replace(/(\d{3})(\d{2})(\d{2})/, (_, year, month, day) => `${+year + 1911}-${month}-${day}`);
      data.exchange = Exchange.TPEx;
      data.symbol = symbol;
      data.name = name.trim();
      data.previousClose = numeral(values[0]).value();
      data.referencePrice = numeral(values[1]).value();
      data.limitUpPrice = numeral(values[2]).value();
      data.limitDownPrice = numeral(values[3]).value();
      data.openingReferencePrice = numeral(values[4]).value();

      return data;
    }) as StockSplits[];

    return symbol ? data.filter((data) => data.symbol === symbol) : data;
  }

  async fetchIndicesHistorical(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/indexInfo/sectinx?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return null;

    const data = json.tables[0].data.map((row: string[]) => {
      const [_, ...values] = row;
      const name = (row[0] !== '櫃買指數') ? `櫃買${row[0].replace('類', '')}類指數` : row[0];
      const data: Record<string, any> = {};
      data.date = date,
      data.exchange = Exchange.TPEx;
      data.symbol = asIndex(name),
      data.name = name;
      data.open = numeral(values[2]).value();
      data.high = numeral(values[3]).value();
      data.low = numeral(values[4]).value();
      data.close = numeral(values[0]).value();
      data.change = numeral(values[1]).value();
      return data;
    }) as IndexHistorical[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchIndicesTrades(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/afterTrading/sectRatio?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return null;

    let data = json.tables[0].data.map((values: string[]) => {
      const index = `櫃買${values[0]}類指數`
      const data: Record<string, any> = {};
      data.date = date,
      data.exchange = Exchange.TPEx;
      data.symbol = asIndex(index);
      data.name = index;
      data.tradeVolume = numeral(values[3]).value();
      data.tradeValue = numeral(values[1]).value();
      data.tradeWeight = numeral(values[2]).value();
      return data;
    }) as IndexTrades[];

    if (!data.find(row => row.symbol === 'IX0047')) {
      const electronics = [
        'IX0053', 'IX0054', 'IX0055', 'IX0056',
        'IX0057', 'IX0058', 'IX0059', 'IX0099',
      ];

      const [electronic] = _(data)
        .filter(data => electronics.includes(data.symbol))
        .groupBy(_ => 'IX0047')
        .map((data, symbol) => ({
          date,
          exchange: Exchange.TPEx,
          symbol,
          name: '櫃買電子類指數',
          tradeVolume: _.sumBy(data, 'tradeVolume'),
          tradeValue: _.sumBy(data, 'tradeValue'),
          tradeWeight: +numeral(_.sumBy(data, 'tradeWeight')).format('0.00'),
        }))
        .value() as IndexTrades[];

      data = [...data, electronic];
    }
    data = data.filter(index => index.symbol);

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchMarketTrades(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      type: 'Daily',
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/afterTrading/marketStats?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].data.length) && response.data;
    if (!json) return null;

    const [ _, ...values ] = json.tables[0].summary[1];
    const data: Record<string, any> = {};
    data.date = date,
    data.exchange = Exchange.TPEx;
    data.tradeVolume = numeral(values[1]).value();
    data.tradeValue = numeral(values[0]).value();
    data.transaction = numeral(values[2]).value();

    return data as MarketTrades;
  }

  async fetchMarketBreadth(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/afterTrading/highlight?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.stat === 'ok' && response.data;
    if (!json) return null;

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TPEx;
    data.up = numeral(json.tables[0].data[0][7]).value();
    data.limitUp = numeral(json.tables[0].data[0][8]).value();
    data.down = numeral(json.tables[0].data[0][9]).value();
    data.limitDown = numeral(json.tables[0].data[0][10]).value();
    data.unchanged = numeral(json.tables[0].data[0][11]).value();
    data.unmatched= numeral(json.tables[0].data[0][12]).value();
    return data as MarketBreadth;
  }

  async fetchMarketInstitutional(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      type: 'Daily',
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/insti/summary?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].data.length) && response.data;
    if (!json) return null;

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TPEx,
    data.institutional = json.tables[0].data.map((row: string[]) => ({
      investor: row[0].trim(),
      totalBuy: numeral(row[1]).value(),
      totalSell: numeral(row[2]).value(),
      difference: numeral(row[3]).value(),
    }));

    return data as MarketInstitutional;
  }

  async fetchMarketMarginTrades(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyy/MM/dd'),
      response: 'json',
    });
    const url = `https://www.tpex.org.tw/www/zh-tw/margin/balance?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.tables[0].totalCount > 0) && response.data;
    if (!json) return null;

    const values = [...json.tables[0].summary[0].slice(2, -5), ...json.tables[0].summary[1].slice(2)];
    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TPEx;
    data.marginBuy = numeral(values[1]).value();
    data.marginSell = numeral(values[2]).value();
    data.marginRedeem = numeral(values[3]).value();
    data.marginBalancePrev = numeral(values[0]).value();
    data.marginBalance = numeral(values[4]).value();
    data.shortBuy = numeral(values[10]).value();
    data.shortSell = numeral(values[9]).value();
    data.shortRedeem = numeral(values[11]).value();
    data.shortBalancePrev = numeral(values[8]).value();
    data.shortBalance = numeral(values[12]).value();
    data.marginBuyValue = numeral(values[14]).value();
    data.marginSellValue = numeral(values[15]).value();
    data.marginRedeemValue = numeral(values[16]).value();
    data.marginBalancePrevValue = numeral(values[13]).value();
    data.marginBalanceValue = numeral(values[17]).value();
    return data as MarketMarginTrades;
  }
}
