import { CommaText } from '@xilytix/sysutils';
import { ZenithProtocolCommon } from './zenith-protocol-common';

export interface ZenithSymbol {
    readonly code: string;
    readonly marketZenithCode: string;
}

export namespace ZenithSymbol {
    export function createZenithCode(symbol: ZenithSymbol) {
        return createZenithCodeFromDestructured(symbol.code, symbol.marketZenithCode);
    }

    export function createZenithCodeFromDestructured(code: string, marketZenithCode: string) {
        return `${code}${ZenithProtocolCommon.codeMarketSeparator}${marketZenithCode}`;
    }

    export function createDisplay(symbol: ZenithSymbol) {
        return createDisplayFromDestructured(symbol.code, symbol.marketZenithCode);
    }

    export function createDisplayFromDestructured(code: string, marketZenithCode: string) {
        return `${code}.${marketZenithCode}`;
    }

    export function createMapKey(symbol: ZenithSymbol) {
        return createMapKeyFromDestructured(symbol.code, symbol.marketZenithCode);
    }

    export function createMapKeyFromDestructured(code: string, marketZenithCode: string) {
        return CommaText.from2Values(code, marketZenithCode);
    }
}

