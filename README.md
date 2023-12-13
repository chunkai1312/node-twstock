# node-twstock

[![NPM version][npm-image]][npm-url]
[![Build Status][action-image]][action-url]
[![Coverage Status][codecov-image]][codecov-url]

> A client library for scraping real-time quotes and historical data from the Taiwan stock market, provided by [Taiwan Stock Exchange](https://www.twse.com.tw) and [Taipei Exchange](https://www.tpex.org.tw).

## Installation

```sh
$ npm install --save node-twstock
```

## Usage

```js
const { TwStock } = require('node-twstock');

const twstock = new TwStock();
```

## Stocks

### `stocks.list(params)`

Get a list of listed stocks.

- `params`: Optional parameters
  - `market`: Filter stocks by market ('TSE' or 'OTC')
- Returns: Promise that resolves to an array of `Ticker` objects.

```js
const stocksList = await twstock.stocks.list({ market: 'TSE' });
console.log(stocksList);
// Prints:
// [
//   {
//     symbol: '0050',
//     name: '元大台灣50',
//     exchange: 'TWSE',
//     market: 'TSE',
//     industry: '00',
//     listedDate: '2003-06-30'
//   },
//   ... more items
// ]
```

### `stocks.quote(params)`

Get real-time quote for a specific stock.

- `params`:
  - `symbol`: Stock symbol
  - `odd` (optional): Intraday odd lot trading

```js
const stockQuote = await twstock.stocks.quote({ symbol: '2330' });
console.log(stockQuote);
// Prints:
// {
//   date: '2023-12-08',
//   symbol: '2330',
//   name: '台積電',
//   referencePrice: 566,
//   limitUpPrice: 622,
//   limitDownPrice: 510,
//   openPrice: 574,
//   highPrice: 577,
//   lowPrice: 570,
//   lastPrice: 570,
//   lastSize: 4395,
//   totalVoluem: 33424,
//   bidPrice: [ 570, 569, 568, 567, 566 ],
//   askPrice: [ 571, 572, 573, 574, 575 ],
//   bidSize: [ 656, 859, 735, 546, 715 ],
//   askSize: [ 332, 156, 427, 596, 707 ],
//   lastUpdated: 1702013400000
// }
```

- Returns: Promise that resolves to the real-time quote.

### `stocks.historical(params)`

Get historical data for a specific stock on a given date.

- `params`:
  - `date`: Date in the format 'YYYY-MM-DD'
  - `market` (optional): Filter stocks by market ('TSE' or 'OTC')
  - `symbol` (optional): Stock symbol
- Returns: Promise that resolves to the historical data.

```js
const stockHistorical = await twstock.stocks.historical({ date: '2023-01-30', symbol: '2330' });
console.log(stockHistorical);
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
//   market: 'TSE',
//   symbol: '2330',
//   name: '台積電',
//   open: 542,
//   high: 543,
//   low: 534,
//   close: 543,
//   volume: 148413161,
//   turnover: 80057158264,
//   transaction: 153125,
//   change: 40
// }
```

### `stocks.instTrades(params)`

Get institutional investors' trades for a specific stock on a given date.

- `params`:
  - `date`: Date in the format 'YYYY-MM-DD'
  - `market` (optional): Filter stocks by market ('TSE' or 'OTC')
  - `symbol` (optional): Stock symbol
- Returns: Promise that resolves to the institutional investors' trades.

```js
const stockInstTrades = await twstock.stocks.instTrades({ date: '2023-01-30', symbol: '2330' });
console.log(stockInstTrades);
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
//   market: 'TSE',
//   symbol: '2330',
//   name: '台積電',
//   finiWithoutDealersBuy: 133236588,
//   finiWithoutDealersSell: 52595539,
//   finiWithoutDealersNetBuySell: 80641049,
//   finiDealersBuy: 0,
//   finiDealersSell: 0,
//   finiDealersNetBuySell: 0,
//   finiBuy: 133236588,
//   finiSell: 52595539,
//   finiNetBuySell: 80641049,
//   sitcBuy: 1032000,
//   sitcSell: 94327,
//   sitcNetBuySell: 937673,
//   dealersForProprietaryBuy: 978000,
//   dealersForProprietarySell: 537000,
//   dealersForProprietaryNetBuySell: 441000,
//   dealersForHedgingBuy: 1227511,
//   dealersForHedgingSell: 788103,
//   dealersForHedgingNetBuySell: 439408,
//   dealersBuy: 2205511,
//   dealersSell: 1325103,
//   dealersNetBuySell: 880408,
//   totalInstInvestorsBuy: 136474099,
//   totalInstInvestorsSell: 54014969,
//   totalInstInvestorsNetBuySell: 82459130
// }
```

### `stocks.marginTrades(params)`

Get margin trades for a specific stock on a given date.

- `params`:
  - `date`: Date in the format 'YYYY-MM-DD'
  - `market` (optional): Filter stocks by market ('TSE' or 'OTC')
  - `symbol` (optional): Stock symbol
- Returns: Promise that resolves to the margin trades.

```js
const stockMarginTrades = await twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '2330' });
console.log(stockMarginTrades);
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
//   market: 'TSE',
//   symbol: '2330',
//   name: '台積電',
//   marginBuy: 1209,
//   marginSell: 2295,
//   marginRedeem: 74,
//   marginBalancePrev: 20547,
//   marginBalance: 19387,
//   marginQuota: 6482595,
//   shortBuy: 56,
//   shortSell: 284,
//   shortRedeem: 101,
//   shortBalancePrev: 1506,
//   shortBalance: 1633,
//   shortQuota: 6482595,
//   offset: 7,
//   note: ''
// }
```

### `stocks.values(params)`

Get values for a specific stock on a given date.

- `params`:
  - `date`: Date in the format 'YYYY-MM-DD'
  - `market` (optional): Filter stocks by market ('TSE' or 'OTC')
  - `symbol` (optional): Stock symbol
- Returns: Promise that resolves to the values.

```js
const stockValues = await twstock.stocks.values({ date: '2023-01-30', symbol: '2330' });
console.log(stockValues);
// Prints:
// {
  // date: '2023-01-30',
  // exchange: 'TWSE',
  // market: 'TSE',
  // symbol: '2330',
  // name: '台積電',
  // peRatio: 15.88,
  // pbRatio: 5.14,
  // dividendYield: 2.03,
  // dividendYear: 2021
// }
```

## Indices

### `indices.list(params)`

Get a list of listed indices.

- `params`: Optional parameters
  - `market`: Filter indices by market ('TSE' or 'OTC')
- Returns: Promise that resolves to an array of `Ticker` objects.

```js
const indicesList = await twstock.indices.list({ market: 'TSE' });
console.log(indicesList);
// Prints:
// [
//   {
//     symbol: 'IX0001',
//     name: '發行量加權股價指數',
//     exchange: 'TWSE',
//     market: 'TSE',
//     alias: 't00'
//   },
//   ... more items
// ]
```

### `indices.quote(params)`

Get real-time quote for a specific index.

- `params`:
  - `symbol`: Index symbol
- Returns: Promise that resolves to the real-time quote.

```js
const indexQuote = await twstock.indices.quote({ symbol: 'IX0001' });
console.log(indexQuote);
// Prints:
// {
//   date: '2023-12-08',
//   symbol: 'IX0001',
//   name: '發行量加權股價指數',
//   previousClose: 17278.74,
//   open: 17309.36,
//   high: 17465.35,
//   low: 17309.36,
//   close: 17383.99,
//   volume: 306114,
//   lastUpdated: 1702013580000
// }
```

### `indices.historical(params)`

Get historical data for a specific index on a given date.

- `params`:
  - `date`: Date in the format 'YYYY-MM-DD'
  - `market` (optional): Filter indices by market ('TSE' or 'OTC')
  - `symbol` (optional): Index symbol
- Returns: Promise that resolves to the historical data.

```js
const indexHistorical = await twstock.indices.historical({ date: '2023-01-30', symbol: 'IX0001' });
console.log(indexHistorical);
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
//   market: 'TSE',
//   symbol: 'IX0001',
//   name: '發行量加權股價指數',
//   open: 15291.53,
//   high: 15493.82,
//   low: 15291.53,
//   close: 15493.82,
//   change: 560.89
// }
```

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/node-twstock.svg
[npm-url]: https://npmjs.com/package/node-twstock
[action-image]: https://img.shields.io/github/actions/workflow/status/chunkai1312/node-twstock/node.js.yml?branch=main
[action-url]: https://github.com/chunkai1312/node-twstock/actions/workflows/node.js.yml
[codecov-image]: https://img.shields.io/codecov/c/github/chunkai1312/node-twstock.svg
[codecov-url]: https://codecov.io/gh/chunkai1312/node-twstock
