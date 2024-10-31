export interface StockQuote {
  date: string;
  symbol: string;
  name: string;
  referencePrice: number;
  limitUpPrice: number;
  limitDownPrice: number;
  openPrice: number;
  highPrice: number;
  lowPrice: number;
  lastPrice: number;
  lastSize: number;
  totalVoluem: number;
  bidPrice: number[];
  askPrice: number[];
  bidSize: number[];
  askSize: number[];
  lastUpdated: number;
}
