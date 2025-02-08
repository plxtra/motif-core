
// interface TypeMap {
//     Data: DataMarket,
//     Trading: TradingMarket,
// }

// export type MarketTypeMap<T extends Market> = {
//     [id in keyof TypeMap]: (value: T) => T;
// }

// export namespace MarketTypeMap {
//     function getMarketTypeMap<T extends Market>(): MarketTypeMap<T> {
//         const marketTypeMap: MarketTypeMap<T> = {
//             Data: (value: DataMarket) => value,
//             Trading: (value: TradingMarket) => value,
//         }
//         return marketTypeMap;
//     }
//     export function getMarket<T extends Market, K extends keyof TypeMap>(type: K, value: TypeMap[K]): T {
//         const marketTypeMap = getMarketTypeMap();
//         return marketTypeMap[type];
//     }
// }
