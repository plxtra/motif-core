import { ZenithProtocolCommon } from '../../../common/internal-api';
import { ZenithProtocol } from './protocol/zenith-protocol';

export namespace ZenithMarketPtx {
    export namespace MarketController {
        export namespace Symbols {
            // These are the possible values in the Symbol Categories field
            // These are not relevant to the Category Attribute below
            export const enum CategoryCode {
            }

            export interface Attributes extends ZenithProtocol.MarketController.SearchSymbols.Attributes {
            }

            export namespace Attributes {
            }

            export type Alternates = Pick<
                ZenithProtocol.MarketController.SearchSymbols.Alternates,
                ZenithProtocolCommon.Symbol.KnownAlternateKey.UID
            >;
        }
    }
}
