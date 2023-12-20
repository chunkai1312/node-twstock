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
}
