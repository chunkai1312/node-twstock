import { Scraper } from './scraper';

export class MisScraper extends Scraper {
  async fetchListedIndices(options: { market: 'TSE' | 'OTC' }) {
    const market = options?.market ?? 'TSE';
    const i = { 'TSE': 'TIDX', 'OTC': 'OIDX' };
    const query = new URLSearchParams({
      ex: market.toLowerCase(),
      i: i[market],
    });
    const url = `http://mis.twse.com.tw/stock/api/getCategory.jsp?${query}`;

    const response = await this.httpService.get(url);
    const json = (response.data.rtmessage === 'OK') && response.data;
    if (!json) return null;

    return json.msgArray.map((row: any) => ({
      name: row.n,
      ex_ch: `${row.ex}_${row.ch}`,
    }));
  }
}
