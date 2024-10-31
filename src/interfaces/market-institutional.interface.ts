export interface MarketInstitutional {
  date: string;
  exchange: string;
  institutional: Array<{
    investor: string;
    totalBuy: number;
    totalSell: number;
    difference: number;
  }>;
}
