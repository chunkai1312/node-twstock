# Changelog

## [1.3.12](https://github.com/chunkai1312/node-twstock/compare/v1.3.11...v1.3.12) (2024-10-24)


### Bug Fixes

* correct field mapping for institutional investors' trades in TPEx stocks ([d5e1906](https://github.com/chunkai1312/node-twstock/commit/d5e1906ab75f302a8c66d231ff7edb3a394d47df))
* update default limit in RateLimitOptions to prevent excessive request frequency ([fc4d7b1](https://github.com/chunkai1312/node-twstock/commit/fc4d7b196bb74925694c0cffb4a5d5711b7b84c4))

## [1.3.11](https://github.com/chunkai1312/node-twstock/compare/v1.3.10...v1.3.11) (2024-10-10)


### Bug Fixes

* add alias for Other Index symbol ([a72673f](https://github.com/chunkai1312/node-twstock/commit/a72673f47fbae13ae0a62accd5a5a232561b57b5))

## [1.3.10](https://github.com/chunkai1312/node-twstock/compare/v1.3.9...v1.3.10) (2024-10-10)


### Bug Fixes

* add alias for Chemical Biotechnology and Medical Care Index ([fb2201f](https://github.com/chunkai1312/node-twstock/commit/fb2201f9af1ea4c1ed86b1a962b2b1718da39c70))

## [1.3.9](https://github.com/chunkai1312/node-twstock/compare/v1.3.8...v1.3.9) (2024-10-10)


### Bug Fixes

* retrieve trades for TPEx Electronic sector ([8c5cdca](https://github.com/chunkai1312/node-twstock/commit/8c5cdca13c9e01fc5dbc6592a12fe14e0ececfe7))

## [1.3.8](https://github.com/chunkai1312/node-twstock/compare/v1.3.7...v1.3.8) (2024-10-10)


### Bug Fixes

* add alias for Other Index symbol ([6f07d53](https://github.com/chunkai1312/node-twstock/commit/6f07d5368c084e2157c99b937c13a57056ed20df))

## [1.3.7](https://github.com/chunkai1312/node-twstock/compare/v1.3.6...v1.3.7) (2024-10-08)


### Bug Fixes

* add alias for TPEx Game Index Index symbol ([36e6c06](https://github.com/chunkai1312/node-twstock/commit/36e6c06af6f818a23edc069f0e47fef83bfdd07d))

## [1.3.6](https://github.com/chunkai1312/node-twstock/compare/v1.3.5...v1.3.6) (2024-10-07)


### Bug Fixes

* add alias for Trading and Consumers' Goods Index symbol ([174b550](https://github.com/chunkai1312/node-twstock/commit/174b550a68ad72bf7077cc70dfdc66d9c915e355))

## [1.3.5](https://github.com/chunkai1312/node-twstock/compare/v1.3.4...v1.3.5) (2024-10-07)


### Bug Fixes

* add alias for Non-Finance Non-Electronics Sub-Index symbol ([a7e4e45](https://github.com/chunkai1312/node-twstock/commit/a7e4e45677253f2ea9f9ca41deaa13a74833055e))

## [1.3.4](https://github.com/chunkai1312/node-twstock/compare/v1.3.3...v1.3.4) (2024-10-07)


### Bug Fixes

* add aliases for parsing index symbols ([923e5b0](https://github.com/chunkai1312/node-twstock/commit/923e5b0fbcbad1c059a35202a564a78149ebdacc))

## [1.3.3](https://github.com/chunkai1312/node-twstock/compare/v1.3.2...v1.3.3) (2024-10-03)

## [1.3.2](https://github.com/chunkai1312/node-twstock/compare/v1.3.1...v1.3.2) (2024-10-03)

## [1.3.1](https://github.com/chunkai1312/node-twstock/compare/v1.3.0...v1.3.1) (2024-10-02)


### Bug Fixes

* include keep-alive header in HTTP GET request for TWSE historical stock data retrieval ([c1c9769](https://github.com/chunkai1312/node-twstock/commit/c1c9769355d74fbbcfbf145b249101f7766e2a6c))

# [1.3.0](https://github.com/chunkai1312/node-twstock/compare/v1.2.2...v1.3.0) (2024-08-09)


### Features

* support for fetching TMF retail investors' position and long short ratio ([5e849ab](https://github.com/chunkai1312/node-twstock/commit/5e849abf7f9bcd40778f948da16abd0c0b523e0e))

## [1.2.2](https://github.com/chunkai1312/node-twstock/compare/v1.2.1...v1.2.2) (2024-07-14)


### Bug Fixes

* add the missing alias index name ([7312c7e](https://github.com/chunkai1312/node-twstock/commit/7312c7eab026951f285725208d1bead3440e980f))

## [1.2.1](https://github.com/chunkai1312/node-twstock/compare/v1.2.0...v1.2.1) (2024-07-14)


### Bug Fixes

* handle datetime errors that occur when fetching futures & options institutional investors' trades ([ec23ad4](https://github.com/chunkai1312/node-twstock/commit/ec23ad47d8c8419c91de4086fb6e35ab59f31e3e))

# [1.2.0](https://github.com/chunkai1312/node-twstock/compare/v1.1.1...v1.2.0) (2024-07-05)


### Features

* support for fetching information on stocks' ex-right, capital reduction, and change of par value ([52adec2](https://github.com/chunkai1312/node-twstock/commit/52adec2f7a57eb1d6d857d1379934d7218744e47))

## [1.1.1](https://github.com/chunkai1312/node-twstock/compare/v1.1.0...v1.1.1) (2024-01-30)


### Bug Fixes

* correct change percent value for futures & options historical data ([232a2be](https://github.com/chunkai1312/node-twstock/commit/232a2beb284d317dec698a7f123c67eeb835c4d2))

# [1.1.0](https://github.com/chunkai1312/node-twstock/compare/v1.0.0...v1.1.0) (2024-01-26)


### Bug Fixes

* correct property name for institutional data ([bdd4a14](https://github.com/chunkai1312/node-twstock/commit/bdd4a14e16b376882f603b3dffb2e9115f765873))


### Features

* support for fetching futures & options historical data by type ([05e59bb](https://github.com/chunkai1312/node-twstock/commit/05e59bbc9dcb89e3495f739afd84289c1c3b5cfb))

# [1.0.0](https://github.com/chunkai1312/node-twstock/compare/v0.14.0...v1.0.0) (2024-01-25)


### Features

* modify class method names, parameter names, and return data formats ([cb83847](https://github.com/chunkai1312/node-twstock/commit/cb83847286909dacc85759f961d018be5347b198))
* support for fetching futures historical data ([6c7bec9](https://github.com/chunkai1312/node-twstock/commit/6c7bec9b5313969d749b8468ff2d5da2ea336787))
* support for fetching futures institutional investors' trades ([c6b93ce](https://github.com/chunkai1312/node-twstock/commit/c6b93ce8d218e65ac6ef859c573e3c8c0a9126b7))
* support for fetching futures large traders' position ([b1a50fc](https://github.com/chunkai1312/node-twstock/commit/b1a50fc189a1209983cbeb24650d731fa518bd5c))
* support for fetching listed stock futures & options ([f5b3f2a](https://github.com/chunkai1312/node-twstock/commit/f5b3f2afecaa5d472fbeb13ba4b689116311f040))
* support for fetching options historical data ([5163c7b](https://github.com/chunkai1312/node-twstock/commit/5163c7b0b5ac5be5b7f20e46f2836c89629bfbe1))
* support for fetching options institutional investors' trades ([7c1d576](https://github.com/chunkai1312/node-twstock/commit/7c1d57621495b598737731bf012656f67aa4d775))
* support for fetching options large traders' position ([726a399](https://github.com/chunkai1312/node-twstock/commit/726a3992a3961b6622f576251841738b588cf1c4))

# [0.14.0](https://github.com/chunkai1312/node-twstock/compare/v0.13.0...v0.14.0) (2024-01-02)


### Features

* support for fetching futures & options realtime quote ([fc5e37f](https://github.com/chunkai1312/node-twstock/commit/fc5e37f45f9a32a8a6dea2db52e8c57c87db3c55))
* support for fetching listed futures & options ([20bb9d7](https://github.com/chunkai1312/node-twstock/commit/20bb9d7a40be1e541c6543dfb849129a2423e891))

# [0.13.0](https://github.com/chunkai1312/node-twstock/compare/v0.12.0...v0.13.0) (2023-12-31)


### Features

* support for fetching OTC stocks short sales ([5f60d09](https://github.com/chunkai1312/node-twstock/commit/5f60d098cdc4a1afa7b4b93cb67434946b5186e8))
* support for fetching TSE stocks short sales ([27c6cd1](https://github.com/chunkai1312/node-twstock/commit/27c6cd1963b4b8bdb785cd4e425fc4fcd247439b))

# [0.12.0](https://github.com/chunkai1312/node-twstock/compare/v0.11.0...v0.12.0) (2023-12-24)


### Features

* support for fetching exchange rates ([e6f6fa8](https://github.com/chunkai1312/node-twstock/commit/e6f6fa8b3bc263f36e8d855e671e0b0d93e048b4))

# [0.11.0](https://github.com/chunkai1312/node-twstock/compare/v0.10.0...v0.11.0) (2023-12-23)


### Features

* support for fetching TXF large traders' position ([672024f](https://github.com/chunkai1312/node-twstock/commit/672024f8ddc1735a0b6714a346bc0bae4fb2a34c))
* support for fetching TXO large traders' position ([6d73544](https://github.com/chunkai1312/node-twstock/commit/6d7354483e4e7df1ce1ce0d8d1322091a3850df5))

# [0.10.0](https://github.com/chunkai1312/node-twstock/compare/v0.9.0...v0.10.0) (2023-12-21)


### Features

* support for fetching MXF institutional investors' trades ([7d174ef](https://github.com/chunkai1312/node-twstock/commit/7d174ef7318b9712256bfcb842a58db9f86246f3))
* support for fetching MXF market open interest ([18b6feb](https://github.com/chunkai1312/node-twstock/commit/18b6febdc45fe0a57c092ab7bfbe3f1089bd3bfd))
* support for fetching MXF retail investors' position and long short ratio ([ad58251](https://github.com/chunkai1312/node-twstock/commit/ad5825138e21928b9cf2923305cc075a824da28d))
* support for fetching TXO Put/Call ratio ([157524d](https://github.com/chunkai1312/node-twstock/commit/157524d306f1f1c7cdd064ace1f84d9590f6e836))

# [0.9.0](https://github.com/chunkai1312/node-twstock/compare/v0.8.0...v0.9.0) (2023-12-20)


### Features

* add support to retrieve futures and options trades information from TAIFEX ([8c9f9ee](https://github.com/chunkai1312/node-twstock/commit/8c9f9eece679d539a3a0d17f0780371752630396))
* support for fetching TXF institutional investors' trades ([171f5dc](https://github.com/chunkai1312/node-twstock/commit/171f5dc93321e4c6f6a2768e029f8b59d2aea152))
* support for fetching TXO institutional investors' trades ([5a2d47b](https://github.com/chunkai1312/node-twstock/commit/5a2d47b72cf3ba98644e51f85075d6223611be91))

# [0.8.0](https://github.com/chunkai1312/node-twstock/compare/v0.7.0...v0.8.0) (2023-12-19)


### Features

* support for fetching stocks monthly revenue ([73a0e64](https://github.com/chunkai1312/node-twstock/commit/73a0e64e5d29debaf9f62e7dc744fa1414f4e774))
* support for fetching stocks quarterly EPS ([36c73e2](https://github.com/chunkai1312/node-twstock/commit/36c73e2578daf4867bbdc1587d0d11547a747410))

# [0.7.0](https://github.com/chunkai1312/node-twstock/compare/v0.6.0...v0.7.0) (2023-12-18)


### Features

* support for fetching the table for spread of shareholdings under TDCC custody ([50fc5c6](https://github.com/chunkai1312/node-twstock/commit/50fc5c69a58077c6282d98701a3798478b8a5b4a))

# [0.6.0](https://github.com/chunkai1312/node-twstock/compare/v0.5.0...v0.6.0) (2023-12-16)


### Features

* add support to retrieve market-level stats ([3fdaacf](https://github.com/chunkai1312/node-twstock/commit/3fdaacfe1fbd4023cd1af9db3c4a82905e875fa4))
* support for fetching OTC indices trades ([f40b13c](https://github.com/chunkai1312/node-twstock/commit/f40b13c1697579b3e23964637ff2eb4d7e936d1c))
* support for fetching OTC market breadth ([67a5b9c](https://github.com/chunkai1312/node-twstock/commit/67a5b9cede92a8ced278220ae3d43f6502b49b72))
* support for fetching OTC market institutional investors' trades ([94174b5](https://github.com/chunkai1312/node-twstock/commit/94174b53646670b6ba222c12cd9f02bb1db9e984))
* support for fetching OTC market margin trades ([f809e64](https://github.com/chunkai1312/node-twstock/commit/f809e64893f74180f8029208a3b6e9f9310dbee0))
* support for fetching OTC market trades ([e765beb](https://github.com/chunkai1312/node-twstock/commit/e765beb0950b324841565e3e46b57741f1e3f9aa))
* support for fetching TSE indices trades ([e9a6db9](https://github.com/chunkai1312/node-twstock/commit/e9a6db9994d5e51937205f91109b2f530cdce7ba))
* support for fetching TSE market breadth ([b955c35](https://github.com/chunkai1312/node-twstock/commit/b955c35a4edc432406bc327da20e6fd59e5f0d32))
* support for fetching TSE market institutional investors' trades ([f429c7d](https://github.com/chunkai1312/node-twstock/commit/f429c7d7dedbcdbde543bfc9b995600da9d992ae))
* support for fetching TSE market margin trades ([3ec4673](https://github.com/chunkai1312/node-twstock/commit/3ec4673a65a295e3f3da0183da1ee03a1a673ecc))
* support for fetching TSE market trades ([7305f50](https://github.com/chunkai1312/node-twstock/commit/7305f507b808f759b54a69c801923f8b4d4b6efa))

# [0.5.0](https://github.com/chunkai1312/node-twstock/compare/v0.4.0...v0.5.0) (2023-12-14)


### Features

* support for fetching OTC stocks FINI holdings ([6182f2f](https://github.com/chunkai1312/node-twstock/commit/6182f2fe71d1d121961f782298bf65dba24ee9d7))
* support for fetching stocks info ([1e3affd](https://github.com/chunkai1312/node-twstock/commit/1e3affdfb38df57fcb75fd5354630a101ddf12ea))
* support for fetching TSE stocks FINI holdings ([e090c19](https://github.com/chunkai1312/node-twstock/commit/e090c19efa5f0ee70dae176fab649fe0a9d9082c))

# [0.4.0](https://github.com/chunkai1312/node-twstock/compare/v0.3.0...v0.4.0) (2023-12-13)


### Features

* support for fetching OTC stocks margin trades ([1e8795b](https://github.com/chunkai1312/node-twstock/commit/1e8795b346285b521e50890b85df949271be9055))
* support for fetching TSE stocks margin trades ([441ac24](https://github.com/chunkai1312/node-twstock/commit/441ac2455634b378bc7d921f59b98cd688bc9617))

# [0.3.0](https://github.com/chunkai1312/node-twstock/compare/v0.2.0...v0.3.0) (2023-12-12)


### Features

* support for fetching OTC stocks values ([db2c396](https://github.com/chunkai1312/node-twstock/commit/db2c396071e7e3bd18b2a4f968a62851c3989854))
* support for fetching TSE stocks values ([a991591](https://github.com/chunkai1312/node-twstock/commit/a991591087c49e39a5d6c2964f4dd0346f237eec))

# [0.2.0](https://github.com/chunkai1312/node-twstock/compare/v0.1.0...v0.2.0) (2023-12-11)


### Features

* support for fetching OTC stocks institutional investors' trades ([73ebb0a](https://github.com/chunkai1312/node-twstock/commit/73ebb0a7404a3f11e8999bb82b5659385e1f41e0))
* support for fetching TSE stocks institutional investors' trades ([c931c7c](https://github.com/chunkai1312/node-twstock/commit/c931c7c1212b2627418373702fee302efbb8bb5b))

# 0.1.0 (2023-12-08)


### Features

* provide TwStock client to retrieve stocks & indices data ([bae1175](https://github.com/chunkai1312/node-twstock/commit/bae1175239f65cf92567afeb6876e6d8a8d03283))
* support for fetching indices realtime quote ([2bddcd7](https://github.com/chunkai1312/node-twstock/commit/2bddcd79ed2285abab8e331bd12be80b9b9efccd))
* support for fetching listed indices ([de31cc2](https://github.com/chunkai1312/node-twstock/commit/de31cc29acc0cb8e5bb3937cb2ef8ca0e51999b1))
* support for fetching listed stocks ([b88d92c](https://github.com/chunkai1312/node-twstock/commit/b88d92c7b2cdf6cddbde4b2f217d1ee06044d1cb))
* support for fetching OTC indices historical data ([22d239f](https://github.com/chunkai1312/node-twstock/commit/22d239f640c4c4b4e5a136c671dd2f1d28d10be2))
* support for fetching OTC stocks historical data ([513aa2e](https://github.com/chunkai1312/node-twstock/commit/513aa2e2b8d2c18ef37b128af184fa250375cad5))
* support for fetching stocks realtime quote ([c34c0c0](https://github.com/chunkai1312/node-twstock/commit/c34c0c0e63588d23871cbe575d173b8e7ebd1c03))
* support for fetching TSE indices historical data ([a84a8ef](https://github.com/chunkai1312/node-twstock/commit/a84a8ef74151db6e41ed52518e714ca557c94cc5))
* support for fetching TSE stocks historical data ([04b3872](https://github.com/chunkai1312/node-twstock/commit/04b3872dbed63dd7a485525dd3eb730d21ef4ed9))