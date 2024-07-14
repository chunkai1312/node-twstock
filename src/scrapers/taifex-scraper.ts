import * as _ from 'lodash';
import * as cheerio from 'cheerio';
import * as csvtojson from 'csvtojson';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { Exchange, FutOpt } from '../enums';
import { Scraper } from './scraper';

export class TaifexScraper extends Scraper {
  async fetchListedStockFutOpt() {
    const url = 'https://www.taifex.com.tw/cht/2/stockLists';
    const response = await this.httpService.get(url);
    const $ = cheerio.load(response.data);

    const list = $('#myTable tbody tr').map((_, el) => {
      const td = $(el).find('td');
      return {
        symbol: td.eq(0).text().trim(),
        underlyingStock: td.eq(1).text().trim(),
        underlyingSymbol: td.eq(2).text().trim(),
        underlyingName: td.eq(3).text().trim(),
        hasFutures: td.eq(4).text().includes('是股票期貨標的'),
        hasOptions: td.eq(5).text().includes('是股票選擇權標的'),
        isTwseStock: td.eq(6).text().includes('是上市普通股標的證券'),
        isTpexStock: td.eq(7).text().includes('是上櫃普通股標的證券'),
        isTwseETF: td.eq(8).text().includes('是上市ETF標的證券'),
        isTpexETF: td.eq(9).text().includes('是上櫃ETF標的證券'),
        shares: numeral(td.eq(10).text()).value(),
      } as Record<string, any>;
    }).toArray();

    const data = list.reduce((data, row) => {
      const isMicro = (row.shares === 100);
      const futures = {
        symbol: `${row.symbol}F`,
        name: `${isMicro ? '小型': ''}${row.underlyingName}期貨`,
        exchange: Exchange.TAIFEX,
        type: '股票期貨',
        underlyingSymbol: row.underlyingSymbol,
        underlyingName: row.underlyingName,
      };
      const options = {
        symbol: `${row.symbol}O`,
        name: `${isMicro ? '小型': ''}${row.underlyingName}選擇權`,
        exchange: Exchange.TAIFEX,
        type: '股票選擇權',
        underlyingName: row.underlyingName,
        underlying: row.underlyingSymbol,
      };
      if (row.hasFutures) data.push(futures);
      if (row.hasOptions) data.push(options);
      return data;
    }, []);

    return data;
  }

  async fetchFuturesHistorical(options: { date: string, symbol?: string, afterhours?: boolean }) {
    const { date, symbol, afterhours } = options;

    const alias: Record<string, string> = {
      'TX': 'TXF',  // 臺股期貨
      'TE': 'EXF',  // 電子期貨
      'TF': 'FXF',  // 金融期貨
      'MTX': 'MXF', // 小型臺指期貨
    };

    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      down_type: '1',
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodity_id: 'all',
    });
    const url = 'https://www.taifex.com.tw/cht/3/futDataDown';

    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);

    const [_, ...rows] = json;
    if (!rows.length) return null;

    const data = rows.map(row => {
      const [date, contract, contractMonth, ...values] = row;
      const data: Record<string, any> = {};
      data.date = DateTime.fromFormat(date, 'yyyy/MM/dd').toISODate();
      data.exchange = Exchange.TAIFEX;
      data.symbol = alias[contract] ?? contract;
      data.contractMonth = contractMonth;
      data.open = numeral(values[0]).value();
      data.high = numeral(values[1]).value();
      data.low = numeral(values[2]).value();
      data.close = numeral(values[3]).value();
      data.change = numeral(values[4]).value();
      data.changePercent = numeral(values[5].replace('%', '')).value();
      data.volume = numeral(values[6]).value();
      data.settlementPrice = numeral(values[7]).value();
      data.openInterest = numeral(values[8]).value();
      data.bestBid = numeral(values[9]).value();
      data.bestAsk = numeral(values[10]).value();8
      data.historicalHigh = numeral(values[11]).value();
      data.historicalLow = numeral(values[12]).value();
      data.session = values[14];
      data.volumeSpread = numeral(values[15]).value();
      return data;
    }).filter(row => afterhours ? row.session === '盤後' : row.session === '一般');

    return symbol ? data.filter(data => data.symbol === symbol) : data;
  }

  async fetchOptionsHistorical(options: { date: string, symbol?: string, afterhours?: boolean }) {
    const { date, symbol, afterhours } = options;

    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      down_type: '1',
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodity_id: 'all',
    });
    const url = 'https://www.taifex.com.tw/cht/3/optDataDown';

    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);

    const [_, ...rows] = json;
    if (!rows.length) return null;

    const data = rows.map(row => {
      const [date, contract, contractMonth, strikePrice, type, ...values] = row;
      const data: Record<string, any> = {};
      data.date = DateTime.fromFormat(date, 'yyyy/MM/dd').toISODate();
      data.exchange = Exchange.TAIFEX;
      data.symbol = contract;
      data.contractMonth = contractMonth;
      data.strikePrice = numeral(strikePrice).value();
      data.type = type;
      data.open = numeral(values[0]).value();
      data.high = numeral(values[1]).value();
      data.low = numeral(values[2]).value();
      data.close = numeral(values[3]).value();
      data.volume = numeral(values[4]).value();
      data.settlementPrice = numeral(values[5]).value();
      data.openInterest = numeral(values[6]).value();
      data.bestBid = numeral(values[7]).value();
      data.bestAsk = numeral(values[8]).value();
      data.historicalHigh = numeral(values[9]).value();
      data.historicalLow = numeral(values[10]).value();
      data.session = values[12];
      data.change = numeral(values[13]).value();
      data.changePercent = numeral(values[14].replace('%', '')).value();
      return data;
    }).filter(row => afterhours ? row.session === '盤後' : row.session === '一般');

    return symbol ? data.filter(data => data.symbol === symbol) : data;
  }

  async fetchFuturesInstitutional(options: { date: string, symbol: string }) {
    const { date, symbol } = options;
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodityId: symbol,
    });
    const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    if (response.data.toString().includes('查無資料')) return null;
    if (response.data.toString().includes('日期時間錯誤')) return null;

    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);
    const [_, ...rows] = json;

    const data: Record<string, any> = {};
    data.date = date,
    data.exchange = Exchange.TAIFEX;
    data.symbol = symbol;
    data.name = rows[0][1];
    data.institutional = rows.map(row => ({
      investor: row[2],
      longTradeVolume: numeral(row[3]).value(),
      longTradeValue: numeral(row[4]).value(),
      shortTradeVolume: numeral(row[5]).value(),
      shortTradeValue: numeral(row[6]).value(),
      netTradeVolume: numeral(row[7]).value(),
      netTradeValue: numeral(row[8]).value(),
      longOiVolume: numeral(row[9]).value(),
      longOiValue: numeral(row[10]).value(),
      shortOiVolume: numeral(row[11]).value(),
      shortOiValue: numeral(row[12]).value(),
      netOiVolume: numeral(row[13]).value(),
      netOiValue: numeral(row[14]).value(),
    }));
    return data;
  }

  async fetchOptionsInstitutional(options: { date: string, symbol: string }) {
    const { date, symbol } = options;
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodityId: symbol,
    });
    const url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDateDown';
    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    if (response.data.toString().includes('查無資料')) return null;
    if (response.data.toString().includes('日期時間錯誤')) return null;

    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);
    const [_, ...rows] = json;

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TAIFEX;
    data.symbol = symbol;
    data.name = rows[0][1];
    data.institutional = rows.map(row => ({
      type: row[2],
      investor: row[3],
      longTradeVolume: numeral(row[4]).value(),
      longTradeValue: numeral(row[5]).value(),
      shortTradeVolume: numeral(row[6]).value(),
      shortTradeValue: numeral(row[7]).value(),
      netTradeVolume: numeral(row[8]).value(),
      netTradeValue: numeral(row[9]).value(),
      longOiVolume: numeral(row[10]).value(),
      longOiValue: numeral(row[11]).value(),
      shortOiVolume: numeral(row[12]).value(),
      shortOiValue: numeral(row[13]).value(),
      netOiVolume: numeral(row[14]).value(),
      netOiValue: numeral(row[15]).value(),
    }));
    return data;
  }

  async fetchFuturesLargeTraders(options: { date: string, symbol: string }) {
    const { date, symbol } = options;

    const alias: Record<string, string> = {
      'TXF': 'TX',  // 臺股期貨
      'EXF': 'TE',  // 電子期貨
      'FXF': 'TF',  // 金融期貨
    };

    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
    });
    const url = 'https://www.taifex.com.tw/cht/3/largeTraderFutDown';

    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    if (response.data.toString().includes('查無資料')) return null;

    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);
    const [_, ...rows] = json;

    const targetRows = rows.filter(row => {
      return row[1] === (alias[symbol] ?? symbol) || (row[1] === symbol.substring(0, 2));
    });

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TAIFEX;
    data.symbol = symbol;
    data.name = targetRows[0][2];
    data.largeTraders = targetRows
      .map(row => ({
        contractMonth: row[3],
        traderType: row[4],
        topFiveLongOi: numeral(row[5]).value(),
        topFiveShortOi: numeral(row[6]).value(),
        topTenLongOi: numeral(row[7]).value(),
        topTenShortOi: numeral(row[8]).value(),
        marketOi: numeral(row[9]).value(),
      }));
    return data;
  }

  async fetchOptionsLargeTraders(options: { date: string, symbol: string }) {
    const { date, symbol } = options;

    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
    });
    const url = 'https://www.taifex.com.tw/cht/3/largeTraderOptDown';

    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    if (response.data.toString().includes('查無資料')) return null;

    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);
    const [_, ...rows] = json;

    const targetRows = rows.filter(row => {
      return row[1] === symbol || (row[1] === symbol.substring(0, 2));
    });

    const data: Record<string, any> = {};
    data.date = date;
    data.exchange = Exchange.TAIFEX;
    data.symbol = symbol;
    data.name = targetRows[0][2];
    data.largeTraders = targetRows
      .map(row => ({
        type: row[3],
        contractMonth: row[4],
        traderType: row[5],
        topFiveLongOi: numeral(row[6]).value(),
        topFiveShortOi: numeral(row[7]).value(),
        topTenLongOi: numeral(row[8]).value(),
        topTenShortOi: numeral(row[9]).value(),
        marketOi: numeral(row[10]).value(),
      }));
    return data;
  }

  async fetchMxfRetailPosition(options: { date: string }) {
    const date = options.date;

    const [fetchedMxfHistorical, fetchedMxfInstitutional] = await Promise.all([
      this.fetchFuturesHistorical({ date, symbol: 'MXF' }),
      this.fetchFuturesInstitutional({ date, symbol: 'MXF' }),
    ]);
    if (!fetchedMxfHistorical || !fetchedMxfInstitutional) return null;

    const mxfMarketOi = fetchedMxfHistorical
      .filter(row => row.session === '一般' && !row.volumeSpread)
      .reduce((oi, row) => oi + (numeral(row.openInterest).value() as number), 0);

    const { mxfInstitutionalLongOi, mxfInstitutionalShortOi } = fetchedMxfInstitutional.institutional
      .reduce((institutional: Record<string, number>, row: Record<string, any>) => ({
        mxfInstitutionalLongOi: institutional.mxfInstitutionalLongOi + row.longOiVolume,
        mxfInstitutionalShortOi: institutional.mxfInstitutionalShortOi + row.shortOiVolume,
      }), { mxfInstitutionalLongOi: 0, mxfInstitutionalShortOi: 0 });

    const data: Record<string, any> = {};
    data.date = date;
    data.mxfRetailLongOi = mxfMarketOi - mxfInstitutionalLongOi;
    data.mxfRetailShortOi = mxfMarketOi - mxfInstitutionalShortOi;
    data.mxfRetailNetOi = data.mxfRetailLongOi - data.mxfRetailShortOi;
    data.mxfRetailLongShortRatio = Math.round(data.mxfRetailNetOi / mxfMarketOi * 10000) / 10000;
    return data;
  }

  async fetchTxoPutCallRatio(options: { date: string }) {
    const { date } = options;
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
    });
    const url = 'https://www.taifex.com.tw/cht/3/pcRatioDown';

    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);

    const [_, row] = json;
    if (!row) return null;

    const data: Record<string, any> = {};
    data.date = date;
    data.txoPutVolume = numeral(row[1]).value();
    data.txoCallVolume = numeral(row[2]).value();
    data.txoPutCallVolumeRatio = numeral(row[3]).divide(100).value();
    data.txoPutOi = numeral(row[4]).value();
    data.txoCallOi = numeral(row[5]).value();
    data.txoPutCallOiRatio = numeral(row[6]).divide(100).value();
    return data;
  }

  async fetchExchangeRates(options: { date: string }) {
    const date = options.date;
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
    });
    const url = 'https://www.taifex.com.tw/cht/3/dailyFXRateDown';

    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);

    const [_, row] = json;
    if (!row.length) return null;

    const data: Record<string, any> = {};
    data.date = DateTime.fromFormat(row[0], 'yyyy/MM/dd').toISODate();
    data.usdtwd = numeral(row[1]).value();
    data.cnytwd = numeral(row[2]).value();
    data.eurusd = numeral(row[3]).value();
    data.usdjpy = numeral(row[4]).value();
    data.gbpusd = numeral(row[5]).value();
    data.audusd = numeral(row[6]).value();
    data.usdhkd = numeral(row[7]).value();
    data.usdcny = numeral(row[8]).value();
    data.usdzar = numeral(row[9]).value();
    data.nzdusd = numeral(row[10]).value();
    return data
  }

  // private buildFutOptContractSymbol(symbol: string, contractMonth: string, options?: { strikePrice: number, type: string }) {
  //   const alias: Record<string, string> = {
  //     'TX': 'TXF',  // 臺股期貨
  //     'TE': 'EXF',  // 電子期貨
  //     'TF': 'FXF',  // 金融期貨
  //     'MTX': 'MXF', // 小型臺指期貨
  //   };
  //   symbol = alias[symbol] ?? symbol;

  //   return contractMonth.split('/')
  //     .map(yearMonth => {
  //       const isWeekly = yearMonth.includes('W');
  //       const contract = isWeekly ? symbol.slice(0, -1) + yearMonth.slice(-1) : symbol;
  //       const strikePrice = (options?.strikePrice)
  //         ? numeral(options.strikePrice).multiply(['TXO', 'TFO', 'TGO'].includes(symbol) ? 1 : 10).format('00000')
  //         : '';
  //       const month = (options?.type === '賣權')
  //         ? String.fromCharCode(+yearMonth.slice(4, 6) + 76)
  //         : String.fromCharCode(+yearMonth.slice(4, 6) + 64);
  //       const year = yearMonth.slice(3, 4);
  //       return `${contract}${strikePrice}${month}${year}`;
  //     }).join('/');
  // }
}
