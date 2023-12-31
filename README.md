# node-twstock

[![NPM version][npm-image]][npm-url]
[![Build Status][action-image]][action-url]
[![Coverage Status][codecov-image]][codecov-url]

> A client library for scraping Taiwan stock market data

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  * [new TwStock([options])](#new-twstockoptions)
  * [.stocks.list([options])](#stockslistoptions)
  * [.stocks.quote(options)](#stocksquoteoptions)
  * [.stocks.historical(options)](#stockshistoricaloptions)
  * [.stocks.instTrades(options)](#stocksinsttradesoptions)
  * [.stocks.finiHoldings(options)](#stocksfiniholdingsoptions)
  * [.stocks.marginTrades(options)](#stocksmargintradesoptions)
  * [.stocks.shortSales(options)](#stocksshortsalesoptions)
  * [.stocks.values(options)](#stocksvaluesoptions)
  * [.stocks.holders(options)](#stocksholdersoptions)
  * [.stocks.eps(options)](#stocksepsoptions)
  * [.stocks.revenue(options)](#stocksrevenueoptions)
  * [.indices.list([options])](#indiceslistoptions)
  * [.indices.quote(options)](#indicesquoteoptions)
  * [.indices.historical(options)](#indiceshistoricaloptions)
  * [.indices.trades(options)](#indicestradesoptions)
  * [.market.trades(options)](#markettradesoptions)
  * [.market.breadth(options)](#marketbreadthoptions)
  * [.market.instTrades(options)](#marketinsttradesoptions)
  * [.market.marginTrades(options)](#marketmargintradesoptions)
  * [.futopt.txfInstTrades(options)](#futopttxfinsttradesoptions)
  * [.futopt.txoInstTrades(options)](#futopttxoinsttradesoptions)
  * [.futopt.txoPutCallRatio(options)](#futopttxoputcallratiooptions)
  * [.futopt.mxfRetailPosition(options)](#futoptmxfretailpositionoptions)
  * [.futopt.txfLargeTradersPosition(options)](#futopttxflargetraderspositionoptions)
  * [.futopt.txoLargeTradersPosition(options)](#futopttxolargetraderspositionoptions)
  * [.futopt.exchangeRates(options)](#futoptexchangeratesoptions)
* [Data Sources](#data-sources)
* [Changelog](#changelog)
* [License](#license)

## Installation

```sh
$ npm install --save node-twstock
```

## Usage

```js
const { TwStock } = require('node-twstock');
```

## API

### `new TwStock([options])`

建立 `TwStock` 實例，用於取得台灣股票市場資料。

* `options`: {Object} 可配置選項，用於設定速率限制 (Rate Limiting)
  - `ttl`: 每個請求持續的毫秒數。**Default:** `5000`
  - `limit`: 在 TTL 限制內的最大請求數。**Default:** `3`

> 請注意，過於頻繁的請求可能導致被交易所禁止訪問。預設設定為每 5 秒最多發送 3 個請求。

```js
const twstock = new TwStock({ ttl: 5000, limit: 3  });
```

### `.stocks.list([options])`

取得上市櫃股票列表。

* `options`: {Object}
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
  * `industry`: {string} 產業別
  * `listedDate`: {string} 上市日期

```js
twstock.stocks.list({ market: 'TSE' })
  .then(data => console.log(data));
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

### `.stocks.quote(options)`

取得股票即時行情。

* `options`: {Object}
  * `symbol`: {string} 股票代號
  * `odd` (optional): {boolean} 盤中零股交易
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `referencePrice`: {number} 參考價
  * `limitUpPrice`: {number} 漲停價
  * `limitDownPrice`: {number} 跌停價
  * `openPrice`: {number} 開盤價
  * `highPrice`: {number} 最高價
  * `lowPrice`: {number} 最低價
  * `lastPrice`: {number} 最後成交價格
  * `lastSize`: {number} 最後成交數量
  * `totalVoluem`: {number} 總成交量
  * `bidPrice`: {number[]} 最佳委託買進價格
  * `askPrice`: {number[]} 最佳委託賣出價格
  * `bidSize`: {number[]} 最佳委託買進數量
  * `askSize`: {number[]} 最佳委託賣出數量
  * `lastUpdated`: {number} 最後更新時間

```js
twstock.stocks.quote({ symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-12-29',
//   symbol: '2330',
//   name: '台積電',
//   referencePrice: 593,
//   limitUpPrice: 652,
//   limitDownPrice: 534,
//   openPrice: 589,
//   highPrice: 593,
//   lowPrice: 589,
//   lastPrice: 593,
//   lastSize: 4174,
//   totalVoluem: 18323,
//   bidPrice: [ 592, 591, 590, 589, 588 ],
//   askPrice: [ 593, 594, 595, 596, 597 ],
//   bidSize: [ 827, 768, 1137, 554, 446 ],
//   askSize: [ 1938, 1465, 2925, 2407, 921 ],
//   lastUpdated: 1703831400000
// }
```

### `.stocks.historical(options)`

取得股票在特定日期的收盤行情。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `open`: {number} 開盤價
  * `high`: {number} 最高價
  * `low`: {number} 最低價
  * `close`: {number} 收盤價
  * `volume`: {number} 成交股數
  * `turnover`: {number} 成交金額
  * `transaction`: {number} 成交筆數
  * `change`: {number} 漲跌

```js
twstock.stocks.historical({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
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

### `.stocks.instTrades(options)`

取得股票在特定日期的三大法人買賣超。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `finiWithoutDealersBuy`: {number} 外資及陸資(不含外資自營商)買進金額
  * `finiWithoutDealersSell`: {number} 外資及陸資(不含外資自營商)賣出金額
  * `finiWithoutDealersNetBuySell`: {number} 外資及陸資(不含外資自營商)買賣差額
  * `finiDealersBuy`: {number} 外資自營商買進金額
  * `finiDealersSell`: {number} 外資自營商賣出金額
  * `finiDealersNetBuySell`: {number} 外資自營商買賣差額
  * `finiBuy`: {number} 外資買進金額
  * `finiSell`: {number} 外資賣出金額
  * `finiNetBuySell`: {number} 外資買賣差額
  * `sitcBuy`: {number} 投信買進金額
  * `sitcSell`: {number} 投信賣出金額
  * `sitcNetBuySell`: {number} 投信買賣差額
  * `dealersForProprietaryBuy`: {number} 自營商(自行買賣)買進金額
  * `dealersForProprietarySell`: {number} 自營商(自行買賣)賣出金額
  * `dealersForProprietaryNetBuySell`: {number} 自營商(自行買賣)買賣差額
  * `dealersForHedgingBuy`: {number} 自營商(避險)買進金額
  * `dealersForHedgingSell`: {number} 自營商(避險)賣出金額
  * `dealersForHedgingNetBuySell`: {number} 自營商(避險)買賣差額
  * `dealersBuy`: {number} 自營商買進金額
  * `dealersSell`: {number} 自營商賣出金額
  * `dealersNetBuySell`: {number} 自營商買賣差額
  * `totalInstInvestorsBuy`: {number} 三大法人合計買進金額
  * `totalInstInvestorsSell`: {number} 三大法人合計賣出金額
  * `totalInstInvestorsNetBuySell`: {number} 三大法人合計買賣差額

```js
twstock.stocks.instTrades({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
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

### `.stocks.finiHoldings(options)`

取得股票在特定日期的外資持股比例。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `issuedShares`: {number} 發行股數
  * `availableShares`: {number} 外資及陸資尚可投資股數
  * `sharesHeld`: {number} 全體外資及陸資持有股數
  * `availablePercent`: {number} 外資及陸資尚可投資比率
  * `heldPercent`: {number} 全體外資及陸資持股比率
  * `upperLimitPercent`: {number} 外資及陸資共用法令投資上限比率

```js
twstock.stocks.finiHoldings({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   symbol: '2330',
//   name: '台積電',
//   issuedShares: 25930380458,
//   availableShares: 7329280055,
//   sharesHeld: 18601100403,
//   availablePercent: 28.26,
//   heldPercent: 71.73,
//   upperLimitPercent: 100
// }
```

### `.stocks.marginTrades(options)`

取得股票在特定日期的融資融券餘額。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `marginBuy`: {number} 融資買進
  * `marginSell`: {number} 融資賣出
  * `marginRedeem`: {number} 現金償還
  * `marginBalancePrev`: {number} 前日融資餘額
  * `marginBalance`: {number} 今日融資餘額
  * `marginQuota`: {number} 融資限額
  * `shortBuy`: {number} 融券買進
  * `shortSell`: {number} 融券賣出
  * `shortRedeem`: {number} 現券償還
  * `shortBalancePrev`: {number} 前日融券餘額
  * `shortBalance`: {number} 今日融券餘額
  * `shortQuota`: {number} 融券限額
  * `offset`: {number} 資券互抵
  * `note`: {string} 註記

```js
twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
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

### `.stocks.shortSales(options)`

取得股票在特定日期的融券借券賣出餘額。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `marginShortBalancePrev`: {number} 融券前日餘額
  * `marginShortSell`: {number} 融券賣出
  * `marginShortBuy`: {number} 融券買進
  * `marginShortRedeem`: {number} 現券償還
  * `marginShortBalance`: {number} 融券當日餘額
  * `marginShortQuota`: {number} 融資限額
  * `sblShortBalancePrev`: {number} 借券賣出前日餘額
  * `sblShortSale`: {number} 借券賣出當日賣出
  * `sblShortReturn`: {number} 借券賣出當日還券
  * `sblShortAdjustment`: {number} 借券賣出當日調整
  * `sblShortBalance`: {number} 借券賣出當日餘額
  * `sblShortQuota`: {number} 次一營業日可借券賣出限額
  * `note`: {string} 備註

```js
twstock.stocks.shortSales({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   symbol: '2330',
//   name: '台積電',
//   marginShortBalancePrev: 1506000,
//   marginShortSell: 284000,
//   marginShortBuy: 56000,
//   marginShortRedeem: 101000,
//   marginShortBalance: 1633000,
//   marginShortQuota: 6482595114,
//   sblShortBalancePrev: 30846988,
//   sblShortSale: 286000,
//   sblShortReturn: 742000,
//   sblShortAdjustment: 0,
//   sblShortBalance: 30390988,
//   sblShortQuota: 3399967,
//   note: ''
// }
```

### `.stocks.values(options)`

取得股票在特定日期的本益比、殖利率及股價淨值比。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `peRatio`: {number} 本益比
  * `pbRatio`: {number} 股價淨值比
  * `dividendYield`: {number} 殖利率
  * `dividendYear`: {number} 股利年度

```js
twstock.stocks.values({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
  // date: '2023-01-30',
  // symbol: '2330',
  // name: '台積電',
  // peRatio: 15.88,
  // pbRatio: 5.14,
  // dividendYield: 2.03,
  // dividendYear: 2021
// }
```

### `.stocks.holders(options)`

取得股票在特定日期的集保分佈。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `symbol`: {string} 股票代號
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `data`: {Object[]} 集保分佈資料，包含以下物件屬性：
    * `level`: {string} 持股分級
    * `holders`: {number} 持股人數
    * `shares`: {number} 持股股數
    * `proportion`: {number} 持股比例

```js
twstock.stocks.holders({ date: '2023-12-29', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-12-29',
//   symbol: '2330',
//   name: '台積電',
//   data: [
//     {
//       level: '1-999',
//       holders: 731332,
//       shares: 136341404,
//       proportion: 0.52
//     },
//     ... more items
//   ]
// }
```

### `.stocks.eps(options)`

取得上市櫃股票在特定年度季度每股盈餘。

* `options`: {Object}
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
  * `year`: {number} 年度
  * `quarter`: {number} 季度
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `eps`: {number} 每股盈餘
  * `year`: {number} 年度
  * `quarter`: {number} 季度

```js
twstock.stocks.eps({ symbol: '2330', year: 2023, quarter: 1 })
  .then(data => console.log(data));
// Prints:
// {
//   symbol: '2330',
//   name: '台積電',
//   eps: 7.98,
//   year: 2023,
//   quarter: 1
// }
```

### `.stocks.revenue(options)`

取得上市櫃股票在特定年度月份營業收入。

* `options`: {Object}
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
  * `year`: {number} 年度
  * `month`: {number} 月份
  * `foreign` (optional): {boolean} 外國公司股票
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `revenue`: {number} 營業收入
  * `year`: {number} 年度
  * `month`: {number} 月份

```js
twstock.stocks.revenue({ symbol: '2330', year: 2023, month: 1 })
  .then(data => console.log(data));
// Prints:
// {
//   symbol: '2330',
//   name: '台積電',
//   revenue: 200050544,
//   year: 2023,
//   month: 1
// }
```

### `.indices.list([options])`

取得上市櫃指數列表。

* `options`: {Object}
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `symbol`: {string} 指數代號
  * `name`: {string} 指數名稱
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別

```js
twstock.indices.list({ market: 'TSE' })
  .then(data => console.log(data));
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

### `.indices.quote(options)`

取得指數即時行情。

* `options`: {Object}
  * `symbol`: {string} 指數代號
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 指數代號
  * `name`: {string} 指數名稱
  * `open`: {number} 開盤價
  * `high`: {number} 最高價
  * `low`: {number} 最低價
  * `close`: {number} 收盤價
  * `volume`: {number} 成交金額(千元)
  * `lastUpdated`: {number} 最後更新時間

```js
twstock.indices.quote({ symbol: 'IX0001' })
  .then(data => console.log(data));
// Prints:
// {
  // date: '2023-12-29',
  // symbol: 'IX0001',
  // name: '發行量加權股價指數',
  // previousClose: 17910.37,
  // open: 17893.63,
  // high: 17945.7,
  // low: 17864.23,
  // close: 17930.81,
  // volume: 267204,
  // lastUpdated: 1703827980000,
// }
```

### `.indices.historical(options)`

取得指數在特定日期的收盤行情。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 指數代號
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 指數代號
  * `name`: {string} 指數名稱
  * `open`: {number} 開盤價
  * `high`: {number} 最高價
  * `low`: {number} 最低價
  * `close`: {number} 收盤價
  * `change`: {number} 漲跌

```js
twstock.indices.historical({ date: '2023-01-30', symbol: 'IX0001' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   symbol: 'IX0001',
//   name: '發行量加權股價指數',
//   open: 15291.53,
//   high: 15493.82,
//   low: 15291.53,
//   close: 15493.82,
//   change: 560.89
// }
```

### `.indices.trades(options)`

取得指數在特定日期的成交量值。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 指數代號
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 指數代號
  * `name`: {string} 指數名稱
  * `tradeVolume`: {number} 成交股數
  * `tradeValue`: {number} 成交金額
  * `tradeWeight`: {number} 成交比重

```js
twstock.indices.trades({ date: '2023-01-30', symbol: 'IX0028' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   symbol: 'IX0028',
//   name: '半導體類指數',
//   tradeVolume: 770856550,
//   tradeValue: 150024105617,
//   tradeWeight: 42.28
// }
```

### `.market.trades(options)`

取得股票市場在特定日期的成交量值。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market`: {string} 市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `tradeVolume`: {number} 成交股數
  * `tradeValue`: {number} 成交金額
  * `transaction`: {number} 成交筆數
  * `index`: {number} 大盤指數
  * `change`: {number} 指數漲跌

```js
twstock.market.trades({ date: '2023-01-30', market: 'TSE' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   tradeVolume: 6919326963,
//   tradeValue: 354872347181,
//   transaction: 2330770,
//   index: 15493.82,
//   change: 560.89
// }
```

### `.market.breadth(options)`

取得股票市場在特定日期的上漲與下跌家數。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market`: {string} 市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `up`: {number} 上漲家數
  * `limitUp`: {number} 漲停家數
  * `down`: {number} 下跌家數
  * `limitDown`: {number} 跌停家數
  * `unchanged`: {number} 平盤家數
  * `unmatched`: {number} 未成交家數
  * `notApplicable`: {number} 無比價家數

```js
twstock.market.breadth({ date: '2023-01-30', market: 'TSE' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   up: 764,
//   limitUp: 14,
//   down: 132,
//   limitDown: 0,
//   unchanged: 67,
//   unmatched: 1,
//   notApplicable: 4
// }
```

### `.market.instTrades(options)`

取得股票市場在特定日期的三大法人買賣超。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market`: {string} 市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `finiWithoutDealersBuy`: {number} 外資及陸資(不含外資自營商)買進金額
  * `finiWithoutDealersSell`: {number} 外資及陸資(不含外資自營商)賣出金額
  * `finiWithoutDealersNetBuySell`: {number} 外資及陸資(不含外資自營商)買賣差額
  * `finiDealersBuy`: {number} 外資自營商買進金額
  * `finiDealersSell`: {number} 外資自營商賣出金額
  * `finiDealersNetBuySell`: {number} 外資自營商買賣差額
  * `finiBuy`: {number} 外資買進金額
  * `finiSell`: {number} 外資賣出金額
  * `finiNetBuySell`: {number} 外資買賣差額
  * `sitcBuy`: {number} 投信買進金額
  * `sitcSell`: {number} 投信賣出金額
  * `sitcNetBuySell`: {number} 投信買賣差額
  * `dealersForProprietaryBuy`: {number} 自營商(自行買賣)買進金額
  * `dealersForProprietarySell`: {number} 自營商(自行買賣)賣出金額
  * `dealersForProprietaryNetBuySell`: {number} 自營商(自行買賣)買賣差額
  * `dealersForHedgingBuy`: {number} 自營商(避險)買進金額
  * `dealersForHedgingSell`: {number} 自營商(避險)賣出金額
  * `dealersForHedgingNetBuySell`: {number} 自營商(避險)買賣差額
  * `dealersBuy`: {number} 自營商買進金額
  * `dealersSell`: {number} 自營商賣出金額
  * `dealersNetBuySell`: {number} 自營商買賣差額
  * `totalInstInvestorsBuy`: {number} 三大法人合計買進金額
  * `totalInstInvestorsSell`: {number} 三大法人合計賣出金額
  * `totalInstInvestorsNetBuySell`: {number} 三大法人合計買賣差額

```js
twstock.market.instTrades({ date: '2023-01-30', market: 'TSE' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   finiWithoutDealersBuy: 203744063563,
//   finiWithoutDealersSell: 131488377272,
//   finiWithoutDealersNetBuySell: 72255686291,
//   finiDealersBuy: 24864200,
//   finiDealersSell: 61653250,
//   finiDealersNetBuySell: -36789050,
//   finiBuy: 203768927763,
//   finiSell: 131550030522,
//   finiNetBuySell: 72218897241,
//   sitcBuy: 6269087553,
//   sitcSell: 3179424632,
//   sitcNetBuySell: 3089662921,
//   dealersForProprietaryBuy: 4736295878,
//   dealersForProprietarySell: 1917624556,
//   dealersForProprietaryNetBuySell: 2818671322,
//   dealersForHedgingBuy: 11451095424,
//   dealersForHedgingSell: 6481456459,
//   dealersForHedgingNetBuySell: 4969638965,
//   dealersBuy: 16187391302,
//   dealersSell: 8399081015,
//   dealersNetBuySell: 7788310287,
//   totalInstInvestorsBuy: 226200542418,
//   totalInstInvestorsSell: 143066882919,
//   totalInstInvestorsNetBuySell: 83133659499
// }
```

### `.market.marginTrades(options)`

取得股票市場在特定日期的信用交易統計。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market`: {string} 市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `marginBuy`: {number} 融資買進(張)
  * `marginSell`: {number} 融資賣出(張)
  * `marginRedeem`: {number} 現金償還(張)
  * `marginBalancePrev`: {number} 前日融資餘額(張)
  * `marginBalance`: {number} 今日融資餘額(張)
  * `shortBuy`: {number} 融券買進(張)
  * `shortSell`: {number} 融券賣出(張)
  * `shortRedeem`: {number} 現券償還(張)
  * `shortBalancePrev`: {number} 前日融券餘額(張)
  * `shortBalance`: {number} 今日融券餘額(張)
  * `marginBuyValue`: {number} 融資買進(仟元)
  * `marginSellValue`: {number} 融資賣出(仟元)
  * `marginRedeemValue`: {number} 現金償還(仟元)
  * `marginBalancePrevValue`: {number} 前日融資餘額(仟元)
  * `marginBalanceValue`: {number} 今日融資餘額(仟元)

```js
twstock.market.marginTrades({ date: '2023-01-30', market: 'TSE' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   marginBuy: 264023,
//   marginSell: 282873,
//   marginRedeem: 10127,
//   marginBalancePrev: 6310599,
//   marginBalance: 6281622,
//   shortBuy: 17280,
//   shortSell: 20392,
//   shortRedeem: 2075,
//   shortBalancePrev: 542895,
//   shortBalance: 543932,
//   marginBuyValue: 8514925,
//   marginSellValue: 8830493,
//   marginRedeemValue: 300879,
//   marginBalancePrevValue: 151760467,
//   marginBalanceValue: 151144020
// }
```

### `.futopt.txfInstTrades(options)`

取得臺股期貨在特定日期的三大法人交易口數、契約金額與未平倉餘額。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 契約代號
  * `finiLongTradeVolume`: {number} 外資-多方交易口數
  * `finiLongTradeValue`: {number} 外資-多方交易契約金額(千元)
  * `finiShortTradeVolume`: {number} 外資-空方交易口數
  * `finiShortTradeValue`: {number} 外資-空方交易契約金額(千元)
  * `finiNetTradeVolume`: {number} 外資-多空交易口數淨額
  * `finiNetTradeValue`: {number} 外資-多空交易契約金額淨額(千元)
  * `finiLongOiVolume`: {number} 外資-多方未平倉口數
  * `finiLongOiValue`: {number} 外資-多方未平倉契約金額(千元)
  * `finiShortOiVolume`: {number} 外資-空方未平倉口數
  * `finiShortOiValue`: {number} 外資-空方未平倉契約金額(千元)
  * `finiNetOiVolume`: {number} 外資-多空未平倉口數淨額
  * `finiNetOiValue`: {number} 外資-多空未平倉契約金額淨額(千元) 
  * `sitcLongTradeVolume`: {number} 投信-多方交易口數
  * `sitcLongTradeValue`: {number} 投信-多方交易契約金額(千元)
  * `sitcShortTradeVolume`: {number} 投信-空方交易口數
  * `sitcShortTradeValue`: {number} 投信-空方交易契約金額(千元)
  * `sitcNetTradeVolume`: {number} 投信-多空交易口數淨額
  * `sitcNetTradeValue`: {number} 投信-多空交易契約金額淨額(千元)
  * `sitcLongOiVolume`: {number} 投信-多方未平倉口數
  * `sitcLongOiValue`: {number} 投信-多方未平倉契約金額(千元)
  * `sitcShortOiVolume`: {number} 投信-空方未平倉口數
  * `sitcShortOiValue`: {number} 投信-空方未平倉契約金額(千元)
  * `sitcNetOiVolume`: {number} 投信-多空未平倉口數淨額
  * `sitcNetOiValue`: {number} 投信-多空未平倉契約金額淨額(千元)
  * `dealersLongTradeVolume`: {number} 自營商-多方交易口數
  * `dealersLongTradeValue`: {number} 自營商-多方交易契約金額(千元)
  * `dealersShortTradeVolume`: {number} 自營商-空方交易口數
  * `dealersShortTradeValue`: {number} 自營商-空方交易契約金額(千元)
  * `dealersNetTradeVolume`: {number} 自營商-多空交易口數淨額
  * `dealersNetTradeValue`: {number} 自營商-多空交易契約金額淨額(千元)
  * `dealersLongOiVolume`: {number} 自營商-多方未平倉口數
  * `dealersLongOiValue`: {number} 自營商-多方未平倉契約金額(千元)
  * `dealersShortOiVolume`: {number} 自營商-空方未平倉口數
  * `dealersShortOiValue`: {number} 自營商-空方未平倉契約金額(千元)
  * `dealersNetOiVolume`: {number} 自營商-多空未平倉口數淨額
  * `dealersNetOiValue`: {number} 自營商-多空未平倉契約金額淨額(千元)


```js
twstock.futopt.txfInstTrades({ date: '2023-01-30' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   symbol: 'TXF',
//   name: '臺股期貨',
//   finiLongTradeVolume: 61232,
//   finiLongTradeValue: 187462698,
//   finiShortTradeVolume: 60146,
//   finiShortTradeValue: 184303292,
//   finiNetTradeVolume: 1086,
//   finiNetTradeValue: 3159406,
//   finiLongOiVolume: 32100,
//   finiLongOiValue: 99233073,
//   finiShortOiVolume: 24001,
//   finiShortOiValue: 74192341,
//   finiNetOiVolume: 8099,
//   finiNetOiValue: 25040732,
//   sitcLongTradeVolume: 2237,
//   sitcLongTradeValue: 6907887,
//   sitcShortTradeVolume: 449,
//   sitcShortTradeValue: 1384268,
//   sitcNetTradeVolume: 1788,
//   sitcNetTradeValue: 5523619,
//   sitcLongOiVolume: 10112,
//   sitcLongOiValue: 31260237,
//   sitcShortOiVolume: 15995,
//   sitcShortOiValue: 49446943,
//   sitcNetOiVolume: -5883,
//   sitcNetOiValue: -18186706,
//   dealersLongTradeVolume: 14205,
//   dealersLongTradeValue: 43588157,
//   dealersShortTradeVolume: 17049,
//   dealersShortTradeValue: 52346096,
//   dealersNetTradeVolume: -2844,
//   dealersNetTradeValue: -8757939,
//   dealersLongOiVolume: 10822,
//   dealersLongOiValue: 33446397,
//   dealersShortOiVolume: 5797,
//   dealersShortOiValue: 17917728,
//   dealersNetOiVolume: 5025,
//   dealersNetOiValue: 15528669
// }
```

### `.futopt.txoInstTrades(options)`

取得臺指選擇權在特定日期的三大法人交易口數、契約金額與未平倉餘額。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 契約代號
  * `calls`: {Object} 臺指選擇權-買權
    * `finiLongTradeVolume`: {number} 外資-多方交易口數
    * `finiLongTradeValue`: {number} 外資-多方交易契約金額(千元)
    * `finiShortTradeVolume`: {number} 外資-空方交易口數
    * `finiShortTradeValue`: {number} 外資-空方交易契約金額(千元)
    * `finiNetTradeVolume`: {number} 外資-多空交易口數淨額
    * `finiNetTradeValue`: {number} 外資-多空交易契約金額淨額(千元)
    * `finiLongOiVolume`: {number} 外資-多方未平倉口數
    * `finiLongOiValue`: {number} 外資-多方未平倉契約金額(千元)
    * `finiShortOiVolume`: {number} 外資-空方未平倉口數
    * `finiShortOiValue`: {number} 外資-空方未平倉契約金額(千元)
    * `finiNetOiVolume`: {number} 外資-多空未平倉口數淨額
    * `finiNetOiValue`: {number} 外資-多空未平倉契約金額淨額(千元) 
    * `sitcLongTradeVolume`: {number} 投信-多方交易口數
    * `sitcLongTradeValue`: {number} 投信-多方交易契約金額(千元)
    * `sitcShortTradeVolume`: {number} 投信-空方交易口數
    * `sitcShortTradeValue`: {number} 投信-空方交易契約金額(千元)
    * `sitcNetTradeVolume`: {number} 投信-多空交易口數淨額
    * `sitcNetTradeValue`: {number} 投信-多空交易契約金額淨額(千元)
    * `sitcLongOiVolume`: {number} 投信-多方未平倉口數
    * `sitcLongOiValue`: {number} 投信-多方未平倉契約金額(千元)
    * `sitcShortOiVolume`: {number} 投信-空方未平倉口數
    * `sitcShortOiValue`: {number} 投信-空方未平倉契約金額(千元)
    * `sitcNetOiVolume`: {number} 投信-多空未平倉口數淨額
    * `sitcNetOiValue`: {number} 投信-多空未平倉契約金額淨額(千元)
    * `dealersLongTradeVolume`: {number} 自營商-多方交易口數
    * `dealersLongTradeValue`: {number} 自營商-多方交易契約金額(千元)
    * `dealersShortTradeVolume`: {number} 自營商-空方交易口數
    * `dealersShortTradeValue`: {number} 自營商-空方交易契約金額(千元)
    * `dealersNetTradeVolume`: {number} 自營商-多空交易口數淨額
    * `dealersNetTradeValue`: {number} 自營商-多空交易契約金額淨額(千元)
    * `dealersLongOiVolume`: {number} 自營商-多方未平倉口數
    * `dealersLongOiValue`: {number} 自營商-多方未平倉契約金額(千元)
    * `dealersShortOiVolume`: {number} 自營商-空方未平倉口數
    * `dealersShortOiValue`: {number} 自營商-空方未平倉契約金額(千元)
    * `dealersNetOiVolume`: {number} 自營商-多空未平倉口數淨額
    * `dealersNetOiValue`: {number} 自營商-多空未平倉契約金額淨額(千元)
  * `puts`: {Object} 臺指選擇權-賣權
    * `finiLongTradeVolume`: {number} 外資-多方交易口數
    * `finiLongTradeValue`: {number} 外資-多方交易契約金額(千元)
    * `finiShortTradeVolume`: {number} 外資-空方交易口數
    * `finiShortTradeValue`: {number} 外資-空方交易契約金額(千元)
    * `finiNetTradeVolume`: {number} 外資-多空交易口數淨額
    * `finiNetTradeValue`: {number} 外資-多空交易契約金額淨額(千元)
    * `finiLongOiVolume`: {number} 外資-多方未平倉口數
    * `finiLongOiValue`: {number} 外資-多方未平倉契約金額(千元)
    * `finiShortOiVolume`: {number} 外資-空方未平倉口數
    * `finiShortOiValue`: {number} 外資-空方未平倉契約金額(千元)
    * `finiNetOiVolume`: {number} 外資-多空未平倉口數淨額
    * `finiNetOiValue`: {number} 外資-多空未平倉契約金額淨額(千元) 
    * `sitcLongTradeVolume`: {number} 投信-多方交易口數
    * `sitcLongTradeValue`: {number} 投信-多方交易契約金額(千元)
    * `sitcShortTradeVolume`: {number} 投信-空方交易口數
    * `sitcShortTradeValue`: {number} 投信-空方交易契約金額(千元)
    * `sitcNetTradeVolume`: {number} 投信-多空交易口數淨額
    * `sitcNetTradeValue`: {number} 投信-多空交易契約金額淨額(千元)
    * `sitcLongOiVolume`: {number} 投信-多方未平倉口數
    * `sitcLongOiValue`: {number} 投信-多方未平倉契約金額(千元)
    * `sitcShortOiVolume`: {number} 投信-空方未平倉口數
    * `sitcShortOiValue`: {number} 投信-空方未平倉契約金額(千元)
    * `sitcNetOiVolume`: {number} 投信-多空未平倉口數淨額
    * `sitcNetOiValue`: {number} 投信-多空未平倉契約金額淨額(千元)
    * `dealersLongTradeVolume`: {number} 自營商-多方交易口數
    * `dealersLongTradeValue`: {number} 自營商-多方交易契約金額(千元)
    * `dealersShortTradeVolume`: {number} 自營商-空方交易口數
    * `dealersShortTradeValue`: {number} 自營商-空方交易契約金額(千元)
    * `dealersNetTradeVolume`: {number} 自營商-多空交易口數淨額
    * `dealersNetTradeValue`: {number} 自營商-多空交易契約金額淨額(千元)
    * `dealersLongOiVolume`: {number} 自營商-多方未平倉口數
    * `dealersLongOiValue`: {number} 自營商-多方未平倉契約金額(千元)
    * `dealersShortOiVolume`: {number} 自營商-空方未平倉口數
    * `dealersShortOiValue`: {number} 自營商-空方未平倉契約金額(千元)
    * `dealersNetOiVolume`: {number} 自營商-多空未平倉口數淨額
    * `dealersNetOiValue`: {number} 自營商-多空未平倉契約金額淨額(千元)

```js
twstock.futopt.txoInstTrades({ date: '2023-01-30' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   symbol: 'TXO',
//   name: '臺指選擇權',
//   calls: {
//     finiLongTradeVolume: 58909,
//     finiLongTradeValue: 277781,
//     finiShortTradeVolume: 49665,
//     finiShortTradeValue: 282059,
//     finiNetTradeVolume: 9244,
//     finiNetTradeValue: -4278,
//     finiLongOiVolume: 11735,
//     finiLongOiValue: 333628,
//     finiShortOiVolume: 7956,
//     finiShortOiValue: 182152,
//     finiNetOiVolume: 3779,
//     finiNetOiValue: 151476,
//     sitcLongTradeVolume: 0,
//     sitcLongTradeValue: 0,
//     sitcShortTradeVolume: 0,
//     sitcShortTradeValue: 0,
//     sitcNetTradeVolume: 0,
//     sitcNetTradeValue: 0,
//     sitcLongOiVolume: 0,
//     sitcLongOiValue: 0,
//     sitcShortOiVolume: 0,
//     sitcShortOiValue: 0,
//     sitcNetOiVolume: 0,
//     sitcNetOiValue: 0,
//     dealersLongTradeVolume: 146455,
//     dealersLongTradeValue: 790595,
//     dealersShortTradeVolume: 150228,
//     dealersShortTradeValue: 678924,
//     dealersNetTradeVolume: -3773,
//     dealersNetTradeValue: 111671,
//     dealersLongOiVolume: 33450,
//     dealersLongOiValue: 537454,
//     dealersShortOiVolume: 37665,
//     dealersShortOiValue: 377511,
//     dealersNetOiVolume: -4215,
//     dealersNetOiValue: 159943
//   },
//   puts: {
//     finiLongTradeVolume: 29719,
//     finiLongTradeValue: 88059,
//     finiShortTradeVolume: 27070,
//     finiShortTradeValue: 87819,
//     finiNetTradeVolume: 2649,
//     finiNetTradeValue: 240,
//     finiLongOiVolume: 7147,
//     finiLongOiValue: 8210,
//     finiShortOiVolume: 9383,
//     finiShortOiValue: 24009,
//     finiNetOiVolume: -2236,
//     finiNetOiValue: -15799,
//     sitcLongTradeVolume: 141,
//     sitcLongTradeValue: 1,
//     sitcShortTradeVolume: 111,
//     sitcShortTradeValue: 1152,
//     sitcNetTradeVolume: 30,
//     sitcNetTradeValue: -1151,
//     sitcLongOiVolume: 0,
//     sitcLongOiValue: 0,
//     sitcShortOiVolume: 111,
//     sitcShortOiValue: 1027,
//     sitcNetOiVolume: -111,
//     sitcNetOiValue: -1027,
//     dealersLongTradeVolume: 118685,
//     dealersLongTradeValue: 324370,
//     dealersShortTradeVolume: 152013,
//     dealersShortTradeValue: 332610,
//     dealersNetTradeVolume: -33328,
//     dealersNetTradeValue: -8240,
//     dealersLongOiVolume: 24355,
//     dealersLongOiValue: 126801,
//     dealersShortOiVolume: 32667,
//     dealersShortOiValue: 71726,
//     dealersNetOiVolume: -8312,
//     dealersNetOiValue: 55075
//   }
// }
```

### `.futopt.txoPutCallRatio(options)`

取得臺指選擇權在特定日期的 Put/Call Ratio。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `txoPutVolume`: {string} 賣權成交量
  * `txoCallVolume`: {number} 買權成交量
  * `txoPutCallVolumeRatio`: {number} 買賣權成交量比率
  * `txoPutOi`: {number} 賣權未平倉量
  * `txoCallOi`: {number} 買權未平倉量
  * `txoPutCallOiRatio`: {number} 買賣權未平倉量比率
  
```js
twstock.futopt.txoPutCallRatio({ date: '2023-01-30' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   txoPutVolume: 349525,
//   txoCallVolume: 410532,
//   txoPutCallVolumeRatio: 0.8514,
//   txoPutOi: 89495,
//   txoCallOi: 87502,
//   txoPutCallOiRatio: 1.0228
// }
```

### `.futopt.mxfRetailPosition(options)`

取得特定日期的散戶小台淨部位及散戶小台多空比

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `mxfRetailLongOi`: {number} 散戶小台多單
  * `mxfRetailShortOi`: {number} 散戶小台空單
  * `mxfRetailNetOi`: {number} 散戶小台淨部位
  * `mxfRetailLongShortRatio`: {number} 散戶小台多空比
  
```js
twstock.futopt.mxfRetailPosition({ date: '2023-01-30' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   mxfRetailLongOi: 30126,
//   mxfRetailShortOi: 38959,
//   mxfRetailNetOi: -8833,
//   mxfRetailLongShortRatio: -0.2004
// }
```

### `.futopt.txfLargeTradersPosition(options)`

取得臺股期貨在特定日期的大額交易人未沖銷部位。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `frontMonth`: {Object} 近月契約
    * `topFiveLongOi`: {number} 前五大交易人買方部位數
    * `topFiveShortOi`: {number} 前五大交易人賣方部位數
    * `topFiveNetOi`: {number} 前五大交易人淨部位
    * `topTenLongOi`: {number} 前十大交易人買方部位數
    * `topTenShortOi`: {number} 前十大交易人賣方部位數
    * `topTenNetOi`: {number} 前十大交易人淨部位
    * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
    * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
    * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
    * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
    * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
    * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
    * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
    * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
    * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
    * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
    * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
    * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
    * `marketOi`: {number} 全市場未沖銷部位數
* `allMonths`: {Object} 所有契約
    * `topFiveLongOi`: {number} 前五大交易人買方部位數
    * `topFiveShortOi`: {number} 前五大交易人賣方部位數
    * `topFiveNetOi`: {number} 前五大交易人淨部位
    * `topTenLongOi`: {number} 前十大交易人買方部位數
    * `topTenShortOi`: {number} 前十大交易人賣方部位數
    * `topTenNetOi`: {number} 前十大交易人淨部位
    * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
    * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
    * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
    * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
    * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
    * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
    * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
    * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
    * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
    * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
    * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
    * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
    * `marketOi`: {number} 全市場未沖銷部位數
* `backMonths`: {Object} 遠月契約
    * `topFiveLongOi`: {number} 前五大交易人買方部位數
    * `topFiveShortOi`: {number} 前五大交易人賣方部位數
    * `topFiveNetOi`: {number} 前五大交易人淨部位
    * `topTenLongOi`: {number} 前十大交易人買方部位數
    * `topTenShortOi`: {number} 前十大交易人賣方部位數
    * `topTenNetOi`: {number} 前十大交易人淨部位
    * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
    * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
    * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
    * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
    * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
    * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
    * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
    * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
    * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
    * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
    * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
    * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
    * `marketOi`: {number} 全市場未沖銷部位數
```js
twstock.futopt.txfLargeTradersPosition({ date: '2023-01-30' })
  .then(data => console.log(data));
// Prints:
// {
//   frontMonth: {
//     topFiveLongOi: 30643,
//     topFiveShortOi: 29456,
//     topFiveNetOi: 1187,
//     topTenLongOi: 40363,
//     topTenShortOi: 36869,
//     topTenNetOi: 3494,
//     topFiveSpecificLongOi: 30643,
//     topFiveSpecificShortOi: 29456,
//     topFiveSpecificNetOi: 1187,
//     topTenSpecificLongOi: 38860,
//     topTenSpecificShortOi: 34209,
//     topTenSpecificNetOi: 4651,
//     topFiveNonspecificLongOi: 0,
//     topFiveNonspecificShortOi: 0,
//     topFiveNonspecificNetOi: 0,
//     topTenNonspecificLongOi: 1503,
//     topTenNonspecificShortOi: 2660,
//     topTenNonspecificNetOi: -1157,
//     marketOi: 68173
//   },
//   allMonths: {
//     topFiveLongOi: 30828,
//     topFiveShortOi: 29523,
//     topFiveNetOi: 1305,
//     topTenLongOi: 40572,
//     topTenShortOi: 37209,
//     topTenNetOi: 3363,
//     topFiveSpecificLongOi: 30828,
//     topFiveSpecificShortOi: 29523,
//     topFiveSpecificNetOi: 1305,
//     topTenSpecificLongOi: 39045,
//     topTenSpecificShortOi: 34493,
//     topTenSpecificNetOi: 4552,
//     marketOi: 72437
//   },
//   backMonths: {
//     topFiveLongOi: 185,
//     topFiveShortOi: 67,
//     topFiveNetOi: 118,
//     topTenLongOi: 209,
//     topTenShortOi: 340,
//     topTenNetOi: -131,
//     topFiveSpecificLongOi: 185,
//     topFiveSpecificShortOi: 67,
//     topFiveSpecificNetOi: 118,
//     topTenSpecificLongOi: 185,
//     topTenSpecificShortOi: 284,
//     topTenSpecificNetOi: -99,
//     marketOi: 4264
//   }
// }
```

### `.futopt.txoLargeTradersPosition(options)`

取得臺指選擇權在特定日期的大額交易人未沖銷部位。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `calls`: {Object} 臺指買權
    * `frontMonth`: {Object} 近月契約
      * `topFiveLongOi`: {number} 前五大交易人買方部位數
      * `topFiveShortOi`: {number} 前五大交易人賣方部位數
      * `topFiveNetOi`: {number} 前五大交易人淨部位
      * `topTenLongOi`: {number} 前十大交易人買方部位數
      * `topTenShortOi`: {number} 前十大交易人賣方部位數
      * `topTenNetOi`: {number} 前十大交易人淨部位
      * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
      * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
      * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
      * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
      * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
      * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
      * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
      * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
      * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
      * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
      * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
      * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
      * `marketOi`: {number} 全市場未沖銷部位數
    * `allMonths`: {Object} 所有契約
      * `topFiveLongOi`: {number} 前五大交易人買方部位數
      * `topFiveShortOi`: {number} 前五大交易人賣方部位數
      * `topFiveNetOi`: {number} 前五大交易人淨部位
      * `topTenLongOi`: {number} 前十大交易人買方部位數
      * `topTenShortOi`: {number} 前十大交易人賣方部位數
      * `topTenNetOi`: {number} 前十大交易人淨部位
      * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
      * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
      * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
      * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
      * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
      * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
      * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
      * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
      * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
      * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
      * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
      * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
      * `marketOi`: {number} 全市場未沖銷部位數
    * `backMonths`: {Object} 遠月契約
      * `topFiveLongOi`: {number} 前五大交易人買方部位數
      * `topFiveShortOi`: {number} 前五大交易人賣方部位數
      * `topFiveNetOi`: {number} 前五大交易人淨部位
      * `topTenLongOi`: {number} 前十大交易人買方部位數
      * `topTenShortOi`: {number} 前十大交易人賣方部位數
      * `topTenNetOi`: {number} 前十大交易人淨部位
      * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
      * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
      * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
      * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
      * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
      * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
      * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
      * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
      * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
      * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
      * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
      * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
      * `marketOi`: {number} 全市場未沖銷部位數
  * `puts`: {Object} 臺指賣權
    * `frontMonth`: {Object} 近月契約
      * `topFiveLongOi`: {number} 前五大交易人買方部位數
      * `topFiveShortOi`: {number} 前五大交易人賣方部位數
      * `topFiveNetOi`: {number} 前五大交易人淨部位
      * `topTenLongOi`: {number} 前十大交易人買方部位數
      * `topTenShortOi`: {number} 前十大交易人賣方部位數
      * `topTenNetOi`: {number} 前十大交易人淨部位
      * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
      * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
      * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
      * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
      * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
      * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
      * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
      * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
      * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
      * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
      * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
      * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
      * `marketOi`: {number} 全市場未沖銷部位數
    * `allMonths`: {Object} 所有契約
      * `topFiveLongOi`: {number} 前五大交易人買方部位數
      * `topFiveShortOi`: {number} 前五大交易人賣方部位數
      * `topFiveNetOi`: {number} 前五大交易人淨部位
      * `topTenLongOi`: {number} 前十大交易人買方部位數
      * `topTenShortOi`: {number} 前十大交易人賣方部位數
      * `topTenNetOi`: {number} 前十大交易人淨部位
      * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
      * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
      * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
      * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
      * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
      * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
      * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
      * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
      * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
      * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
      * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
      * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
      * `marketOi`: {number} 全市場未沖銷部位數
    * `backMonths`: {Object} 遠月契約
      * `topFiveLongOi`: {number} 前五大交易人買方部位數
      * `topFiveShortOi`: {number} 前五大交易人賣方部位數
      * `topFiveNetOi`: {number} 前五大交易人淨部位
      * `topTenLongOi`: {number} 前十大交易人買方部位數
      * `topTenShortOi`: {number} 前十大交易人賣方部位數
      * `topTenNetOi`: {number} 前十大交易人淨部位
      * `topFiveSpecificLongOi`: {number} 前五大特定法人買方部位數
      * `topFiveSpecificShortOi`: {number} 前五大特定法人賣方部位數
      * `topFiveSpecificNetOi`: {number} 前五大特定法人淨部位
      * `topTenSpecificLongOi`: {number} 前十大特定法人買方部位數
      * `topTenSpecificShortOi`: {number} 前十大特定法人賣方部位數
      * `topTenSpecificNetOi`: {number} 前十大特定法人淨部位
      * `topFiveNonspecificLongOi`: {number} 前五大非特定法人買方部位數
      * `topFiveNonspecificShortOi`: {number} 前五大非特定法人賣方部位數
      * `topFiveNonspecificNetOi`: {number} 前五大非特定法人淨部位
      * `topTenNonspecificLongOi`: {number} 前十大非特定法人買方部位數
      * `topTenNonspecificShortOi`: {number} 前十大非特定法人賣方部位數
      * `topTenNonspecificNetOi`: {number} 前十大非特定法人淨部位
      * `marketOi`: {number} 全市場未沖銷部位數
```js
twstock.futopt.txoLargeTradersPosition({ date: '2023-01-30' })
  .then(data => console.log(data));
// Prints:
// {
//   calls: {
//     frontMonth: {
//       topFiveLongOi: 16007,
//       topFiveShortOi: 11593,
//       topFiveNetOi: 4414,
//       topTenLongOi: 19936,
//       topTenShortOi: 17255,
//       topTenNetOi: 2681,
//       topFiveSpecificLongOi: 2636,
//       topFiveSpecificShortOi: 5158,
//       topFiveSpecificNetOi: -2522,
//       topTenSpecificLongOi: 5237,
//       topTenSpecificShortOi: 6533,
//       topTenSpecificNetOi: -1296,
//       topFiveNonspecificLongOi: 13371,
//       topFiveNonspecificShortOi: 6435,
//       topFiveNonspecificNetOi: 6936,
//       topTenNonspecificLongOi: 14699,
//       topTenNonspecificShortOi: 10722,
//       topTenNonspecificNetOi: 3977,
//       marketOi: 37196
//     },
//     allMonths: {
//       topFiveLongOi: 32966,
//       topFiveShortOi: 33968,
//       topFiveNetOi: -1002,
//       topTenLongOi: 43496,
//       topTenShortOi: 43773,
//       topTenNetOi: -277,
//       topFiveSpecificLongOi: 0,
//       topFiveSpecificShortOi: 3000,
//       topFiveSpecificNetOi: -3000,
//       topTenSpecificLongOi: 7195,
//       topTenSpecificShortOi: 5160,
//       topTenSpecificNetOi: 2035,
//       marketOi: 87502
//     },
//     backMonths: {
//       topFiveLongOi: 16959,
//       topFiveShortOi: 22375,
//       topFiveNetOi: -5416,
//       topTenLongOi: 23560,
//       topTenShortOi: 26518,
//       topTenNetOi: -2958,
//       topFiveSpecificLongOi: -2636,
//       topFiveSpecificShortOi: -2158,
//       topFiveSpecificNetOi: -478,
//       topTenSpecificLongOi: 1958,
//       topTenSpecificShortOi: -1373,
//       topTenSpecificNetOi: 3331,
//       marketOi: 50306
//     }
//   },
//   puts: {
//     frontMonth: {
//       topFiveLongOi: 9716,
//       topFiveShortOi: 4483,
//       topFiveNetOi: 5233,
//       topTenLongOi: 11749,
//       topTenShortOi: 6670,
//       topTenNetOi: 5079,
//       topFiveSpecificLongOi: 0,
//       topFiveSpecificShortOi: 570,
//       topFiveSpecificNetOi: -570,
//       topTenSpecificLongOi: 0,
//       topTenSpecificShortOi: 930,
//       topTenSpecificNetOi: -930,
//       topFiveNonspecificLongOi: 9716,
//       topFiveNonspecificShortOi: 3913,
//       topFiveNonspecificNetOi: 5803,
//       topTenNonspecificLongOi: 11749,
//       topTenNonspecificShortOi: 5740,
//       topTenNonspecificNetOi: 6009,
//       marketOi: 23838
//     },
//     allMonths: {
//       topFiveLongOi: 13841,
//       topFiveShortOi: 9469,
//       topFiveNetOi: 4372,
//       topTenLongOi: 17629,
//       topTenShortOi: 11668,
//       topTenNetOi: 5961,
//       topFiveSpecificLongOi: 3474,
//       topFiveSpecificShortOi: 1837,
//       topFiveSpecificNetOi: 1637,
//       topTenSpecificLongOi: 3474,
//       topTenSpecificShortOi: 2208,
//       topTenSpecificNetOi: 1266,
//       marketOi: 34848
//     },
//     backMonths: {
//       topFiveLongOi: 4125,
//       topFiveShortOi: 4986,
//       topFiveNetOi: -861,
//       topTenLongOi: 5880,
//       topTenShortOi: 4998,
//       topTenNetOi: 882,
//       topFiveSpecificLongOi: 3474,
//       topFiveSpecificShortOi: 1267,
//       topFiveSpecificNetOi: 2207,
//       topTenSpecificLongOi: 3474,
//       topTenSpecificShortOi: 1278,
//       topTenSpecificNetOi: 2196,
//       marketOi: 11010
//     }
//   }
// }
```

### `.futopt.exchangeRates(options)`

取得特定日期的外幣參考匯率。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `usdtwd`: {number} 美元／新台幣
  * `cnytwd`: {number} 人民幣／新台幣
  * `eurusd`: {number} 歐元／美元
  * `usdjpy`: {number} 美元／日幣
  * `gbpusd`: {number} 英鎊／美元
  * `audusd`: {number} 澳幣／美元
  * `usdhkd`: {number} 美元／港幣
  * `usdcny`: {number} 美元／人民幣
  * `usdzar`: {number} 美元／南非幣
  * `nzdusd`: {number} 紐幣／美元
  
```js
twstock.futopt.exchangeRates({ date: '2023-01-30' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   usdtwd: 30.137,
//   cnytwd: 4.464224,
//   eurusd: 1.08835,
//   usdjpy: 129.925,
//   gbpusd: 1.23865,
//   audusd: 0.70825,
//   usdhkd: 7.83585,
//   usdcny: 6.7508,
//   usdzar: 17.2262,
//   nzdusd: 0.64805
// }
```

## Data Sources

* [臺灣證券交易所](https://www.twse.com.tw)
* [證券櫃檯買賣中心](https://www.tpex.org.tw)
* [臺灣期貨交易所](https://www.taifex.com.tw)
* [臺灣集中保管結算所](https://www.tdcc.com.tw)
* [公開資訊觀測站](https://mops.twse.com.tw)
* [基本市況報導網站](https://mis.twse.com.tw)

## Changelog

[Changelog](./CHANGELOG.md)

## License

[MIT](LICENSE)

[npm-image]: https://img.shields.io/npm/v/node-twstock.svg
[npm-url]: https://npmjs.com/package/node-twstock
[action-image]: https://img.shields.io/github/actions/workflow/status/chunkai1312/node-twstock/node.js.yml?branch=main
[action-url]: https://github.com/chunkai1312/node-twstock/actions/workflows/node.js.yml
[codecov-image]: https://img.shields.io/codecov/c/github/chunkai1312/node-twstock.svg
[codecov-url]: https://codecov.io/gh/chunkai1312/node-twstock
