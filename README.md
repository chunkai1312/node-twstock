# node-twstock

[![NPM version][npm-image]][npm-url]
[![Build Status][action-image]][action-url]
[![Coverage Status][codecov-image]][codecov-url]

> A client library for scraping Taiwan stock market data

專為擷取台灣股市資料而設計的客戶端程式庫。使用前請務必詳細閱讀相關的 [使用規範與聲明](#disclaimer)。

## Table of Contents

* [Installation](#installation)
* [Usage](#usage)
* [API](#api)
  * [new TwStock([options])](#new-twstockoptions)
  * [.stocks.list([options])](#stockslistoptions)
  * [.stocks.quote(options)](#stocksquoteoptions)
  * [.stocks.historical(options)](#stockshistoricaloptions)
  * [.stocks.institutional(options)](#stocksinstitutionaloptions)
  * [.stocks.finiHoldings(options)](#stocksfiniholdingsoptions)
  * [.stocks.marginTrades(options)](#stocksmargintradesoptions)
  * [.stocks.shortSales(options)](#stocksshortsalesoptions)
  * [.stocks.values(options)](#stocksvaluesoptions)
  * [.stocks.shareholders(options)](#stocksshareholdersoptions)
  * [.stocks.eps(options)](#stocksepsoptions)
  * [.stocks.revenue(options)](#stocksrevenueoptions)
  * [.stocks.dividends(options)](#stocksdividendsoptions)
  * [.stocks.capitalReduction(options)](#stockscapitalreductionoptions)
  * [.stocks.splits(options)](#stockssplitsoptions)
  * [.indices.list([options])](#indiceslistoptions)
  * [.indices.quote(options)](#indicesquoteoptions)
  * [.indices.historical(options)](#indiceshistoricaloptions)
  * [.indices.trades(options)](#indicestradesoptions)
  * [.market.trades(options)](#markettradesoptions)
  * [.market.breadth(options)](#marketbreadthoptions)
  * [.market.institutional(options)](#marketinstitutionaloptions)
  * [.market.marginTrades(options)](#marketmargintradesoptions)
  * [.futopt.list(options)](#futoptlist)
  * [.futopt.quote(options)](#futoptquoteoptions)
  * [.futopt.historical(options)](#futopthistoricaloptions)
  * [.futopt.institutional(options)](#futoptinstitutionaloptions)
  * [.futopt.largeTraders(options)](#futoptlargetradersoptions)
  * [.futopt.mxfRetailPosition(options)](#futoptmxfretailpositionoptions)
  * [.futopt.tmfRetailPosition(options)](#futopttmfretailpositionoptions)
  * [.futopt.txoPutCallRatio(options)](#futopttxoputcallratiooptions)
  * [.futopt.exchangeRates(options)](#futoptexchangeratesoptions)
* [Disclaimer](#disclaimer)
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
  - `limit`: 在 TTL 限制內的最大請求數。**Default:** `1`

> 注意：過於頻繁的請求可能導致被交易所禁止訪問。預設設定為每 5 秒最多發送 1 個請求。

```js
const twstock = new TwStock({ ttl: 5000, limit: 3 });
```

### `.stocks.list([options])`

取得上市(櫃)股票列表。

* `options`: {Object}
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `exchange`: {string} 市場別
  * `type`: {string} 有價證券別
  * `industry`: {string} 產業別 (參閱 [產業別代碼](#產業別代碼))
  * `listedDate`: {string} 上市(櫃)日期

```js
twstock.stocks.list({ exchange: 'TWSE' })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     symbol: '0050',
//     name: '元大台灣50',
//     exchange: 'TWSE',
//     type: 'ETF',
//     industry: '00',
//     listedDate: '2003-06-30'
//   },
//   ... more items
// ]
```

#### 產業別代碼

| 代碼 | 產業別 | 代碼	| 產業別 | 代碼 | 產業別 |
|:---:|-----|:---:|-----|:-----:|-----|
| 01 | 水泥工業 | 16	| 觀光餐旅 | 29 | 電子通路業 |
| 02 | 食品工業 | 17	| 金融保險 | 30 | 資訊服務業 |
| 03 | 塑膠工業 | 18	| 貿易百貨 | 31 | 其他電子業 |
| 04 | 紡織纖維 | 19	| 綜合 | 32 | 文化創意業 |
| 05 | 電機機械 | 20	| 其他 | 33 | 農業科技業 |
| 06 | 電器電纜 | 21	| 化學工業 | 34 | 電子商務 |
| 08 | 玻璃陶瓷 | 22	| 生技醫療業 | 35 | 綠能環保 |
| 09 | 造紙工業 | 23	| 油電燃氣業 | 36 | 數位雲端 |
| 10 | 鋼鐵工業 | 24	| 半導體業 | 37 | 運動休閒 |
| 11 | 橡膠工業 | 25	| 電腦及週邊設備業 | 38 | 居家生活 |
| 12 | 汽車工業 | 26	| 光電業 | 
| 14 | 建材營造 | 27	| 通信網路業 |
| 15 | 航運業 | 28	| 電子零組件業 |		

### `.stocks.quote(options)`

取得股票行情報價。

* `options`: {Object}
  * `symbol`: {string} 股票代號
  * `odd` (optional): {boolean} 盤中零股交易
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
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
  * `bidPrice`: {number[]} 最佳委買價格
  * `askPrice`: {number[]} 最佳委賣價格
  * `bidSize`: {number[]} 最佳委買數量
  * `askSize`: {number[]} 最佳委賣數量
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
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
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

### `.stocks.institutional(options)`

取得股票在特定日期的三大法人買賣超。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `institutional`: {Object[]} 三大法人買賣金額統計，其中 `Object` 包含以下屬性：
    * `investor`: {number} 單位名稱
    * `totalBuy`: {number} 買進金額
    * `totalSell`: {number} 賣出金額
    * `difference`: {number} 買賣差額

```js
twstock.stocks.institutional({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   symbol: '2330',
//   exchange: 'TWSE',
//   name: '台積電',
//   institutional: [
//     {
//       investor: '外資及陸資(不含外資自營商)',
//       totalBuy: 133236588,
//       totalSell: 52595539,
//       difference: 80641049
//     },
//     {
//       investor: '外資自營商',
//       totalBuy: 0,
//       totalSell: 0,
//       difference: 0
//     },
//     {
//       investor: '外資自營商',
//       totalBuy: 0,
//       totalSell: 0,
//       difference: 0
//     },
//     {
//       investor: '投信',
//       totalBuy: 1032000,
//       totalSell: 94327,
//       difference: 937673
//     },
//     {
//       investor: '自營商',
//       difference: 880408
//     },
//     {
//       investor: '自營商(自行買賣)',
//       totalBuy: 978000,
//       totalSell: 537000,
//       difference: 441000
//     },
//     {
//       investor: '自營商(避險)',
//       totalBuy: 1227511,
//       totalSell: 788103,
//       difference: 439408
//     },
//     {
//       investor: '三大法人',
//       difference: 82459130
//     }
//   ]
// }
```

### `.stocks.finiHoldings(options)`

取得股票在特定日期的外資持股比例。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
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
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
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
  * `note`: {string} 備註 (參閱 [融資融券符號說明](#融資融券符號說明))

#### 融資融券符號說明

| 符號 | 說明 |
|:---:|-----|
| O | 停止融資 |
| X | 停止融券 |
| @ | 融資分配 |
| % | 融券分配 |
| ! | 停止買賣 |

```js
twstock.stocks.marginTrades({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
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
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
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
  * `note`: {string} 備註 (參閱 [融券借券符號說明](#融券借券符號說明))

#### 融券借券符號說明

| 符號 | 說明 |
|:---:|-----|
| X | 停券 |
| Y | 未取得信用交易資格 |
| V | 不得借券交易且無借券餘額停止借券賣出 |
| % | 信用額度分配 |
| Z | 借券賣出餘額已達總量控管標準或初次上市無賣出額度暫停借券賣出 |
| ! | 停止買賣 |

```js
twstock.stocks.shortSales({ date: '2023-01-30', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
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
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[] | Object} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
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
//   date: '2023-01-30',
//   exchange: 'TWSE',
//   symbol: '2330',
//   name: '台積電',
//   peRatio: 15.88,
//   pbRatio: 5.14,
//   dividendYield: 2.03,
//   dividendYear: 2021
// }
```

### `.stocks.shareholders(options)`

取得股票在特定日期的集保分佈。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `symbol`: {string} 股票代號
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `symbol`: {string} 股票代號
  * `shareholders`: {Object[]} 集保分佈資料，其中 `Object` 包含以下屬性：
    * `level`: {string} 持股分級
    * `holders`: {number} 持股人數
    * `shares`: {number} 持股股數
    * `proportion`: {number} 持股比例

#### 持股分級表

| 持股分級 | 說明 |
|---:|-----|
| 1  | 1-999 |
| 2  | 1,000-5,000 |
| 3  | 5,001-10,000 |
| 4  | 10,001-15,000 |
| 5  | 15,001-20,000 |
| 6  | 20,001-30,000 |
| 7  | 30,001-40,000 |
| 8  | 40,001-50,000 |
| 9  | 50,001-100,000 |
| 10 | 100,001-200,000 |
| 11 | 200,001-400,000 |
| 12 | 400,001-600,000 |
| 13 | 600,001-800,000 |
| 14 | 800,001-1,000,000 |
| 15 | 1,000,001以上 |
| 16 | 差異數調整 |
| 17 | 合 計 |

```js
twstock.stocks.shareholders({ date: '2023-12-29', symbol: '2330' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-12-29',
//   symbol: '2330',
//   name: '台積電',
//   shareholders: [
//     {
//       level: 1,
//       holders: 731332,
//       shares: 136341404,
//       proportion: 0.52
//     },
//     ... more items
//   ]
// }
```

### `.stocks.eps(options)`

取得上市(櫃)股票在特定年度季度每股盈餘。

* `options`: {Object}
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
  * `year`: {number} 年度
  * `quarter`: {number} 季度
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `exchange`: {string} 市場別
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
//   exchange: 'TWSE',
//   symbol: '2330',
//   name: '台積電',
//   eps: 7.98,
//   year: 2023,
//   quarter: 1
// }
```

### `.stocks.revenue(options)`

取得上市(櫃)股票在特定年度月份營業收入。

* `options`: {Object}
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
  * `year`: {number} 年度
  * `month`: {number} 月份
  * `foreign` (optional): {boolean} 外國公司股票
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `exchange`: {string} 市場別
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
//   exchange: 'TWSE',
//   symbol: '2330',
//   name: '台積電',
//   revenue: 200050544,
//   year: 2023,
//   month: 1
// }
```

### `.stocks.dividends(options)`

取得上市(櫃)股票在特定期間的除權除息資料。

* `options`: {Object}
  * `startDate`: {string} 開始日期 (`'YYYY-MM-DD'`)
  * `endDate`: {string} 結束日期 (`'YYYY-MM-DD'`)
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 資料日期
  * `exchange`: {string} 市場別
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `previousClose`: {number} 除權息前收盤價
  * `referencePrice`: {number} 除權息參考價
  * `dividend`: {number} 權值+息值
  * `dividendType`: {string} 權/息
  * `limitUpPrice`: {number} 漲停價格
  * `limitDownPrice`: {number} 跌停價格
  * `openingReferencePrice`: {number} 開盤競價基準
  * `exdividendReferencePrice`: {number} 減除股利參考價
  * `cashDividend`: {number} 現金股利
  * `stockDividendShares`: {number} 每仟股無償配股

```js
twstock.stocks.dividends({ startDate: '2023-01-01', endDate: '2023-01-31', symbol: '0050' })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     date: '2023-01-30',
//     exchange: 'TWSE',
//     symbol: '0050',
//     name: '元大台灣50',
//     previousClose: 118.1,
//     referencePrice: 115.5,
//     dividend: 2.6,
//     dividendType: '息',
//     limitUpPrice: 127.05,
//     limitDownPrice: 103.95,
//     openingReferencePrice: 115.5,
//     exdividendReferencePrice: 115.5,
//     cashDividend: 2.6,
//     stockDividendShares: 0
//   }
// ]
```

### `.stocks.capitalReduction(options)`

取得上市(櫃)股票在特定期間的普通股減資資料。

* `options`: {Object}
  * `startDate`: {string} 開始日期 (`'YYYY-MM-DD'`)
  * `endDate`: {string} 結束日期 (`'YYYY-MM-DD'`)
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `resumeDate`: {string} 恢復買賣日期
  * `exchange`: {string} 市場別
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `previousClose`: {number} 停止買賣前收盤價格
  * `referencePrice`: {number} 恢復買賣參考價
  * `limitUpPrice`: {number} 漲停價格
  * `limitDownPrice`: {number} 跌停價格
  * `openingReferencePrice`: {number} 開盤競價基準
  * `exrightReferencePrice`: {number} 除權參考價
  * `reason`: {string} 減資原因
  * `haltDate`: {string} 停止買賣日期
  * `sharesPerThousand`: {number} 每壹仟股換發新股票
  * `refundPerShare`: {number} 每股退還股款

```js
twstock.stocks.capitalReduction({ startDate: '2023-02-01', endDate: '2023-02-28', exchange: 'TWSE' })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     resumeDate: '2023-02-17',
//     exchange: 'TWSE',
//     symbol: '2321',
//     name: '東訊',
//     previousClose: 6.38,
//     referencePrice: 19.93,
//     limitUpPrice: 21.9,
//     limitDownPrice: 17.95,
//     openingReferencePrice: 19.95,
//     exrightReferencePrice: null,
//     reason: '彌補虧損',
//     haltDate: '2023-02-09',
//     sharesPerThousand: 320,
//     refundPerShare: 0
//   }
// ]
```

### `.stocks.splits(options)`

取得上市(櫃)股票在特定期間的變更股票面額資料。

* `options`: {Object}
  * `startDate`: {string} 開始日期 (`'YYYY-MM-DD'`)
  * `endDate`: {string} 結束日期 (`'YYYY-MM-DD'`)
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 股票代號
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `resumeDate`: {string} 恢復買賣日期
  * `exchange`: {string} 市場別
  * `symbol`: {string} 股票代號
  * `name`: {string} 股票名稱
  * `previousClose`: {number} 停止買賣前收盤價格
  * `referencePrice`: {number} 恢復買賣參考價
  * `limitUpPrice`: {number} 漲停價格
  * `limitDownPrice`: {number} 跌停價格
  * `openingReferencePrice`: {number} 開盤競價基準

```js
twstock.stocks.splits({ startDate: '2022-07-01', endDate: '2022-07-31', exchange: 'TWSE' })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     resumeDate: '2022-07-13',
//     exchange: 'TWSE',
//     symbol: '6415',
//     name: '矽力-KY',
//     previousClose: 2485,
//     referencePrice: 621.25,
//     limitUpPrice: 683,
//     limitDownPrice: 560,
//     openingReferencePrice: 621
//   }
// ]
```

### `.indices.list([options])`

取得上市(櫃)指數列表。

* `options`: {Object}
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `symbol`: {string} 指數代號
  * `name`: {string} 指數名稱
  * `exchange`: {string} 市場別

```js
twstock.indices.list({ exchange: 'TWSE' })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     symbol: 'IX0001',
//     name: '發行量加權股價指數',
//     exchange: 'TWSE'
//   },
//   ... more items
// ]
```

### `.indices.quote(options)`

取得指數行情報價。

* `options`: {Object}
  * `symbol`: {string} 指數代號
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
  * `symbol`: {string} 指數代號
  * `name`: {string} 指數名稱
  * `open`: {number} 開盤價
  * `high`: {number} 最高價
  * `low`: {number} 最低價
  * `close`: {number} 收盤價
  * `volume`: {number} 成交金額(十萬元)
  * `lastUpdated`: {number} 最後更新時間

```js
twstock.indices.quote({ symbol: 'IX0001' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-12-29',
//   exchange: 'TWSE',
//   symbol: 'IX0001',
//   name: '發行量加權股價指數',
//   previousClose: 17910.37,
//   open: 17893.63,
//   high: 17945.7,
//   low: 17864.23,
//   close: 17930.81,
//   volume: 267204,
//   lastUpdated: 1703827980000,
// }
```

### `.indices.historical(options)`

取得指數在特定日期的收盤行情。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 指數代號
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
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
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
  * `symbol` (optional): {string} 指數代號
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
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
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
  * `tradeVolume`: {number} 成交股數
  * `tradeValue`: {number} 成交金額
  * `transaction`: {number} 成交筆數
  * `index`: {number} 大盤指數
  * `change`: {number} 指數漲跌

```js
twstock.market.trades({ date: '2023-01-30', exchange: 'TWSE' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
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
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
  * `up`: {number} 上漲家數
  * `limitUp`: {number} 漲停家數
  * `down`: {number} 下跌家數
  * `limitDown`: {number} 跌停家數
  * `unchanged`: {number} 平盤家數
  * `unmatched`: {number} 未成交家數
  * `notApplicable`: {number} 無比價家數

```js
twstock.market.breadth({ date: '2023-01-30', exchange: 'TWSE' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
//   up: 764,
//   limitUp: 14,
//   down: 132,
//   limitDown: 0,
//   unchanged: 67,
//   unmatched: 1,
//   notApplicable: 4
// }
```

### `.market.institutional(options)`

取得股票市場在特定日期的三大法人買賣超。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
  * `institutional`: {Object[]} 三大法人買賣金額統計，其中 `Object` 包含以下屬性：
    * `investor`: {number} 單位名稱
    * `totalBuy`: {number} 買進金額
    * `totalSell`: {number} 賣出金額
    * `difference`: {number} 買賣差額
  
```js
twstock.market.institutional({ date: '2023-01-30', exchange: 'TWSE' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
//   institutional: [
//     {
//       investor: '自營商(自行買賣)',
//       totalBuy: 4736295878,
//       totalSell: 1917624556,
//       difference: 2818671322
//     },
//     {
//       investor: '自營商(避險)',
//       totalBuy: 11451095424,
//       totalSell: 6481456459,
//       difference: 4969638965
//     },
//     {
//       investor: '投信',
//       totalBuy: 6269087553,
//       totalSell: 3179424632,
//       difference: 3089662921
//     },
//     {
//       investor: '外資及陸資(不含外資自營商)',
//       totalBuy: 203744063563,
//       totalSell: 131488377272,
//       difference: 72255686291
//     },
//     {
//       investor: '外資自營商',
//       totalBuy: 24864200,
//       totalSell: 61653250,
//       difference: -36789050
//     },
//     {
//       investor: '三大法人',
//       totalBuy: 226200542418,
//       totalSell: 143066882919,
//       difference: 83133659499
//     }
//   ]
// }
```

### `.market.marginTrades(options)`

取得股票市場在特定日期的信用交易統計。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `exchange` (optional): {string} 市場別 (`'TWSE'`：上市；`'TPEx'`：上櫃)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
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
twstock.market.marginTrades({ date: '2023-01-30', exchange: 'TWSE' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TWSE',
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

### `.futopt.list()`

取得期貨與選擇權商品(契約)列表。

* `options`: {Object}
  * `type`: {string} 類別 (`'F'`：期貨；`'O'`：選擇權)
  * `availableContracts`: {boolean} 列出可用契約
* Returns: {Promise} 成功時以 {Object[]} 履行，其中 `Object` 包含以下屬性：
  * `symbol`: {string} 商品(契約)代號
  * `name`: {string} 商品(契約)名稱
  * `exchange`: {string} 市場別
  * `type`: {string} 商品(契約)類別
  * `listedDate`: {string} 上市日期

```js
twstock.futopt.list({ type: 'F' })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     symbol: 'TXF',
//     name: '臺指期',
//     exchange: 'TAIFEX',
//     type: 'F',
//   },
//   ... more items
// ]
```

### `.futopt.quote(options)`

取得期貨與選擇權契約行情報價。

* `options`: {Object}
  * `symbol`: {string} 契約代號
  * `afterhours` (optional): {boolean} 盤後交易
* Returns: {Promise} 成功時以 {Object | Object[]} 履行，其中包含以下屬性：
  * `symbol`: {string} 契約代號
  * `name`: {string} 契約名稱
  * `status`: {string} 狀態 (`'TC'`：收盤)
  * `referencePrice`: {number} 參考價
  * `limitUpPrice`: {number} 漲停價
  * `limitDownPrice`: {number} 跌停價
  * `openPrice`: {number} 開盤價
  * `highPrice`: {number} 最高價
  * `lowPrice`: {number} 最低價
  * `lastPrice`: {number} 成交價
  * `lastSize`: {number} 單量
  * `testPrice`: {number} 試撮價
  * `testSize`: {number} 試撮量
  * `testTime`: {number} 試撮時間
  * `totalVoluem`: {number} 成交量
  * `openInterest`: {number} 未平倉量
  * `bidOrders`: {number} 委買筆數
  * `askOrders`: {number} 委賣筆數
  * `bidVolume`: {number} 委買口數
  * `askVolume`: {number} 委賣口數
  * `bidPrice`: {number[]} 最佳委買價格
  * `askPrice`: {number[]} 最佳委賣價格
  * `bidSize`: {number[]} 最佳委買數量
  * `askSize`: {number[]} 最佳委賣數量
  * `extBidPrice`: {number} 最佳衍生一檔買價
  * `extAskPrice`: {number} 最佳衍生一檔賣價
  * `extBidSize`: {number} 最佳衍生一檔買量
  * `extAskSize`: {number} 最佳衍生一檔賣量
  * `lastUpdated`: {number} 最後更新時間

```js
twstock.futopt.quote({ symbol: 'TXFA4' })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     symbol: 'TXF',
//     name: '臺指現貨',
//     status: 'TC',
//     openPrice: 17894.83,
//     highPrice: 18014.26,
//     lowPrice: 17894.83,
//     lastPrice: 18002.62,
//     referencePrice: 17875.83,
//     limitUpPrice: '',
//     limitDownPrice: '',
//     settlementPrice: '',
//     change: 126.79,
//     changePercent: 0.71,
//     amplitude: 0.67,
//     totalVoluem: '',
//     openInterest: '',
//     bestBidPrice: '',
//     bestAskPrice: '',
//     bestBidSize: '',
//     bestAskSize: '',
//     testPrice: '',
//     testSize: '',
//     lastUpdated: 1706160795000
//   },
//   ... more items
// ]
```

### `.futopt.historical(options)`

取得期貨與選擇權契約在特定日期的收盤行情。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `type` (optional): {string} 類別 (`'F'`：期貨；`'O'`：選擇權)
  * `symbol` (optional): {string} 契約代號
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
  * `symbol`: {string} 契約代號
  * `contractMonth`: {string} 到期月份(週別)
  * `strikePrice`: {number} 履約價
  * `type`: {string} 買賣權
  * `open`: {number} 開盤價
  * `high`: {number} 最高價
  * `low`: {number} 最低價
  * `close`: {number} 收盤價
  * `change`: {number} 漲跌
  * `changePercent`: {number} 漲跌%
  * `volume`: {number} 成交量
  * `settlementPrice`: {number} 結算價
  * `openInterest`: {number} 未沖銷契約量
  * `bestBid`: {number} 最後最佳買價
  * `bestAsk`: {number} 最後最佳賣價
  * `historicalHigh`: {number} 歷史最高價
  * `historicalLow`: {number} 歷史最低價
  * `session`: {number} 交易時段
  * `volumeSpread`: {number} 價差對價差成交量

```js
twstock.futopt.historical({ date: '2023-01-30', symbol: 'TXF' })
  .then(data => console.log(data));
// Prints:
// [
//   {
//     date: '2023-01-30',
//     exchange: 'TAIFEX',
//     symbol: 'TXF',
//     contractMonth: '202301',
//     open: 15558,
//     high: 15559,
//     low: 15364,
//     close: 15451,
//     change: 526,
//     changePercent: 3.52,
//     volume: 45946,
//     settlementPrice: 0,
//     openInterest: 14509,
//     bestBid: 15450,
//     bestAsk: 15451,
//     historicalHigh: 15559,
//     historicalLow: 12631,
//     session: '一般',
//     volumeSpread: null
//   },
//   ... more items
// ]
```

### `.futopt.institutional(options)`

取得期貨與選擇權契約在特定日期的三大法人交易口數、契約金額與未平倉餘額。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `symbol`: {string} 契約代號
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
  * `symbol`: {string} 契約代號
  * `name`: {string} 契約名稱
  * `institutional`: {Object[]} 三大法人交易口數、契約金額與未平倉餘額，其中 `Object` 包含以下屬性：
    * `investor`: {number} 單位名稱
    * `longTradeVolume`: {number} 多方交易口數
    * `longTradeValue`: {number} 多方交易契約金額(千元)
    * `shortTradeVolume`: {number} 空方交易口數
    * `shortTradeValue`: {number} 空方交易契約金額(千元)
    * `netTradeVolume`: {number} 多空交易口數淨額
    * `netTradeValue`: {number} 多空交易契約金額淨額(千元)
    * `longOiVolume`: {number} 多方未平倉口數
    * `longOiValue`: {number} 多方未平倉契約金額(千元)
    * `shortOiVolume`: {number} 空方未平倉口數
    * `shortOiValue`: {number} 空方未平倉契約金額(千元)
    * `netOiVolume`: {number} 多空未平倉口數淨額
    * `netOiValue`: {number} 多空未平倉契約金額淨額(千元) 

```js
twstock.futopt.institutional({ date: '2023-01-30', symbol: 'TXF' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TAIFEX',
//   symbol: 'TXF',
//   name: '臺股期貨',
//   institutional: [
//     {
//       investor: '自營商',
//       longTradeVolume: 14205,
//       longTradeValue: 43588157,
//       shortTradeVolume: 17049,
//       shortTradeValue: 52346096,
//       netTradeVolume: -2844,
//       netTradeValue: -8757939,
//       longOiVolume: 10822,
//       longOiValue: 33446397,
//       shortOiVolume: 5797,
//       shortOiValue: 17917728,
//       netOiVolume: 5025,
//       netOiValue: 15528669
//     },
//     {
//       investor: '投信',
//       longTradeVolume: 2237,
//       longTradeValue: 6907887,
//       shortTradeVolume: 449,
//       shortTradeValue: 1384268,
//       netTradeVolume: 1788,
//       netTradeValue: 5523619,
//       longOiVolume: 10112,
//       longOiValue: 31260237,
//       shortOiVolume: 15995,
//       shortOiValue: 49446943,
//       netOiVolume: -5883,
//       netOiValue: -18186706
//     },
//     {
//       investor: '外資及陸資',
//       longTradeVolume: 61232,
//       longTradeValue: 187462698,
//       shortTradeVolume: 60146,
//       shortTradeValue: 184303292,
//       netTradeVolume: 1086,
//       netTradeValue: 3159406,
//       longOiVolume: 32100,
//       longOiValue: 99233073,
//       shortOiVolume: 24001,
//       shortOiValue: 74192341,
//       netOiVolume: 8099,
//       netOiValue: 25040732
//     }
//   ]
// }
```

### `.futopt.largeTraders(options)`

取得期貨與選擇權契約在特定日期的大額交易人未沖銷部位。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
  * `symbol`: {string} 契約代號
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `exchange`: {string} 市場別
  * `symbol`: {string} 契約代號
  * `name`: {string} 契約名稱
  * `largeTraders`: {Object} 大額交易人未沖銷部位
    * `type`: {string} 買賣權
    * `contractMonth`: {string} 到期月份(週別) (`'666666'`：週契約；`'999999'`：所有契約)
    * `traderType`: {string} 交易人類別 (`'0'`：大額交易人；`'1'`：特定法人)
    * `topFiveLongOi`: {number} 前五大交易人買方部位數
    * `topFiveShortOi`: {number} 前五大交易人賣方部位數
    * `topTenLongOi`: {number} 前十大交易人買方部位數
    * `topTenShortOi`: {number} 前十大交易人賣方部位數
    * `marketOi`: {number} 全市場未沖銷部位數

```js
twstock.futopt.largeTraders({ date: '2023-01-30', symbol: 'TXF' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2023-01-30',
//   exchange: 'TAIFEX',
//   symbol: 'TXF',
//   name: '臺股期貨(TX+MTX/4)',
//   largeTraders: [
//     {
//       contractMonth: '666666',
//       traderType: '0',
//       topFiveLongOi: 33,
//       topFiveShortOi: 40,
//       topTenLongOi: 43,
//       topTenShortOi: 42,
//       marketOi: 48
//     },
//     {
//       contractMonth: '666666',
//       traderType: '1',
//       topFiveLongOi: 5,
//       topFiveShortOi: 2,
//       topTenLongOi: 5,
//       topTenShortOi: 2,
//       marketOi: 48
//     },
//     {
//       contractMonth: '202302',
//       traderType: '0',
//       topFiveLongOi: 30643,
//       topFiveShortOi: 29456,
//       topTenLongOi: 40363,
//       topTenShortOi: 36869,
//       marketOi: 68173
//     },
//     {
//       contractMonth: '202302',
//       traderType: '1',
//       topFiveLongOi: 30643,
//       topFiveShortOi: 29456,
//       topTenLongOi: 38860,
//       topTenShortOi: 34209,
//       marketOi: 68173
//     },
//     {
//       contractMonth: '999999',
//       traderType: '0',
//       topFiveLongOi: 30828,
//       topFiveShortOi: 29523,
//       topTenLongOi: 40572,
//       topTenShortOi: 37209,
//       marketOi: 72437
//     },
//     {
//       contractMonth: '999999',
//       traderType: '1',
//       topFiveLongOi: 30828,
//       topFiveShortOi: 29523,
//       topTenLongOi: 39045,
//       topTenShortOi: 34493,
//       marketOi: 72437
//     }
//   ]
// }
```

### `.futopt.mxfRetailPosition(options)`

取得特定日期的小台散戶部位數及多空比

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `mxfRetailLongOi`: {number} 小台散戶多單
  * `mxfRetailShortOi`: {number} 小台散戶空單
  * `mxfRetailNetOi`: {number} 小台散戶淨部位
  * `mxfRetailLongShortRatio`: {number} 小台散戶多空比
  
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

### `.futopt.tmfRetailPosition(options)`

取得特定日期的微台散戶部位數及多空比

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `tmfRetailLongOi`: {number} 微台散戶多單
  * `tmfRetailShortOi`: {number} 微台散戶空單
  * `tmfRetailNetOi`: {number} 微台散戶淨部位
  * `tmfRetailLongShortRatio`: {number} 微台散戶多空比
  
```js
twstock.futopt.mxfRetailPosition({ date: '2024-07-29' })
  .then(data => console.log(data));
// Prints:
// {
//   date: '2024-07-29',
//   tmfRetailLongOi: 3039,
//   tmfRetailShortOi: 1394,
//   tmfRetailNetOi: 1645,
//   tmfRetailLongShortRatio: 0.5406
// }
```

### `.futopt.txoPutCallRatio(options)`

取得臺指選擇權在特定日期的 Put/Call Ratio。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
  * `date`: {string} 日期
  * `txoPutVolume`: {number} 賣權成交量
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

### `.futopt.exchangeRates(options)`

取得特定日期的外幣參考匯率。

* `options`: {Object}
  * `date`: {string} 日期 (`'YYYY-MM-DD'`)
* Returns: {Promise} 成功時以 {Object} 履行，包含以下屬性：
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

## Disclaimer

- 本程式所取得之資料來源包括 [臺灣證券交易所](https://www.twse.com.tw)、[證券櫃檯買賣中心](https://www.tpex.org.tw)、[臺灣期貨交易所](https://www.taifex.com.tw)、[臺灣集中保管結算所](https://www.tdcc.com.tw)、[公開資訊觀測站](https://mops.twse.com.tw)、[臺灣證券交易所-基本市況報導網站](https://mis.twse.com.tw)、[臺灣期貨交易所行情資訊網](https://mis.taifex.com.tw)。使用者應遵守各資訊來源提供者所定之資訊使用相關規範及智慧財產權相關法令。
- 本程式僅供使用公開數據進行研究之目的，嚴禁任何組織或個人利用該技術進行智慧財產盜竊、破壞網站功能或造成其他損害。對於任何違法行為，由該組織或個人自行承擔責任，作者不負擔任何法律及連帶責任。
- 透過本程式取得之資料僅供參考，若因任何資料之不正確或疏漏所衍生之損害或損失，使用者需自行負責。對於資料內容錯誤、更新延誤或傳輸中斷，本程式不負任何責任。
- 使用者在使用本程式所提供之資訊時，應謹慎評估並自行承擔風險，作者保留隨時修改或更新免責聲明之權利。

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
