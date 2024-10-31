export interface StockHistorical {
  date: string;
  exchange: string;
  symbol: string;
  name: string;
  open: number;
  high: number;
  low: number;
  close: number;
  volume: number;
  turnover: number;
  transaction: number;
  change: number;
}
