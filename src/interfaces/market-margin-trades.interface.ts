export interface MarketMarginTrades {
  date: string;
  exchange: string;
  marginBuy: number;
  marginSell: number;
  marginRedeem: number;
  marginBalancePrev: number;
  marginBalance: number;
  shortBuy: number;
  shortSell: number;
  shortRedeem: number;
  shortBalancePrev: number;
  shortBalance: number;
  marginBuyValue: number;
  marginSellValue: number;
  marginRedeemValue: number;
  marginBalancePrevValue: number;
  marginBalanceValue: number;
}
