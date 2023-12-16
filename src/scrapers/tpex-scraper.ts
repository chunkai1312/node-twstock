import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as iconv from 'iconv-lite';
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
      .filter((row: string[]) => !isWarrant(row[0]))
      .map((row: string[]) => {
        const [symbol, name, ...values] = row;
        const data: Record<string, any> = {};
        data.date = date,
        data.exchange = Exchange.TPEx;
        data.market = Market.OTC;
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

    return json.aaData.map((row: string[]) => {
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

  async fetchStocksFiniHoldings(options: { date: string }) {
    const { date } = options;
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

    return $('table:eq(0) tr').slice(2).map((_, el) => {
      const td = $(el).find('td');
      return {
        date,
        exchange: Exchange.TPEx,
        market: Market.OTC,
        symbol: td.eq(0).text().trim(),
        name: td.eq(1).text().trim().split('(')[0],
        issuedShares: numeral(td.eq(2).text()).value(),
        availableShares: numeral(td.eq(3).text()).value(),
        sharesHeld: numeral(td.eq(4).text()).value(),
        availablePercent: numeral(td.eq(5).text()).value(),
        heldPercent: numeral(td.eq(6).text()).value(),
        upperLimitPercent: numeral(td.eq(7).text()).value(),
      };
    }).toArray() as any;
  }

  async fetchStocksMarginTrades(options: { date: string }) {
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

    return json.aaData.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TPEx;
      data.market = Market.OTC;
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
    });
  }

  async fetchStocksValues(options: { date: string }) {
    const { date } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/aftertrading/peratio_analysis/pera_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    return json.aaData.map((row: string[]) => {
      const [symbol, name, ...values] = row;
      const data: Record<string, any> = {};
      data.date = date;
      data.exchange = Exchange.TPEx;
      data.market = Market.OTC;
      data.symbol = symbol;
      data.name = name.trim();
      data.peRatio = numeral(values[0]).value();
      data.pbRatio = numeral(values[4]).value();
      data.dividendYield = numeral(values[3]).value();
      data.dividendYear = numeral(values[2]).add(1911).value();
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
        data.name = name.trim();
        data.open = _.minBy(rows, 'time').price;
        data.high = _.maxBy(rows, 'price').price;
        data.low = _.minBy(rows, 'price').price;
        data.close = _.maxBy(rows, 'time').price;
        data.change = numeral(data.close).subtract(prev.price).value();
        return data;
      }).value() as any;
  }

  async fetchIndicesTrades(options: { date: string }) {
    const { date } = options;
    const [year, month, day] = date.split('-');
    const query = new URLSearchParams({
      d: `${+year - 1911}/${month}/${day}`,
      o: 'json',
    });
    const url = `https://www.tpex.org.tw/web/stock/historical/trading_vol_ratio/sectr_result.php?${query}`;

    const response = await this.httpService.get(url);
    const json = response.data.iTotalRecords > 0 && response.data;
    if (!json) return null;

    const data = json.aaData.map((values: string[]) => {
      const index = `櫃買${values[0]}類指數`
      const data: Record<string, any> = {};
      data.date = date,
      data.exchange = Exchange.TPEx;
      data.market = Market.OTC;
      data.symbol = asIndex(index);
      data.name = index;
      data.tradeVolume = numeral(values[3]).value();
      data.tradeValue = numeral(values[1]).value();
      data.tradeWeight = numeral(values[2]).value();
      return data;
    });

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
        market: Market.OTC,
        symbol,
        name: '櫃買電子類指數',
        tradeVolume: _.sumBy(data, 'tradeVolume'),
        tradeValue: _.sumBy(data, 'tradeValue'),
        tradeWeight: +numeral(_.sumBy(data, 'tradeWeight')).format('0.00'),
      }))
      .value();

    return [...data, electronic].filter(index => index.symbol) as any;
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

    return json.aaData.map((row: string[]) => {
      const [year, month, day] = row[0].split('/');
      return {
        date: `${+year + 1911}-${month}-${day}`,
        exchange: Exchange.TPEx,
        market: Market.OTC,
        tradeVolume: numeral(row[1]).value(),
        tradeValue: numeral(row[2]).value(),
        transaction: numeral(row[3]).value(),
        index: numeral(row[4]).value(),
        change: numeral(row[5]).value(),
      };
    }).find((data: Record<string, any>) => data.date === date);
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
    data.market = Market.OTC;
    data.up = numeral(json.upNum).value();
    data.limitUp = numeral(json.upStopNum).value();
    data.down = numeral(json.downNum).value();
    data.limitDown = numeral(json.downStopNum).value();
    data.unchanged = numeral(json.noChangeNum).value();
    data.unmatched= numeral(json.noTradeNum).value();
    return data;
  }

  async fetchMarketInstTrades(options: { date: string }) {
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

    const values = json.aaData.map((row: string []) => row.slice(1)).flat();
    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TPEx;
    data.market = Market.OTC;
    data.finiWithoutDealersBuy = numeral(values[3]).value();
    data.finiWithoutDealersSell = numeral(values[4]).value();
    data.finiWithoutDealersNetBuySell = numeral(values[5]).value();
    data.finiDealersBuy = numeral(values[6]).value();
    data.finiDealersSell = numeral(values[7]).value();
    data.finiDealersNetBuySell = numeral(values[8]).value();
    data.finiBuy = numeral(values[0]).value();
    data.finiSell = numeral(values[1]).value();
    data.finiNetBuySell = numeral(values[2]).value();
    data.sitcBuy = numeral(values[9]).value();
    data.sitcSell = numeral(values[10]).value();
    data.sitcNetBuySell = numeral(values[11]).value();
    data.dealersForProprietaryBuy = numeral(values[15]).value();
    data.dealersForProprietarySell = numeral(values[16]).value();
    data.dealersForProprietaryNetBuySell = numeral(values[17]).value();
    data.dealersForHedgingBuy = numeral(values[18]).value();
    data.dealersForHedgingSell = numeral(values[19]).value();
    data.dealersForHedgingNetBuySell = numeral(values[20]).value();
    data.dealersBuy = numeral(values[12]).value();
    data.dealersSell = numeral(values[13]).value();
    data.dealersNetBuySell = numeral(values[14]).value();
    data.totalInstInvestorsBuy = numeral(values[21]).value();
    data.totalInstInvestorsSell = numeral(values[22]).value();
    data.totalInstInvestorsNetBuySell = numeral(values[23]).value();
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
    data.market = Market.OTC;
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
