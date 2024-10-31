export interface StockCapitalReductions {
  resumeDate: string;
  exchange: string;
  symbol: string;
  name: string;
  previousClose: number;
  referencePrice: number;
  limitUpPrice: number;
  limitDownPrice: number;
  openingReferencePrice: number;
  exrightReferencePrice: number;
  reason: string;
  haltDate: string;
  sharesPerThousand: number;
  refundPerShare: number;
}
