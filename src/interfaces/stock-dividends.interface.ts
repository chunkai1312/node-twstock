export interface StockDividends {
  date: string;
  exchange: string;
  symbol: string;
  name: string;
  previousClose: number;
  referencePrice: number;
  dividend: number;
  dividendType: string;
  limitUpPrice: number;
  limitDownPrice: number;
  openingReferencePrice: number;
  exdividendReferencePrice: number;
  cashDividend: number;
  stockDividendShares: number;
}
