import { Exchange, Industry, Market } from '../enums';

export interface Ticker {
  symbol: string;
  exchange: Exchange;
  market: Market;
  industry?: Industry;
  listedDate?: string;
  ex_ch?: string;
}
