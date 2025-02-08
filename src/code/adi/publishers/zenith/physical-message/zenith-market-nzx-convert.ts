import { DataIvemAlternateCodes, ZenithProtocolCommon } from '../../../common/internal-api';
import { ZenithMarketNzx } from './zenith-market-nzx';

export namespace ZenithMarketNzxConvert {
    export namespace Symbols {
        export namespace Alternates {
            export function toAdi(alternates: ZenithMarketNzx.MarketController.Symbols.Alternates) {
                const result: DataIvemAlternateCodes = {};

                for (const [key, value] of Object.entries(alternates)) {
                    switch (key as keyof ZenithMarketNzx.MarketController.Symbols.Alternates) {
                        case ZenithProtocolCommon.Symbol.KnownAlternateKey.Short: {
                            result.short = value;
                            break;
                        }
                        case ZenithProtocolCommon.Symbol.KnownAlternateKey.Base: {
                            result.base = value;
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
