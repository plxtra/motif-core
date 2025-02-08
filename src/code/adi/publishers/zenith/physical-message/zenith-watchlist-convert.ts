import { ZenithSymbol } from '../../../common/internal-api';
import { ZenithConvert } from './zenith-convert';

export namespace ZenithWatchlistConvert {
    export namespace Members {
        export function toZenithSymbols(symbols: readonly string[]) {
            return ZenithConvert.Symbol.toZenithSymbolArray(symbols);
        }

        export function fromZenithSymbols(symbols: readonly ZenithSymbol[]): readonly string[] {
            return ZenithConvert.Symbol.fromZenithSymbolArray(symbols);
        }
    }
}
