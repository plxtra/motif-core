import { DataIvemAlternateCodes, ZenithProtocolCommon } from '../../../common/internal-api';
import { ZenithMarketPtx } from './zenith-market-ptx';

export namespace ZenithMarketPtxConvert {
    export namespace Symbols {
        export namespace Alternates {
            export function toAdi(alternates: ZenithMarketPtx.MarketController.Symbols.Alternates) {
                const result: DataIvemAlternateCodes = {};

                for (const [key, value] of Object.entries(alternates)) {
                    switch (key as keyof ZenithMarketPtx.MarketController.Symbols.Alternates) {
                        case ZenithProtocolCommon.Symbol.KnownAlternateKey.UID: {
                            // result.uid = value; // not currently used
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
