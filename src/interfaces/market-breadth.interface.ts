export interface MarketBreadth {
  date: string;
  exchange: string;
  up: number;
  limitUp: number;
  down: number;
  limitDown: number;
  unchanged: number;
  unmatched: number;
  notApplicable: number;
}
