import { ZenithProtocol } from './protocol/zenith-protocol';

export namespace ZenithMarketAsx {
    export namespace MarketController {
        export namespace Trades {
            export const enum TradeAttribute {
                ShortSell = 'S',
            }
        }

        export namespace Orders {
            export const enum OrderAttribute {
                PartOfTmcOrder = 'C',
            }
        }

        export namespace Symbols {
            // These are the possible values in the Symbol Categories field
            // These are not relevant to the Category Attribute below
            export const enum CategoryCode {
                Prac = 'PRAC',
            }

            export interface Attributes extends ZenithProtocol.MarketController.SearchSymbols.Attributes {
            }

            export namespace Attributes {
            }

            export type Alternates = Pick<
                ZenithProtocol.MarketController.SearchSymbols.Alternates,
                'Short' | 'Base' | 'Long' | 'ISIN'
            >;
        }
    }
}
