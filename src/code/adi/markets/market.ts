import { CommaText, compareString, compareUndefinableNumber, ComparisonResult } from '@xilytix/sysutils';
import { ZenithEnvironmentedValueParts } from '../common/internal-api';
// eslint-disable-next-line import/no-cycle
import { Exchange } from './exchange';
// eslint-disable-next-line import/no-cycle
import { ExchangeEnvironment } from './exchange-environment';

export abstract class Market {
    readonly unenvironmentedZenithCode: string; // does not include environment
    readonly mapKey: string;
    readonly upperDisplay: string;

    private _destroyed = false;

    private _exchangeEnvironmentIsDefault: boolean;
    private _symbologyCode: string;
    private _upperSymbologyCode: string;
    private _symbologyExchangeSuffixCode: string;
    private _upperSymbologyExchangeSuffixCode: string;
    private _symbologySupportedExchanges: readonly Exchange[];

    constructor(
        readonly typeId: Market.TypeId,
        readonly zenithCode: string,
        readonly name: string,
        readonly display: string,
        readonly exchange: Exchange,
        readonly exchangeEnvironment: ExchangeEnvironment,
        readonly lit: boolean,
        readonly displayPriority: number | undefined,
        readonly unknown: boolean,
    ) {
        this.unenvironmentedZenithCode = ZenithEnvironmentedValueParts.getValueFromString(zenithCode);
        this.mapKey = zenithCode;
        this.upperDisplay = display.toUpperCase();
    }

    get destroyed(): boolean { return this._destroyed; }

    get zenithExchangeCode(): string { return this.exchange.unenvironmentedZenithCode; }
    get zenithExchangeEnvironmentCode() { return this.exchangeEnvironment.zenithCode; }

    get exchangeEnvironmentIsDefault() { return this._exchangeEnvironmentIsDefault; }
    get symbologyCode(): string { return this._symbologyCode; }
    get upperSymbologyCode(): string { return this._upperSymbologyCode; }
    get symbologyExchangeSuffixCode(): string { return this._symbologyExchangeSuffixCode; }
    get upperSymbologyExchangeSuffixCode(): string { return this._upperSymbologyExchangeSuffixCode; }
    get symbologySupportedExchanges(): readonly Exchange[] { return this._symbologySupportedExchanges; }

    destroy() {
        if (!this._destroyed) {
            this._destroyed = true;
        }
    }

    setExchangeEnvironmentIsDefault(value: boolean) {
        this._exchangeEnvironmentIsDefault = value;
    }

    setSymbologyExchangeSuffixCode(value: string) {
        this._symbologyExchangeSuffixCode = value;
        this._upperSymbologyExchangeSuffixCode = value.toUpperCase();
        // Due to dependencies between exchange and DataMarket, we need to set symbologyCode in 2 places to handle scenario where Exchanges and Data/TradingMarkets are loaded at same time
        // and scenario where Data/TradingMarket is received at a later time.
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this.exchange.symbologyCode !== undefined) {
            this.processExchangeSymbologyCodeSet();
        }
    }

    processExchangeSymbologyCodeSet() {
        const symbologyCode = `${this.exchange.symbologyCode}${this._symbologyExchangeSuffixCode}`;
        this._symbologyCode = symbologyCode;
        this._upperSymbologyCode = symbologyCode.toUpperCase();
    }

    setSymbologySupportedExchanges(value: readonly Exchange[]) {
        this._symbologySupportedExchanges = value;
    }

    areExchangeSymbolsSupported(exchange: Exchange): boolean {
        return this._symbologySupportedExchanges.includes(exchange);
    }
}

export namespace Market {
    export const enum TypeId {
        Data,
        Trading,
    }

    export type ComparePropertyToStringFtn = (this: void, market: Market, value: string) => ComparisonResult;

    export function compareByZenithCode(left: Market, right: Market) {
        return compareString(left.zenithCode, right.zenithCode);
    }

    export function compareToZenithCode(market: Market, zenithCode: string) {
        return compareString(market.zenithCode, zenithCode);
    }

    export function compareByUnenvironmentedZenithCode(left: Market, right: Market) {
        return compareString(left.unenvironmentedZenithCode, right.unenvironmentedZenithCode);
    }

    export function compareToUnenvironmentedZenithCode(market: Market, unenvironmentedZenithCode: string) {
        return compareString(market.unenvironmentedZenithCode, unenvironmentedZenithCode);
    }

    export function compareByDisplayPriority(left: Market, right: Market) {
        return compareUndefinableNumber(left.displayPriority, right.displayPriority, true);
    }

    export function arrayToZenithCodesCommaText(markets: readonly Market[]) {
        const count = markets.length;
        const displays = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const market = markets[i];
            displays[i] = market.zenithCode;
        }
        return CommaText.fromStringArray(displays);
    }

    export function arrayToDisplaysCommaText(markets: readonly Market[]) {
        const count = markets.length;
        const displays = new Array<string>(count);
        for (let i = 0; i < count; i++) {
            const market = markets[i];
            displays[i] = market.display;
        }
        return CommaText.fromStringArray(displays);
    }
}
