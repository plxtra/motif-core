import { DataIvemAlternateCodes, ZenithProtocolCommon } from '../../../common/internal-api';
import { ZenithMarketAsx } from './zenith-market-asx';

export namespace ZenithMarketAsxConvert {
    export namespace Symbols {
        export namespace Alternates {
            export function toAdi(alternates: ZenithMarketAsx.MarketController.Symbols.Alternates) {
                const result: DataIvemAlternateCodes = {};

                for (const [key, value] of Object.entries(alternates)) {
                    switch (key as keyof ZenithMarketAsx.MarketController.Symbols.Alternates) {
                        case ZenithProtocolCommon.Symbol.KnownAlternateKey.Short: {
                            result.short = value;
                            break;
                        }
                        case ZenithProtocolCommon.Symbol.KnownAlternateKey.Base: {
                            result.base = value;
                            break;
                        }
                        case ZenithProtocolCommon.Symbol.KnownAlternateKey.Long: {
                            result.long = value;
                            break;
                        }
                        case ZenithProtocolCommon.Symbol.KnownAlternateKey.ISIN: {
                            result.isin = value;
                            break;
                        }
                        default:
                            result[key] = value;
                    }
                }
                return result;
            }
        }
    }
}
