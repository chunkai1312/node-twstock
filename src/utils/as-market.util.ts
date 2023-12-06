import { Market } from '../enums';

export function asMarket(market: string) {
  const markets: Record<string, Market> = {
    '上市': Market.TSE,
    '上櫃': Market.OTC,
  };
  return markets[market];
}
