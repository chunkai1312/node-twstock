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
}
