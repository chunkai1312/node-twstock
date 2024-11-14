import * as _ from 'lodash';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Scraper } from './scraper';
import { Exchange, Index } from '../enums';
import { asIndex } from '../utils';
import { IndexHistorical, IndexTrades, MarketBreadth, MarketInstitutional, MarketMarginTrades, MarketTrades, StockCapitalReductions, StockDividends, StockFiniHoldings, StockHistorical, StockInstitutional, StockMarginTrades, StockShortSales, StockSplits, StockValues } from '../interfaces';

export class TwseScraper extends Scraper {
  async fetchStocksHistorical(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      type: 'ALLBUT0999',
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?${query}`;

    const response = await this.httpService.get(url, { headers: { 'Connection': 'keep-alive' }});
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const data = json.tables[8].data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TWSE;
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
    }) as StockHistorical[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksInstitutional(options: { date: string, symbol?: string }) {
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
      data.exchange = Exchange.TWSE;
      data.symbol = symbol;
      data.name = name.trim();
      data.institutional = ((values) => {
        switch (values.length) {
          case 17: return [
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
              investor: '投信',
              totalBuy: numeral(values[6]).value(),
              totalSell: numeral(values[7]).value(),
              difference: numeral(values[8]).value(),
            },
            {
              investor: '自營商',
              difference: numeral(values[9]).value(),
            },
            {
              investor: '自營商(自行買賣)',
              totalBuy: numeral(values[10]).value(),
              totalSell: numeral(values[11]).value(),
              difference: numeral(values[12]).value(),
            },
            {
              investor: '自營商(避險)',
              totalBuy: numeral(values[13]).value(),
              totalSell: numeral(values[14]).value(),
              difference: numeral(values[15]).value(),
            },
            {
              investor: '三大法人',
              difference: numeral(values[16]).value(),
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
          case 10: return [
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
              totalBuy: numeral(values[6]).value(),
              totalSell: numeral(values[7]).value(),
              difference: numeral(values[8]).value(),
            },
            {
              investor: '三大法人',
              difference: numeral(values[9]).value(),
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
      data.exchange = Exchange.TWSE;
      data.symbol = symbol;
      data.name = name.trim();
      data.issuedShares = numeral(values[0]).value();
      data.availableShares = numeral(values[1]).value();
      data.sharesHeld = numeral(values[2]).value();
      data.availablePercent = numeral(values[3]).value();
      data.heldPercent = numeral(values[4]).value();
      data.upperLimitPercent = numeral(values[5]).value();
      return data;
    }) as StockFiniHoldings[];

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
      data.exchange = Exchange.TWSE;
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
    }) as StockMarginTrades[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksShortSales(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/marginTrading/TWT93U?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.stat === 'OK') && response.data;
    if (!json.data.length) return null;

    const data = json.data.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TWSE;
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
      data.exchange = Exchange.TWSE;
      data.symbol = symbol;
      data.name = name.trim();
      data.peRatio = numeral(values[2]).value();
      data.pbRatio = numeral(values[3]).value();
      data.dividendYield = numeral(values[0]).value();
      data.dividendYear = numeral(values[1]).add(1911).value();
      return data;
    }) as StockValues[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksDividends(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const query = new URLSearchParams({
      startDate: DateTime.fromISO(startDate).toFormat('yyyyMMdd'),
      endDate: DateTime.fromISO(endDate).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/exRight/TWT49U?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.stat === 'OK' && response.data;
    if (!json) return [];

    const data = await Promise.all(json.data.map(async (row: string[]) => {
      const [date, symbol, name, ...values] = row;
      const formattedDate = date.replace(
        /(\d+)年(\d+)月(\d+)日/,
        (_, year, month, day) => {
          const westernYear = parseInt(year) + 1911;
          return `${westernYear}-${month.padStart(2, '0')}-${day.padStart(
            2,
            '0'
          )}`;
        }
      );

      const data: Record<string, any> = {};
      data.date = formattedDate;
      data.exchange = Exchange.TWSE;
      data.symbol = symbol;
      data.name = name.trim();
      data.previousClose = numeral(values[0]).value();
      data.referencePrice = numeral(values[1]).value();
      data.dividend = numeral(values[2]).value();
      data.dividendType = values[3].trim();
      data.limitUpPrice = numeral(values[4]).value();
      data.limitDownPrice = numeral(values[5]).value();
      data.openingReferencePrice = numeral(values[6]).value();
      data.exdividendReferencePrice = numeral(values[7]).value();

      const [_, detailDate] = values[8].split(',');
      const detail = await this.fetchStocksDividendsDetail({symbol, date: detailDate})

      return { ...data, ...detail };
    }) as StockDividends[]);

    return symbol ? data.filter((data) => data.symbol === symbol) : data;
  }

  async fetchStocksDividendsDetail(options: { date: string, symbol: string }) {
    const { date, symbol } = options;

    const query = new URLSearchParams({
      STK_NO: symbol,
      T1: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/exRight/TWT49UDetail?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.stat === 'ok' && response.data;
    if (!json) return null;

    const [_, name, ...values] = json.data[0];

    const data: Record<string, any> = {};
    data.symbol = symbol;
    data.name = name.trim();
    data.cashDividend = values[0] && parseFloat(values[0]);
    data.stockDividendShares = values[2] && parseFloat(values[2]);

    return data;
  }

  async fetchStocksCapitalReductions(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const query = new URLSearchParams({
      startDate: DateTime.fromISO(startDate).toFormat('yyyyMMdd'),
      endDate: DateTime.fromISO(endDate).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/reducation/TWTAUU?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.stat === 'OK' && response.data;
    if (!json) return [];

    const data = await Promise.all(json.data.map(async (row: string[]) => {
      const [date, symbol, name, ...values] = row;
      const [year, month, day] = date.split('/');

      const data: Record<string, any> = {};
      data.resumeDate = `${+year + 1911}-${month}-${day}`;
      data.exchange = Exchange.TWSE;
      data.symbol = symbol;
      data.name = name.trim();
      data.previousClose = numeral(values[0]).value();
      data.referencePrice = numeral(values[1]).value();
      data.limitUpPrice = numeral(values[2]).value();
      data.limitDownPrice = numeral(values[3]).value();
      data.openingReferencePrice = numeral(values[4]).value();
      data.exrightReferencePrice = numeral(values[5]).value();
      data.reason = values[6].trim();

      const [_, detailDate] = values[7].split(',');
      const detail = await this.fetchStockCapitalReductionDetail({symbol, date: detailDate})

      return { ...data, ...detail };
    }) as StockCapitalReductions[]);

    return symbol ? data.filter((data) => data.symbol === symbol) : data;
  }

  async fetchStockCapitalReductionDetail(options: {symbol: string, date: string}) {
    const { date, symbol } = options;
    const query = new URLSearchParams({
      STK_NO: symbol,
      FILE_DATE: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/reducation/TWTAVUDetail?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.stat === 'OK' && response.data;
    if (!json) return null;

    const [_, name, ...values] = json.data[0];
    const [year, month, day] = values[0].split('/');

    const data: Record<string, any> = {};

    data.symbol = symbol;
    data.name = name.trim();
    data.haltDate = `${+year + 1911}-${month}-${day}`;
    data.sharesPerThousand = parseFloat(values[1]);
    data.refundPerShare = parseFloat(values[2]);

    return data;
  }

  async fetchStocksSplits(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const query = new URLSearchParams({
      strDate: DateTime.fromISO(startDate).toFormat('yyyyMMdd'),
      endDate: DateTime.fromISO(endDate).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/pcversion/zh/exchangeReport/TWTB8U?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.stat === 'OK' && response.data;
    /* istanbul ignore next */ if (!json) return null;

    const data = json.data.map((row: string[]) => {
      const [date, symbol, name, ...values] = row;
      const [year, month, day] = date.split('/');

      const data: Record<string, any> = {};
      data.resumeDate = `${+year + 1911}-${month}-${day}`;
      data.exchange = Exchange.TWSE;
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
        data.exchange = Exchange.TWSE;
        data.symbol = symbol;
        data.name = name.trim();
        data.open = _.minBy(rows, 'time').price;
        data.high = _.maxBy(rows, 'price').price;
        data.low = _.minBy(rows, 'price').price;
        data.close = _.maxBy(rows, 'time').price;
        data.change = numeral(data.close).subtract(prev.price).value();
        return data;
      }).value() as IndexHistorical[];

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
      data.exchange = Exchange.TWSE;
      data.symbol = asIndex(row[0].trim());
      data.name = row[0].trim();
      data.tradeVolume = numeral(row[1]).value();
      data.tradeValue = numeral(row[2]).value();
      data.tradeWeight = +numeral(data.tradeValue).divide(market.tradeValue).multiply(100).format('0.00');
      return data;
    }) as IndexTrades[];

    const excludedSymbols = [Index.ChemicalBiotechnologyAndMedicalCare, Index.Electronics];
    const total = data
      .filter(row => !excludedSymbols.includes(row.symbol as Index))
      .reduce((total, row) => ({
        tradeVolume: total.tradeVolume + row.tradeVolume,
        tradeValue: total.tradeValue + row.tradeValue,
      }), { tradeVolume: 0, tradeValue: 0 });

    const electronics = _.find(data, { symbol: Index.Electronics }) as IndexTrades;
    const finance = _.find(data, { symbol: Index.FinancialAndInsurance }) as IndexTrades;

    const createIndexEntry = (symbol: Index, name: string, tradeVolume: number, tradeValue: number) => ({
      date,
      exchange: Exchange.TWSE,
      symbol,
      name,
      tradeVolume,
      tradeValue,
      tradeWeight: +numeral(tradeValue).divide(market.tradeValue).multiply(100).format('0.00')
    });

    const nonFinance = createIndexEntry(
      Index.NonFinance,
      '未含金融保險股指數',
      total.tradeVolume - finance.tradeVolume,
      total.tradeValue - finance.tradeValue
    );

    const nonElectronics = createIndexEntry(
      Index.NonElectronics,
      '未含電子股指數',
      total.tradeVolume - electronics.tradeVolume,
      total.tradeValue - electronics.tradeValue
    );

    const nonFinanceNonElectronics = createIndexEntry(
      Index.NonFinanceNonElectronics,
      '未含金融電子股指數',
      total.tradeVolume - (finance.tradeVolume + electronics.tradeVolume),
      total.tradeValue - (finance.tradeValue + electronics.tradeValue)
    );

    data.push(nonFinance, nonElectronics, nonFinanceNonElectronics);

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchMarketTrades(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?${query}`;

    const response = await this.httpService.get(url, { headers: { 'Connection': 'keep-alive' }});
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const [ _, ...values ] = json.tables[6].data.slice(-1)[0];
    const data: Record<string, any> = {};
    data.date = date,
    data.exchange = Exchange.TWSE;
    data.tradeVolume = numeral(values[1]).value();
    data.tradeValue = numeral(values[0]).value();
    data.transaction = numeral(values[2]).value();

    return data as MarketTrades;
  }

  async fetchMarketBreadth(options: { date: string }) {
    const { date } = options;
    const query = new URLSearchParams({
      date: DateTime.fromISO(date).toFormat('yyyyMMdd'),
      response: 'json',
    });
    const url = `https://www.twse.com.tw/rwd/zh/afterTrading/MI_INDEX?${query}`;

    const response = await this.httpService.get(url, { headers: { 'Connection': 'keep-alive' }});
    const json = (response.data.stat === 'OK') && response.data;
    if (!json) return null;

    const raw = json.tables[7].data.map((row: string[]) => row[2]);
    const [up, limitUp] = raw[0].replace(')', '').split('(');
    const [down, limitDown] = raw[1].replace(')', '').split('(');
    const [unchanged, unmatched, notApplicable] = raw.slice(2);

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TWSE,
    data.up = numeral(up).value();
    data.limitUp = numeral(limitUp).value();
    data.down = numeral(down).value();
    data.limitDown = numeral(limitDown).value();
    data.unchanged = numeral(unchanged).value();
    data.unmatched = numeral(unmatched).value();
    data.notApplicable = numeral(notApplicable).value();
    return data as MarketBreadth;
  }

  async fetchMarketInstitutional(options: { date: string }) {
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

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TWSE,
    data.institutional = json.data.map((row: string[]) => ({
      investor: row[0] === '合計' ? '三大法人' : row[0],
      totalBuy: numeral(row[1]).value(),
      totalSell: numeral(row[2]).value(),
      difference: numeral(row[3]).value(),
    }));
    return data as MarketInstitutional;
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
    data.exchange = Exchange.TWSE,
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
    return data as MarketMarginTrades;
  }
}
