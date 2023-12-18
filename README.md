# node-twstock

[![NPM version][npm-image]][npm-url]
[![Build Status][action-image]][action-url]
[![Coverage Status][codecov-image]][codecov-url]

> A client library for scraping Taiwan stock market data, provided by [Taiwan Stock Exchange](https://www.twse.com.tw) and [Taipei Exchange](https://www.tpex.org.tw).

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  * [stocks.list(params)](#stockslistparams)
  * [stocks.quote(params)](#stocksquoteparams)
  * [stocks.historical(params)](#stockshistoricalparams)
  * [stocks.instTrades(params)](#stocksinsttradesparams)
  * [stocks.finiHoldings(params)](#stocksfiniholdingsparams)
  * [stocks.marginTrades(params)](#stocksmargintradesparams)
  * [stocks.values(params)](#stocksvaluesparams)
  * [stocks.holders(params)](#stocksholdersparams)
  * [stocks.eps(params)](#stocksepsparams)
  * [stocks.revenue(params)](#stocksrevenueparams)
  * [indices.list(params)](#indiceslistparams)
  * [indices.quote(params)](#indicesquoteparams)
  * [indices.historical(params)](#indiceshistoricalparams)
  * [indices.trades(params)](#indicestradesparams)
  * [market.trades(params)](#markettradesparams)
  * [market.breadth(params)](#marketbreadthparams)
  * [market.instTrades(params)](#marketinsttradesparams)
  * [market.marginTrades(params)](#marketmargintradesparams)
* [Changelog](#changelog)
* [License](#license)

## Installation

```sh
$ npm install --save node-twstock
```

## Usage

```js
const { TwStock } = require('node-twstock');

const twstock = new TwStock();

// To retrieve stocks data
const stocks = twstock.stocks;

// To retrieve indices data
const indices = twstock.indices;

// To retrieve market data
const market = twstock.market;
```

## API

### `stocks.list(params)`

取得上市櫃股票列表

* `params`: {Object}
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `exchange`: {string} 股票名稱
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

### `stocks.quote(params)`

取得股票即時行情

* `params`: {Object}
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

### `stocks.historical(params)`

取得股票在特定日期的收盤行情

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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

取得股票在特定日期的三大法人買賣超

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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

### `stocks.finiHoldings(params)`

取得股票在特定日期的外資持股比例

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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
//   exchange: 'TWSE',
//   market: 'TSE',
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

### `stocks.marginTrades(params)`

取得股票在特定日期的融資融券餘額

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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

取得股票在特定日期的本益比、殖利率及股價淨值比

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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

### `stocks.holders(params)`

取得股票在特定日期的集保分佈

* `params`: {Object}
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
twstock.stocks.holders({ date: '2022-12-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2022-12-30',
//   symbol: '2330',
//   name: '台積電',
//   data: [
//     {
//       level: '1-999',
//       holders: 891264,
//       shares: 166263025,
//       proportion: 0.64
//     },
//     ... more items
//   ]
// }
```

### `stocks.eps(params)`

取得上市櫃股票在特定年度季度每股盈餘

* `params`: {Object}
  * `market`: {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `year`: {number} 年度
  * `quarter`: {number} 季度
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `eps`: {number} 每股盈餘
  * `year`: {number} 年度
  * `quarter`: {number} 季度

```js
twstock.stocks.eps({ market: 'TSE', year: 2023, quarter: 1 })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     symbol: '1101',
//     name: '台泥',
//     eps: 0.2,
//     year: 2023,
//     quarter: 1
//   },
//   ... more items
// ]
```

### `stocks.revenue(params)`

取得上市櫃股票在特定年度月份營業收入

* `params`: {Object}
  * `market`: {string} 按市場別 (`'TSE'` 或 `'OTC'`)
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
twstock.stocks.revenue({ market: 'TSE', year: 2023, month: 1 })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     symbol: '1101',
//     name: '台泥',
//     revenue: 7325221,
//     year: 2023,
//     month: 1
//   },
//   ... more items
// ]
```

### `indices.list(params)`

取得指數列表

* `params`: {Object}
  * `market`: {string} 按市場別篩選指數 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `symbol`: {string} 指數代號
  * `name`: {string} 指數名稱
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
  * `alias`: {string} 代號別稱

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

### `indices.quote(params)`

取得指數即時行情

* `params`: {Object}
  * `market`: {string} 按市場別篩選指數 (`'TSE'` 或 `'OTC'`)
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

取得指數在特定日期的收盤行情

* `params`: {Object}
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

### `indices.trades(params)`

取得指數在特定日期的成交量值

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market` (optional): {string} 按市場別 (`'TSE'` 或 `'OTC'`)
  * `symbol` (optional): {string} 指數代號
* Returns: {Promise} 成功時以 {Object[]} 履行，該陣列包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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
//   exchange: 'TWSE',
//   market: 'TSE',
//   symbol: 'IX0028',
//   name: '半導體類指數',
//   tradeVolume: 770856550,
//   tradeValue: 150024105617,
//   tradeWeight: 42.28
// }
```

### `market.trades(params)`

取得股票市場在特定日期的成交量值

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market`: {string} 市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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
//   exchange: 'TWSE',
//   market: 'TSE',
//   tradeVolume: 6919326963,
//   tradeValue: 354872347181,
//   transaction: 2330770,
//   index: 15493.82,
//   change: 560.89
// }
```

### `market.breadth(params)`

取得股票市場在特定日期的上漲與下跌家數

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market`: {string} 市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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
//   exchange: 'TWSE',
//   market: 'TSE',
//   up: 764,
//   limitUp: 14,
//   down: 132,
//   limitDown: 0,
//   unchanged: 67,
//   unmatched: 1,
//   notApplicable: 4
// }
```

### `market.instTrades(params)`

取得股票市場在特定日期的三大法人買賣超

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market`: {string} 市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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
//   exchange: 'TWSE',
//   market: 'TSE',
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

### `market.marginTrades(params)`

取得股票市場在特定日期的信用交易統計

* `params`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `market`: {string} 市場別 (`'TSE'` 或 `'OTC'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下物件屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 交易所
  * `market`: {string} 市場別
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
//   exchange: 'TWSE',
//   market: 'TSE',
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
