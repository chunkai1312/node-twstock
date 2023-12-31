import { Exchange, Industry, Market } from '../enums';

export interface Ticker {
  symbol: string;
  name: string;
  exchange: Exchange;
  market: Market;
  type?: string;
  industry?: Industry;
  listedDate?: string;
  ex_ch?: string;
}
