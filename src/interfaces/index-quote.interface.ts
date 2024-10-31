export interface IndexQuote {
  date: string;
  exchange: string;
  symbol: string;
  name: string;
  previousClose: number;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  lastUpdated: number;
}
