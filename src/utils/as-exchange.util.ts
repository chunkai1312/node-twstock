import { Exchange, Market } from '../enums';

export function asExchange(market: string) {
  const exchanges: Record<string, Exchange> = {
    [Market.TSE]: Exchange.TWSE,
    [Market.OTC]: Exchange.TPEx,
    '上市': Exchange.TWSE,
    '上櫃': Exchange.TPEx,
    '期貨及選擇權': Exchange.TAIFEX,
  };
  return exchanges[market];
}
