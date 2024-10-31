export interface Ticker {
  symbol: string;
  name: string;
  exchange: string;
  market?: string;
  type?: string;
  industry?: string;
  listedDate?: string;
  ex_ch?: string;
}
