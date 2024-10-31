export interface FutOptLargeTraders {
  date: string;
  exchange: string;
  symbol: string;
  name: string;
  largeTraders: Array<{
    type: string;
    contractMonth: string;
    traderType: string;
    topFiveLongOi: number;
    topFiveShortOi: number;
    topTenLongOi: number;
    topTenShortOi: number;
    marketOi: number;
  }>;
}
