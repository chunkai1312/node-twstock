export interface StockMarginTrades {
  date: string;
  exchange: string;
  symbol: string;
  name: string;
  marginBuy: number;
  marginSell: number;
  marginRedeem: number;
  marginBalancePrev: number;
  marginBalance: number;
  marginQuota: number;
  shortBuy: number;
  shortSell: number;
  shortRedeem: number;
  shortBalancePrev: number;
  shortBalance: number;
  shortQuota: number;
  offset: number;
  note: string;
}
