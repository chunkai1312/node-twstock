import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { Scraper } from './scraper';
import { Exchange, Market } from '../enums';
import { asIndex, isWarrant } from '../utils';

export class TpexScraper extends Scraper {
  async fetchStocksHistorical(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const [ year, month, day ] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/daily_close_quotes/stk_quote_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data = json.aaData
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
      }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksInstitutional(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
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

    const data = json.aaData.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TPEx;
      data.symbol = symbol;
      data.name = name.trim();
      data.institutional = ((values) => {
        switch (values.length) {
          case 23: return [
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
          case 15: return [
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
    }) as Record<string, any>[];

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
    }).toArray() as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksMarginTrades(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data = json.aaData.map((row: string[]) => {
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
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksShortSales(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/margin_trading/margin_sbl/margin_sbl_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data = json.aaData.map((row: string[]) => {
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
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksValues(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/peratio_analysis/pera_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data = json.aaData.map((row: string[]) => {
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
    }) as Record<string, any>[];

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchStocksDividends(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const [startYear, startMonth, startDay] = startDate.split('-')
    const [endYear, endMonth, endDay] = endDate.split('-')
    const query = new URLSearchParams({
      d: `${+startYear - 1911}/${startMonth}/${startDay}`,
      ed: `${+endYear - 1911}/${endMonth}/${endDay}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/exright/dailyquo/exDailyQ_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return [];

    const data = json.aaData.map((row: string[]) => {
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
    }) as Record<string, any>[];

    return symbol ? data.filter((data) => data.symbol === symbol) : data;
  }

  async fetchStocksCapitalReduction(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const [startYear, startMonth, startDay] = startDate.split('-')
    const [endYear, endMonth, endDay] = endDate.split('-')
    const query = new URLSearchParams({
      d: `${+startYear - 1911}/${startMonth}/${startDay}`,
      ed: `${+endYear - 1911}/${endMonth}/${endDay}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/exright/revivt/revivt_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return [];

    const data = json.aaData.map((row: string[]) => {
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

      const urlPattern = /window\.open\('(.+?)',/;
      const match = values[7].match(urlPattern);

      if (match) {
        const url = match[1];
        const urlParams = new URLSearchParams(url.split('?')[1]);
        const details = [...urlParams.values()];
        data.haltDate = `${details[2]}`.replace(
          /(\d{3})(\d{2})(\d{2})/,
          (_, year, month, day) => `${+year + 1911}-${month}-${day}`
        );
        data.sharesPerThousand = numeral(details[4]).value();
        data.refundPerShare = numeral(details[5]).value();
      }

      return data;
    }) as Record<string, any>[];

    return symbol ? data.filter((data) => data.symbol === symbol) : data;
  }

  async fetchStocksSplits(options: { startDate: string; endDate: string, symbol?: string }) {
    const { startDate, endDate, symbol } = options;
    const [startYear, startMonth, startDay] = startDate.split('-')
    const [endYear, endMonth, endDay] = endDate.split('-')
    const query = new URLSearchParams({
      d: `${+startYear - 1911}/${startMonth}/${startDay}`,
      ed: `${+endYear - 1911}/${endMonth}/${endDay}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/bulletin/parvaluechg/rslt_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return [];

    const data = json.aaData.map((row: string[]) => {
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
    }) as Record<string, any>[];

    return symbol ? data.filter((data) => data.symbol === symbol) : data;
  }

  async fetchIndicesHistorical(options: { date: string, symbol?: string }) {
    const { date, symbol } = options;
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

    const data = _(quotes).groupBy('symbol')
      .map(quotes => {
        const [prev, ...rows] = quotes;
        const { date, symbol, name } = prev;
        const data: Record<string, any> = {};
        data.date = date,
        data.exchange = Exchange.TPEx;
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
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/historical/trading_vol_ratio/sectr_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    let data = json.aaData.map((values: string[]) => {
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
    }) as Record<string, any>[];

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
        .value() as Record<string, any>[];

      data = [...data, electronic];
    }
    data = data.filter(index => index.symbol);

    return symbol ? data.find(data => data.symbol === symbol) : data;
  }

  async fetchMarketTrades(options: { date: string }) {
    const { date } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/daily_trading_index/st41_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data = json.aaData.map((row: string[]) => {
      const [year, month, day] = row[0].split('/');
      return {
        date: `${+year + 1911}-${month}-${day}`,
        exchange: Exchange.TPEx,
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
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/market_highlight/highlight_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TPEx;
    data.up = numeral(json.upNum).value();
    data.limitUp = numeral(json.upStopNum).value();
    data.down = numeral(json.downNum).value();
    data.limitDown = numeral(json.downStopNum).value();
    data.unchanged = numeral(json.noChangeNum).value();
    data.unmatched= numeral(json.noTradeNum).value();
    return data;
  }

  async fetchMarketInstitutional(options: { date: string }) {
    const { date } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      t: 'D',
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/3insti/3insti_summary/3itrdsum_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TPEx,
    data.institutional = json.aaData.map((row: string[]) => ({
      investor: row[0].trim(),
      totalBuy: numeral(row[1]).value(),
      totalSell: numeral(row[2]).value(),
      difference: numeral(row[3]).value(),
    }));

    return data;
  }

  async fetchMarketMarginTrades(options: { date: string }) {
    const { date } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/margin_trading/margin_balance/margin_bal_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const values = [...json.tfootData_one, ...json.tfootData_two];
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
    return data;
  }
}
