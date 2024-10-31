export interface StockInstitutional {
  date: string;
  symbol: string;
  exchange: string;
  name: string;
  institutional: Array<{
    investor: string;
    totalBuy: number;
    totalSell: number;
    difference: number;
  }>;
}
