export interface StockShareholders {
  date: string;
  symbol: string;
  name: string;
  shareholders: Array<{
    level: number;
    holders: number;
    shares: number;
    proportion: number;
  }>;
}
