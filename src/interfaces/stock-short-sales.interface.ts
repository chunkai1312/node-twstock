export interface StockShortSales {
  date: string;
  exchange: string;
  symbol: string;
  name: string;
  marginShortBalancePrev: number;
  marginShortSell: number;
  marginShortBuy: number;
  marginShortRedeem: number;
  marginShortBalance: number;
  marginShortQuota: number;
  sblShortBalancePrev: number;
  sblShortSale: number;
  sblShortReturn: number;
  sblShortAdjustment: number;
  sblShortBalance: number;
  sblShortQuota: number;
  note: string;
}
