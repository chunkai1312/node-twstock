import * as _ from 'lodash';
import * as csvtojson from 'csvtojson';
import * as iconv from 'iconv-lite';
import * as numeral from 'numeral';
import { DateTime } from 'luxon';
import { FutOpt } from '../enums';
import { Scraper } from './scraper';

export class TaifexScraper extends Scraper {
  async fetchTxfInstTrades(options: { date: string }) {
    const { date } = options;
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodityId: 'TXF',
    });
    const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    if (response.data.toString().includes('查無資料')) return null;

    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);
    const [_, dealers, sitc, fini] = json;

    const data: Record<string, any> = {};
    data.date = date,
    data.symbol = FutOpt.TXF,
    data.name = fini[1],
    data.finiLongTradeVolume = numeral(fini[3]).value();
    data.finiLongTradeValue = numeral(fini[4]).value();
    data.finiShortTradeVolume = numeral(fini[5]).value();
    data.finiShortTradeValue = numeral(fini[6]).value();
    data.finiNetTradeVolume = numeral(fini[7]).value();
    data.finiNetTradeValue = numeral(fini[8]).value();
    data.finiLongOiVolume = numeral(fini[9]).value();
    data.finiLongOiValue = numeral(fini[10]).value();
    data.finiShortOiVolume = numeral(fini[11]).value();
    data.finiShortOiValue = numeral(fini[12]).value();
    data.finiNetOiVolume = numeral(fini[13]).value();
    data.finiNetOiValue = numeral(fini[14]).value();
    data.sitcLongTradeVolume = numeral(sitc[3]).value();
    data.sitcLongTradeValue = numeral(sitc[4]).value();
    data.sitcShortTradeVolume = numeral(sitc[5]).value();
    data.sitcShortTradeValue = numeral(sitc[6]).value();
    data.sitcNetTradeVolume = numeral(sitc[7]).value();
    data.sitcNetTradeValue = numeral(sitc[8]).value();
    data.sitcLongOiVolume = numeral(sitc[9]).value();
    data.sitcLongOiValue = numeral(sitc[10]).value();
    data.sitcShortOiVolume = numeral(sitc[11]).value();
    data.sitcShortOiValue = numeral(sitc[12]).value();
    data.sitcNetOiVolume = numeral(sitc[13]).value();
    data.sitcNetOiValue = numeral(sitc[14]).value();
    data.dealersLongTradeVolume = numeral(dealers[3]).value();
    data.dealersLongTradeValue = numeral(dealers[4]).value();
    data.dealersShortTradeVolume = numeral(dealers[5]).value();
    data.dealersShortTradeValue = numeral(dealers[6]).value();
    data.dealersNetTradeVolume = numeral(dealers[7]).value();
    data.dealersNetTradeValue = numeral(dealers[8]).value();
    data.dealersLongOiVolume = numeral(dealers[9]).value();
    data.dealersLongOiValue = numeral(dealers[10]).value();
    data.dealersShortOiVolume = numeral(dealers[11]).value();
    data.dealersShortOiValue = numeral(dealers[12]).value();
    data.dealersNetOiVolume = numeral(dealers[13]).value();
    data.dealersNetOiValue = numeral(dealers[14]).value();
    return data;
  }

  async fetchMxfInstTrades(options: { date: string }) {
    const { date } = options;
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodityId: 'MXF',
    });
    const url = 'https://www.taifex.com.tw/cht/3/futContractsDateDown';
    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    if (response.data.toString().includes('查無資料')) return null;

    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);
    const [_, dealers, sitc, fini] = json;

    const data: Record<string, any> = {};
    data.date = date,
    data.symbol = FutOpt.MXF,
    data.name = fini[1],
    data.finiLongTradeVolume = numeral(fini[3]).value();
    data.finiLongTradeValue = numeral(fini[4]).value();
    data.finiShortTradeVolume = numeral(fini[5]).value();
    data.finiShortTradeValue = numeral(fini[6]).value();
    data.finiNetTradeVolume = numeral(fini[7]).value();
    data.finiNetTradeValue = numeral(fini[8]).value();
    data.finiLongOiVolume = numeral(fini[9]).value();
    data.finiLongOiValue = numeral(fini[10]).value();
    data.finiShortOiVolume = numeral(fini[11]).value();
    data.finiShortOiValue = numeral(fini[12]).value();
    data.finiNetOiVolume = numeral(fini[13]).value();
    data.finiNetOiValue = numeral(fini[14]).value();
    data.sitcLongTradeVolume = numeral(sitc[3]).value();
    data.sitcLongTradeValue = numeral(sitc[4]).value();
    data.sitcShortTradeVolume = numeral(sitc[5]).value();
    data.sitcShortTradeValue = numeral(sitc[6]).value();
    data.sitcNetTradeVolume = numeral(sitc[7]).value();
    data.sitcNetTradeValue = numeral(sitc[8]).value();
    data.sitcLongOiVolume = numeral(sitc[9]).value();
    data.sitcLongOiValue = numeral(sitc[10]).value();
    data.sitcShortOiVolume = numeral(sitc[11]).value();
    data.sitcShortOiValue = numeral(sitc[12]).value();
    data.sitcNetOiVolume = numeral(sitc[13]).value();
    data.sitcNetOiValue = numeral(sitc[14]).value();
    data.dealersLongTradeVolume = numeral(dealers[3]).value();
    data.dealersLongTradeValue = numeral(dealers[4]).value();
    data.dealersShortTradeVolume = numeral(dealers[5]).value();
    data.dealersShortTradeValue = numeral(dealers[6]).value();
    data.dealersNetTradeVolume = numeral(dealers[7]).value();
    data.dealersNetTradeValue = numeral(dealers[8]).value();
    data.dealersLongOiVolume = numeral(dealers[9]).value();
    data.dealersLongOiValue = numeral(dealers[10]).value();
    data.dealersShortOiVolume = numeral(dealers[11]).value();
    data.dealersShortOiValue = numeral(dealers[12]).value();
    data.dealersNetOiVolume = numeral(dealers[13]).value();
    data.dealersNetOiValue = numeral(dealers[14]).value();
    return data;
  }

  async fetchTxoInstTrades(options: { date: string }) {
    const { date } = options;
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodityId: 'TXO',
    });
    const url = 'https://www.taifex.com.tw/cht/3/callsAndPutsDateDown';
    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    if (response.data.toString().includes('查無資料')) return null;

    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);
    const [_, dealersCalls, sitcCalls, finiCalls, dealersPuts, sitcPuts, finiPuts] = json;

    const data: Record<string, any> = {};
    data.date = date;
    data.symbol = FutOpt.TXO;
    data.name = dealersCalls[1];
    data.calls = {};
    data.calls.finiLongTradeVolume = numeral(finiCalls[4]).value();
    data.calls.finiLongTradeValue = numeral(finiCalls[5]).value();
    data.calls.finiShortTradeVolume = numeral(finiCalls[6]).value();
    data.calls.finiShortTradeValue = numeral(finiCalls[7]).value();
    data.calls.finiNetTradeVolume = numeral(finiCalls[8]).value();
    data.calls.finiNetTradeValue = numeral(finiCalls[9]).value();
    data.calls.finiLongOiVolume = numeral(finiCalls[10]).value();
    data.calls.finiLongOiValue = numeral(finiCalls[11]).value();
    data.calls.finiShortOiVolume = numeral(finiCalls[12]).value();
    data.calls.finiShortOiValue = numeral(finiCalls[13]).value();
    data.calls.finiNetOiVolume = numeral(finiCalls[14]).value();
    data.calls.finiNetOiValue = numeral(finiCalls[15]).value();
    data.calls.sitcLongTradeVolume = numeral(sitcCalls[4]).value();
    data.calls.sitcLongTradeValue = numeral(sitcCalls[5]).value();
    data.calls.sitcShortTradeVolume = numeral(sitcCalls[6]).value();
    data.calls.sitcShortTradeValue = numeral(sitcCalls[7]).value();
    data.calls.sitcNetTradeVolume = numeral(sitcCalls[8]).value();
    data.calls.sitcNetTradeValue = numeral(sitcCalls[9]).value();
    data.calls.sitcLongOiVolume = numeral(sitcCalls[10]).value();
    data.calls.sitcLongOiValue = numeral(sitcCalls[11]).value();
    data.calls.sitcShortOiVolume = numeral(sitcCalls[12]).value();
    data.calls.sitcShortOiValue = numeral(sitcCalls[13]).value();
    data.calls.sitcNetOiVolume = numeral(sitcCalls[14]).value();
    data.calls.sitcNetOiValue = numeral(sitcCalls[15]).value();
    data.calls.dealersLongTradeVolume = numeral(dealersCalls[4]).value();
    data.calls.dealersLongTradeValue = numeral(dealersCalls[5]).value();
    data.calls.dealersShortTradeVolume = numeral(dealersCalls[6]).value();
    data.calls.dealersShortTradeValue = numeral(dealersCalls[7]).value();
    data.calls.dealersNetTradeVolume = numeral(dealersCalls[8]).value();
    data.calls.dealersNetTradeValue = numeral(dealersCalls[9]).value();
    data.calls.dealersLongOiVolume = numeral(dealersCalls[10]).value();
    data.calls.dealersLongOiValue = numeral(dealersCalls[11]).value();
    data.calls.dealersShortOiVolume = numeral(dealersCalls[12]).value();
    data.calls.dealersShortOiValue = numeral(dealersCalls[13]).value();
    data.calls.dealersNetOiVolume = numeral(dealersCalls[14]).value();
    data.calls.dealersNetOiValue = numeral(dealersCalls[15]).value();
    data.puts = {};
    data.puts.finiLongTradeVolume = numeral(finiPuts[4]).value();
    data.puts.finiLongTradeValue = numeral(finiPuts[5]).value();
    data.puts.finiShortTradeVolume = numeral(finiPuts[6]).value();
    data.puts.finiShortTradeValue = numeral(finiPuts[7]).value();
    data.puts.finiNetTradeVolume = numeral(finiPuts[8]).value();
    data.puts.finiNetTradeValue = numeral(finiPuts[9]).value();
    data.puts.finiLongOiVolume = numeral(finiPuts[10]).value();
    data.puts.finiLongOiValue = numeral(finiPuts[11]).value();
    data.puts.finiShortOiVolume = numeral(finiPuts[12]).value();
    data.puts.finiShortOiValue = numeral(finiPuts[13]).value();
    data.puts.finiNetOiVolume = numeral(finiPuts[14]).value();
    data.puts.finiNetOiValue = numeral(finiPuts[15]).value();
    data.puts.sitcLongTradeVolume = numeral(sitcPuts[4]).value();
    data.puts.sitcLongTradeValue = numeral(sitcPuts[5]).value();
    data.puts.sitcShortTradeVolume = numeral(sitcPuts[6]).value();
    data.puts.sitcShortTradeValue = numeral(sitcPuts[7]).value();
    data.puts.sitcNetTradeVolume = numeral(sitcPuts[8]).value();
    data.puts.sitcNetTradeValue = numeral(sitcPuts[9]).value();
    data.puts.sitcLongOiVolume = numeral(sitcPuts[10]).value();
    data.puts.sitcLongOiValue = numeral(sitcPuts[11]).value();
    data.puts.sitcShortOiVolume = numeral(sitcPuts[12]).value();
    data.puts.sitcShortOiValue = numeral(sitcPuts[13]).value();
    data.puts.sitcNetOiVolume = numeral(sitcPuts[14]).value();
    data.puts.sitcNetOiValue = numeral(sitcPuts[15]).value();
    data.puts.dealersLongTradeVolume = numeral(dealersPuts[4]).value();
    data.puts.dealersLongTradeValue = numeral(dealersPuts[5]).value();
    data.puts.dealersShortTradeVolume = numeral(dealersPuts[6]).value();
    data.puts.dealersShortTradeValue = numeral(dealersPuts[7]).value();
    data.puts.dealersNetTradeVolume = numeral(dealersPuts[8]).value();
    data.puts.dealersNetTradeValue = numeral(dealersPuts[9]).value();
    data.puts.dealersLongOiVolume = numeral(dealersPuts[10]).value();
    data.puts.dealersLongOiValue = numeral(dealersPuts[11]).value();
    data.puts.dealersShortOiVolume = numeral(dealersPuts[12]).value();
    data.puts.dealersShortOiValue = numeral(dealersPuts[13]).value();
    data.puts.dealersNetOiVolume = numeral(dealersPuts[14]).value();
    data.puts.dealersNetOiValue = numeral(dealersPuts[15]).value();
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

  private async fetchMxfMarketOi(options: { date: string }) {
    const { date } = options;
    const queryDate = DateTime.fromISO(date).toFormat('yyyy/MM/dd');
    const form = new URLSearchParams({
      down_type: '1',
      queryStartDate: queryDate,
      queryEndDate: queryDate,
      commodity_id: 'MTX',
    });
    const url = 'https://www.taifex.com.tw/cht/3/futDataDown';

    const response = await this.httpService.post(url, form, { responseType: 'arraybuffer' });
    const csv = iconv.decode(response.data, 'big5');
    const json = await csvtojson({ noheader: true, output: 'csv' }).fromString(csv);

    const [_, ...rows] = json;
    if (!rows.length) return null;

    const mxfMarketOi = rows
      .filter(row => row[17] === '一般' && !row[18])
      .reduce((oi, row) => oi + numeral(row[11]).value(), 0);

    return { date, mxfMarketOi };
  }

  async fetchMxfRetailPosition(options: { date: string }) {
    const date = options.date;

    const [fetchedMxfMarketOi, fetchedMxfInstTrades] = await Promise.all([
      this.fetchMxfMarketOi({ date }),
      this.fetchMxfInstTrades({ date }),
    ]);
    if (!fetchedMxfMarketOi || !fetchedMxfInstTrades) return null;

    const { mxfMarketOi } = fetchedMxfMarketOi;
    const { finiLongOiVolume, sitcLongOiVolume, dealersLongOiVolume } = fetchedMxfInstTrades;
    const { finiShortOiVolume, sitcShortOiVolume, dealersShortOiVolume } = fetchedMxfInstTrades;
    const mxfInstLongOi = finiLongOiVolume + sitcLongOiVolume + dealersLongOiVolume;
    const mxfInstShortOi = finiShortOiVolume + sitcShortOiVolume + dealersShortOiVolume;

    const data: Record<string, any> = {};
    data.date = date;
    data.mxfRetailLongOi = mxfMarketOi - mxfInstLongOi;
    data.mxfRetailShortOi = mxfMarketOi - mxfInstShortOi;
    data.mxfRetailNetOi = data.mxfRetailLongOi - data.mxfRetailShortOi;
    data.mxfRetailLongShortRatio = Math.round(data.mxfRetailNetOi / mxfMarketOi * 10000) / 10000;
    return data;
  }

  async fetchTxfLargeTradersPosition(options: { date: string }) {
    const date = options.date;
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

    const txRows = rows.filter(row => row[1] === 'TX');

    const data: Record<string, any> = {};
    data.frontMonth = {};
    data.frontMonth.topFiveLongOi = numeral(txRows[2][5]).value();
    data.frontMonth.topFiveShortOi = numeral(txRows[2][6]).value();
    data.frontMonth.topFiveNetOi = data.frontMonth.topFiveLongOi - data.frontMonth.topFiveShortOi;
    data.frontMonth.topTenLongOi = numeral(txRows[2][7]).value();
    data.frontMonth.topTenShortOi = numeral(txRows[2][8]).value();
    data.frontMonth.topTenNetOi = data.frontMonth.topTenLongOi - data.frontMonth.topTenShortOi;
    data.frontMonth.topFiveSpecificLongOi = numeral(txRows[3][5]).value();
    data.frontMonth.topFiveSpecificShortOi = numeral(txRows[3][6]).value();
    data.frontMonth.topFiveSpecificNetOi = data.frontMonth.topFiveSpecificLongOi - data.frontMonth.topFiveSpecificShortOi;
    data.frontMonth.topTenSpecificLongOi = numeral(txRows[3][7]).value();
    data.frontMonth.topTenSpecificShortOi = numeral(txRows[3][8]).value();
    data.frontMonth.topTenSpecificNetOi = data.frontMonth.topTenSpecificLongOi - data.frontMonth.topTenSpecificShortOi;
    data.frontMonth.topFiveNonspecificLongOi = data.frontMonth.topFiveLongOi - data.frontMonth.topFiveSpecificLongOi;
    data.frontMonth.topFiveNonspecificShortOi = data.frontMonth.topFiveShortOi - data.frontMonth.topFiveSpecificShortOi;
    data.frontMonth.topFiveNonspecificNetOi = data.frontMonth.topFiveNetOi - data.frontMonth.topFiveSpecificNetOi;
    data.frontMonth.topTenNonspecificLongOi = data.frontMonth.topTenLongOi - data.frontMonth.topTenSpecificLongOi;
    data.frontMonth.topTenNonspecificShortOi = data.frontMonth.topTenShortOi - data.frontMonth.topTenSpecificShortOi;
    data.frontMonth.topTenNonspecificNetOi = data.frontMonth.topTenNetOi - data.frontMonth.topTenSpecificNetOi;
    data.frontMonth.marketOi = numeral(txRows[3][9]).value();
    data.allMonths = {};
    data.allMonths.topFiveLongOi = numeral(txRows[4][5]).value();
    data.allMonths.topFiveShortOi = numeral(txRows[4][6]).value();
    data.allMonths.topFiveNetOi = data.allMonths.topFiveLongOi - data.allMonths.topFiveShortOi;
    data.allMonths.topTenLongOi = numeral(txRows[4][7]).value();
    data.allMonths.topTenShortOi = numeral(txRows[4][8]).value();
    data.allMonths.topTenNetOi = data.allMonths.topTenLongOi - data.allMonths.topTenShortOi;
    data.allMonths.topFiveSpecificLongOi = numeral(txRows[5][5]).value();
    data.allMonths.topFiveSpecificShortOi = numeral(txRows[5][6]).value();
    data.allMonths.topFiveSpecificNetOi = data.allMonths.topFiveSpecificLongOi - data.allMonths.topFiveSpecificShortOi;
    data.allMonths.topTenSpecificLongOi = numeral(txRows[5][7]).value();
    data.allMonths.topTenSpecificShortOi = numeral(txRows[5][8]).value();
    data.allMonths.topTenSpecificNetOi = data.allMonths.topTenSpecificLongOi - data.allMonths.topTenSpecificShortOi;
    data.allMonths.marketOi = numeral(txRows[5][9]).value();
    data.backMonths = {};
    data.backMonths.topFiveLongOi = data.allMonths.topFiveLongOi - data.frontMonth.topFiveLongOi;
    data.backMonths.topFiveShortOi = data.allMonths.topFiveShortOi - data.frontMonth.topFiveShortOi;
    data.backMonths.topFiveNetOi = data.allMonths.topFiveNetOi - data.frontMonth.topFiveNetOi;
    data.backMonths.topTenLongOi = data.allMonths.topTenLongOi - data.frontMonth.topTenLongOi;
    data.backMonths.topTenShortOi = data.allMonths.topTenShortOi - data.frontMonth.topTenShortOi;
    data.backMonths.topTenNetOi = data.allMonths.topTenNetOi - data.frontMonth.topTenNetOi;
    data.backMonths.topFiveSpecificLongOi = data.allMonths.topFiveSpecificLongOi - data.frontMonth.topFiveSpecificLongOi;
    data.backMonths.topFiveSpecificShortOi = data.allMonths.topFiveSpecificShortOi - data.frontMonth.topFiveSpecificShortOi;
    data.backMonths.topFiveSpecificNetOi = data.allMonths.topFiveSpecificNetOi - data.frontMonth.topFiveSpecificNetOi;
    data.backMonths.topTenSpecificLongOi = data.allMonths.topTenSpecificLongOi - data.frontMonth.topTenSpecificLongOi;
    data.backMonths.topTenSpecificShortOi = data.allMonths.topTenSpecificShortOi - data.frontMonth.topTenSpecificShortOi;
    data.backMonths.topTenSpecificNetOi = data.allMonths.topTenSpecificNetOi - data.frontMonth.topTenSpecificNetOi;
    data.backMonths.marketOi = data.allMonths.marketOi - data.frontMonth.marketOi;
    return data;
  }

  async fetchTxoLargeTradersPosition(options: { date: string }) {
    const date = options.date;
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

    const txoRows = rows.filter(row => row[1] === 'TXO');
    const data: Record<string, any> = {};
    data.calls = {};
    data.calls.frontMonth = {};
    data.calls.frontMonth.topFiveLongOi = numeral(txoRows[2][6]).value();
    data.calls.frontMonth.topFiveShortOi = numeral(txoRows[2][7]).value();
    data.calls.frontMonth.topFiveNetOi = data.calls.frontMonth.topFiveLongOi - data.calls.frontMonth.topFiveShortOi;
    data.calls.frontMonth.topTenLongOi = numeral(txoRows[2][8]).value();
    data.calls.frontMonth.topTenShortOi = numeral(txoRows[2][9]).value();
    data.calls.frontMonth.topTenNetOi = data.calls.frontMonth.topTenLongOi - data.calls.frontMonth.topTenShortOi;
    data.calls.frontMonth.topFiveSpecificLongOi = numeral(txoRows[3][6]).value();
    data.calls.frontMonth.topFiveSpecificShortOi = numeral(txoRows[3][7]).value();
    data.calls.frontMonth.topFiveSpecificNetOi = data.calls.frontMonth.topFiveSpecificLongOi - data.calls.frontMonth.topFiveSpecificShortOi;
    data.calls.frontMonth.topTenSpecificLongOi = numeral(txoRows[3][8]).value();
    data.calls.frontMonth.topTenSpecificShortOi = numeral(txoRows[3][9]).value();
    data.calls.frontMonth.topTenSpecificNetOi = data.calls.frontMonth.topTenSpecificLongOi - data.calls.frontMonth.topTenSpecificShortOi;
    data.calls.frontMonth.topFiveNonspecificLongOi = data.calls.frontMonth.topFiveLongOi - data.calls.frontMonth.topFiveSpecificLongOi;
    data.calls.frontMonth.topFiveNonspecificShortOi = data.calls.frontMonth.topFiveShortOi - data.calls.frontMonth.topFiveSpecificShortOi;
    data.calls.frontMonth.topFiveNonspecificNetOi = data.calls.frontMonth.topFiveNetOi - data.calls.frontMonth.topFiveSpecificNetOi;
    data.calls.frontMonth.topTenNonspecificLongOi = data.calls.frontMonth.topTenLongOi - data.calls.frontMonth.topTenSpecificLongOi;
    data.calls.frontMonth.topTenNonspecificShortOi = data.calls.frontMonth.topTenShortOi - data.calls.frontMonth.topTenSpecificShortOi;
    data.calls.frontMonth.topTenNonspecificNetOi = data.calls.frontMonth.topTenNetOi - data.calls.frontMonth.topTenSpecificNetOi;
    data.calls.frontMonth.marketOi = numeral(txoRows[3][10]).value();
    data.calls.allMonths = {};
    data.calls.allMonths.topFiveLongOi = numeral(txoRows[4][6]).value();
    data.calls.allMonths.topFiveShortOi = numeral(txoRows[4][7]).value();
    data.calls.allMonths.topFiveNetOi = data.calls.allMonths.topFiveLongOi - data.calls.allMonths.topFiveShortOi;
    data.calls.allMonths.topTenLongOi = numeral(txoRows[4][8]).value();
    data.calls.allMonths.topTenShortOi = numeral(txoRows[4][9]).value();
    data.calls.allMonths.topTenNetOi = data.calls.allMonths.topTenLongOi - data.calls.allMonths.topTenShortOi;
    data.calls.allMonths.topFiveSpecificLongOi = numeral(txoRows[5][6]).value();
    data.calls.allMonths.topFiveSpecificShortOi = numeral(txoRows[5][7]).value();
    data.calls.allMonths.topFiveSpecificNetOi = data.calls.allMonths.topFiveSpecificLongOi - data.calls.allMonths.topFiveSpecificShortOi;
    data.calls.allMonths.topTenSpecificLongOi = numeral(txoRows[5][8]).value();
    data.calls.allMonths.topTenSpecificShortOi = numeral(txoRows[5][9]).value();
    data.calls.allMonths.topTenSpecificNetOi = data.calls.allMonths.topTenSpecificLongOi - data.calls.allMonths.topTenSpecificShortOi;
    data.calls.allMonths.marketOi = numeral(txoRows[5][10]).value();
    data.calls.backMonths = {};
    data.calls.backMonths.topFiveLongOi = data.calls.allMonths.topFiveLongOi - data.calls.frontMonth.topFiveLongOi;
    data.calls.backMonths.topFiveShortOi = data.calls.allMonths.topFiveShortOi - data.calls.frontMonth.topFiveShortOi;
    data.calls.backMonths.topFiveNetOi = data.calls.allMonths.topFiveNetOi - data.calls.frontMonth.topFiveNetOi;
    data.calls.backMonths.topTenLongOi = data.calls.allMonths.topTenLongOi - data.calls.frontMonth.topTenLongOi;
    data.calls.backMonths.topTenShortOi = data.calls.allMonths.topTenShortOi - data.calls.frontMonth.topTenShortOi;
    data.calls.backMonths.topTenNetOi = data.calls.allMonths.topTenNetOi - data.calls.frontMonth.topTenNetOi;
    data.calls.backMonths.topFiveSpecificLongOi = data.calls.allMonths.topFiveSpecificLongOi - data.calls.frontMonth.topFiveSpecificLongOi;
    data.calls.backMonths.topFiveSpecificShortOi = data.calls.allMonths.topFiveSpecificShortOi - data.calls.frontMonth.topFiveSpecificShortOi;
    data.calls.backMonths.topFiveSpecificNetOi = data.calls.allMonths.topFiveSpecificNetOi - data.calls.frontMonth.topFiveSpecificNetOi;
    data.calls.backMonths.topTenSpecificLongOi = data.calls.allMonths.topTenSpecificLongOi - data.calls.frontMonth.topTenSpecificLongOi;
    data.calls.backMonths.topTenSpecificShortOi = data.calls.allMonths.topTenSpecificShortOi - data.calls.frontMonth.topTenSpecificShortOi;
    data.calls.backMonths.topTenSpecificNetOi = data.calls.allMonths.topTenSpecificNetOi - data.calls.frontMonth.topTenSpecificNetOi;
    data.calls.backMonths.marketOi = data.calls.allMonths.marketOi - data.calls.frontMonth.marketOi;
    data.puts = {};
    data.puts.frontMonth = {};
    data.puts.frontMonth.topFiveLongOi = numeral(txoRows[6][6]).value();
    data.puts.frontMonth.topFiveShortOi = numeral(txoRows[6][7]).value();
    data.puts.frontMonth.topFiveNetOi = data.puts.frontMonth.topFiveLongOi - data.puts.frontMonth.topFiveShortOi;
    data.puts.frontMonth.topTenLongOi = numeral(txoRows[6][8]).value();
    data.puts.frontMonth.topTenShortOi = numeral(txoRows[6][9]).value();
    data.puts.frontMonth.topTenNetOi = data.puts.frontMonth.topTenLongOi - data.puts.frontMonth.topTenShortOi;
    data.puts.frontMonth.topFiveSpecificLongOi = numeral(txoRows[7][6]).value();
    data.puts.frontMonth.topFiveSpecificShortOi = numeral(txoRows[7][7]).value();
    data.puts.frontMonth.topFiveSpecificNetOi = data.puts.frontMonth.topFiveSpecificLongOi - data.puts.frontMonth.topFiveSpecificShortOi;
    data.puts.frontMonth.topTenSpecificLongOi = numeral(txoRows[7][8]).value();
    data.puts.frontMonth.topTenSpecificShortOi = numeral(txoRows[7][9]).value();
    data.puts.frontMonth.topTenSpecificNetOi = data.puts.frontMonth.topTenSpecificLongOi - data.puts.frontMonth.topTenSpecificShortOi;
    data.puts.frontMonth.topFiveNonspecificLongOi = data.puts.frontMonth.topFiveLongOi - data.puts.frontMonth.topFiveSpecificLongOi;
    data.puts.frontMonth.topFiveNonspecificShortOi = data.puts.frontMonth.topFiveShortOi - data.puts.frontMonth.topFiveSpecificShortOi;
    data.puts.frontMonth.topFiveNonspecificNetOi = data.puts.frontMonth.topFiveNetOi - data.puts.frontMonth.topFiveSpecificNetOi;
    data.puts.frontMonth.topTenNonspecificLongOi = data.puts.frontMonth.topTenLongOi - data.puts.frontMonth.topTenSpecificLongOi;
    data.puts.frontMonth.topTenNonspecificShortOi = data.puts.frontMonth.topTenShortOi - data.puts.frontMonth.topTenSpecificShortOi;
    data.puts.frontMonth.topTenNonspecificNetOi = data.puts.frontMonth.topTenNetOi - data.puts.frontMonth.topTenSpecificNetOi;
    data.puts.frontMonth.marketOi = numeral(txoRows[7][10]).value();
    data.puts.allMonths = {};
    data.puts.allMonths.topFiveLongOi = numeral(txoRows[8][6]).value();
    data.puts.allMonths.topFiveShortOi = numeral(txoRows[8][7]).value();
    data.puts.allMonths.topFiveNetOi = data.puts.allMonths.topFiveLongOi - data.puts.allMonths.topFiveShortOi;
    data.puts.allMonths.topTenLongOi = numeral(txoRows[8][8]).value();
    data.puts.allMonths.topTenShortOi = numeral(txoRows[8][9]).value();
    data.puts.allMonths.topTenNetOi = data.puts.allMonths.topTenLongOi - data.puts.allMonths.topTenShortOi;
    data.puts.allMonths.topFiveSpecificLongOi = numeral(txoRows[9][6]).value();
    data.puts.allMonths.topFiveSpecificShortOi = numeral(txoRows[9][7]).value();
    data.puts.allMonths.topFiveSpecificNetOi = data.puts.allMonths.topFiveSpecificLongOi - data.puts.allMonths.topFiveSpecificShortOi;
    data.puts.allMonths.topTenSpecificLongOi = numeral(txoRows[9][8]).value();
    data.puts.allMonths.topTenSpecificShortOi = numeral(txoRows[9][9]).value();
    data.puts.allMonths.topTenSpecificNetOi = data.puts.allMonths.topTenSpecificLongOi - data.puts.allMonths.topTenSpecificShortOi;
    data.puts.allMonths.marketOi = numeral(txoRows[9][10]).value();
    data.puts.backMonths = {};
    data.puts.backMonths.topFiveLongOi = data.puts.allMonths.topFiveLongOi - data.puts.frontMonth.topFiveLongOi;
    data.puts.backMonths.topFiveShortOi = data.puts.allMonths.topFiveShortOi - data.puts.frontMonth.topFiveShortOi;
    data.puts.backMonths.topFiveNetOi = data.puts.allMonths.topFiveNetOi - data.puts.frontMonth.topFiveNetOi;
    data.puts.backMonths.topTenLongOi = data.puts.allMonths.topTenLongOi - data.puts.frontMonth.topTenLongOi;
    data.puts.backMonths.topTenShortOi = data.puts.allMonths.topTenShortOi - data.puts.frontMonth.topTenShortOi;
    data.puts.backMonths.topTenNetOi = data.puts.allMonths.topTenNetOi - data.puts.frontMonth.topTenNetOi;
    data.puts.backMonths.topFiveSpecificLongOi = data.puts.allMonths.topFiveSpecificLongOi - data.puts.frontMonth.topFiveSpecificLongOi;
    data.puts.backMonths.topFiveSpecificShortOi = data.puts.allMonths.topFiveSpecificShortOi - data.puts.frontMonth.topFiveSpecificShortOi;
    data.puts.backMonths.topFiveSpecificNetOi = data.puts.allMonths.topFiveSpecificNetOi - data.puts.frontMonth.topFiveSpecificNetOi;
    data.puts.backMonths.topTenSpecificLongOi = data.puts.allMonths.topTenSpecificLongOi - data.puts.frontMonth.topTenSpecificLongOi;
    data.puts.backMonths.topTenSpecificShortOi = data.puts.allMonths.topTenSpecificShortOi - data.puts.frontMonth.topTenSpecificShortOi;
    data.puts.backMonths.topTenSpecificNetOi = data.puts.allMonths.topTenSpecificNetOi - data.puts.frontMonth.topTenSpecificNetOi;
    data.puts.backMonths.marketOi = data.puts.allMonths.marketOi - data.puts.frontMonth.marketOi;
    return data;
  }
}
