export interface FutOptHistorical {
  date: string;
  exchange: string;
  symbol: string;
  contractMonth: string;
  strikePrice: number;
  type: string;
  open: number;
  high: number;
  low: number;
  close: number;
  change: number;
  changePercent: number;
  volume: number;
  settlementPrice: number;
  openInterest: number;
  bestBid: number;
  bestAsk: number;
  historicalHigh: number;
  historicalLow: number;
  session: string;
  volumeSpread: number;
}
