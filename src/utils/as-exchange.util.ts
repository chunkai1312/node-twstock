import { Exchange, Market } from '../enums';

export function asExchange(market: string) {
  const exchanges: Record<string, Exchange> = {
    [Market.TSE]: Exchange.TWSE,
    [Market.OTC]: Exchange.TPEx,
    '上市': Exchange.TWSE,
    '上櫃': Exchange.TPEx,
  };
  return exchanges[market];
}
