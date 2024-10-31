export interface StockFiniHoldings {
  date: string;
  exchange: string;
  symbol: string;
  name: string;
  issuedShares: number;
  availableShares: number;
  sharesHeld: number;
  availablePercent: number;
  heldPercent: number;
  upperLimitPercent: number;
}
