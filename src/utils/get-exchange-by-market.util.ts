import { Exchange, Market } from '../enums';

export function getExchangeByMarket(market: Market): Exchange {
  const exchanges: Record<string, Exchange> = {
    [Market.TSE]: Exchange.TWSE,
    [Market.OTC]: Exchange.TPEx,
  };
  return exchanges[market] ?? Exchange.None;
}
