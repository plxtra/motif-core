import { StringId, Strings } from '../../res/internal-api';
import {
    ComparableList,
    ComparisonResult,
    EnumInfoOutOfOrderError,
    Err,
    ErrorCode,
    FieldDataTypeId,
    JsonElement,
    JsonElementErr,
    Mappable,
    Ok,
    Result,
    ZenithDataError,
    compareString,
} from '../../sys/internal-api';
import { ZenithSymbol } from '../common/internal-api';
import { DataMarket, Exchange, ExchangeEnvironment, Market, MarketsService } from '../markets/internal-api';
import { IvemId } from './ivem-id';

export abstract class MarketIvemId<T extends Market> implements Mappable, ZenithSymbol {
    readonly mapKey: string;
    readonly marketZenithCode: string;
    readonly exchangeEnvironmentExplicit: boolean;

    constructor(readonly code: string, readonly market: T, forceExchangeEnvironmentExplicit = false) {
        this.marketZenithCode = market.zenithCode;
        this.exchangeEnvironmentExplicit = !market.exchange.isDefaultDefault || forceExchangeEnvironmentExplicit;

        if (code === MarketIvemId.nullCode) {
            this.mapKey = '';
        } else {
            this.mapKey = ZenithSymbol.createMapKeyFromDestructured(code, this.marketZenithCode);
        }
    }

    // get environmentId() { return this._environmentId; }

    // get persistKey() {
    //     if (this._mapKey === undefined) {
    //         this._mapKey = MarketIvemId.generatePersistKey(this);
    //     }
    //     return this._mapKey;
    // }

    // get mapKey() {
    //     if (this._mapKey === undefined) {
    //         this._mapKey = MarketIvemId.createMapKey(this);
    //     }
    //     return this._mapKey;
    // }

    get name(): string {
        return this.code + '@' + this.marketZenithCode;
    }

    get exchange(): Exchange { return this.market.exchange; }

    get exchangeEnvironment(): ExchangeEnvironment { return this.market.exchangeEnvironment; }

    get ivemId() { return new IvemId(this.code, this.exchange); }

    abstract get bestLitDataIvemId(): MarketIvemId<DataMarket> | undefined;

    // get exchangeId(): ExchangeId {
    //     return MarketInfo.idToExchangeId(this.market);
    // }

    // get explicitEnvironmentId() { return this._explicitEnvironmentId; }
    // set explicitEnvironmentId(value: DataEnvironmentId | undefined) {
    //     this.explicitEnvironmentId = value;
    //     if (value === undefined) {
    //         this._environmentId = ExchangeInfo.getDefaultDataEnvironmentId(this.exchangeId);
    //     } else {
    //         this._environmentId = value;
    //     }
    // }

    createZenithSymbol(): ZenithSymbol {
        return {
            code: this.code,
            marketZenithCode: this.marketZenithCode,
        };
    }

    saveToJson(element: JsonElement) {
        element.setString(MarketIvemId.JsonName.Code, this.code);

        const market = this.market; // use getter
        if (this.exchangeEnvironmentExplicit) {
            element.setString(MarketIvemId.JsonName.Market, market.zenithCode);
            element.setBoolean(MarketIvemId.JsonName.EnvironmentSpecified, true);
        } else {
            element.setString(MarketIvemId.JsonName.Market, market.unenvironmentedZenithCode);
        }
    }

    abstract createCopy(): MarketIvemId<T>;
}

export namespace MarketIvemId {
    export type Constructor<T extends Market> = new(code: string, market: T) => MarketIvemId<T>;

    export const nullCode = '';

    export const enum JsonName {
        Code = 'code',
        // eslint-disable-next-line @typescript-eslint/no-shadow
        Market = 'market', // Market ZenithCode
        EnvironmentSpecified = 'environmentSpecified', // Whether the Market ZenithCode specifies the exchange.  Required as Zenith codes without an explicit exchange environment can still implicitly specify production exchange environment
    }

    export interface Json {
        code: string;
        market: string;
        environmentSpecified?: boolean; // If undefined, then: not specified
    }

    // eslint-disable-next-line @typescript-eslint/consistent-indexed-object-style
    // export interface BaseJson {
    //     [name: string]: string;
    // }

    // export interface UnenvironmentedJson extends BaseJson {
    //     code: string;
    //     market: string;
    // }

    // export interface EnvironmentedJson extends BaseJson {
    //     code: string;
    //     market: string;
    //     environment: string;
    // }

    // export type Json = UnenvironmentedJson | EnvironmentedJson;

    // export namespace Json {
    //     export function isEnvironmented(value: Json): value is EnvironmentedJson {
    //         // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    //         return (value as EnvironmentedJson).environment !== undefined;
    //     }
    // }

    export function createUnknown<T extends Market>(unknownMarket: T, constructor: Constructor<T>): MarketIvemId<T> {
        return new constructor(nullCode, unknownMarket);
    }

    export function createMapKey<T extends Market>(marketIvemId: MarketIvemId<T>): string {
        if (marketIvemId.code === nullCode) {
            return '';
        } else {
            return ZenithSymbol.createMapKey(marketIvemId);
        }
    }

    export function isUndefinableEqual<T extends Market>(left: MarketIvemId<T> | undefined, right: MarketIvemId<T> | undefined): boolean {
        if (left === undefined) {
            return right === undefined;
        } else {
            if (right === undefined) {
                return false;
            } else {
                return isEqual(left, right);
            }
        }
    }

    export function isEqual<T extends Market>(left: MarketIvemId<T>, right: MarketIvemId<T>): boolean {
        return (left.code === right.code) && (left.marketZenithCode === right.marketZenithCode);
    }

    export function compare<T extends Market>(left: MarketIvemId<T>, right: MarketIvemId<T>): ComparisonResult {
        let result = compareString(left.code, right.code);
        if (result === ComparisonResult.LeftEqualsRight) {
            result = compareString(left.marketZenithCode, right.marketZenithCode);
        }
        return result;
    }

    export function createFromZenithSymbol<T extends Market>(markets: MarketsService.Markets<T>, zenithSymbol: ZenithSymbol, constructor: Constructor<T>): MarketIvemId<T> {
        const market = markets.getMarketOrUnknown(zenithSymbol.marketZenithCode);
        return new constructor(zenithSymbol.code, market);
    }

    export function createArrayFromZenithSymbols<T extends Market>(
        markets: MarketsService.Markets<T>,
        zenithSymbols: readonly ZenithSymbol[],
        constructor: Constructor<T>,
        includeUnknown = true,
        unknownErrorCode?: ErrorCode,
    ) {
        const symbolCount = zenithSymbols.length;
        const result = new Array<MarketIvemId<T>>(symbolCount);
        let count = 0;
        for (let i = 0; i < symbolCount; i++) {
            const symbol = zenithSymbols[i];
            const code = symbol.code;
            const marketZenithCode = symbol.marketZenithCode;
            const market = markets.getMarketOrUnknown(marketZenithCode);
            if (market.unknown) {
                if (includeUnknown) {
                    result[count++] = new constructor(code, market);
                } else {
                    if (unknownErrorCode !== undefined) {
                        throw new ZenithDataError(unknownErrorCode, ZenithSymbol.createDisplay(symbol));
                    }
                }
            } else {
                result[count++] = new constructor(code, market);
            }
        }

        result.length = count;
        return result;

    }

    export function tryCreateFromJson<T extends Market>(
        markets: MarketsService.Markets<T>,
        element: JsonElement,
        constructor: MarketIvemId.Constructor<T>,
        unknownAllowed: boolean
    ): Result<MarketIvemId<T>> {
        const codeResult = element.tryGetString(JsonName.Code);
        if (codeResult.isErr()) {
            return JsonElementErr.createOuter(codeResult.error, ErrorCode.MarketIvemId_TryCreateFromJsonCodeNotSpecified);
        } else {
            const code = codeResult.value;

            const marketZenithCodeResult = element.tryGetString(JsonName.Market);
            if (marketZenithCodeResult.isErr()) {
                return JsonElementErr.createOuter(marketZenithCodeResult.error, ErrorCode.MarketIvemId_TryCreateFromJsonMarketNotSpecified);
            } else {
                const marketZenithCode = marketZenithCodeResult.value; // may be environmented or not environmented

                const environmentSpecifiedResult = element.tryGetBoolean(JsonName.EnvironmentSpecified);
                let environmentSpecified: boolean;
                if (environmentSpecifiedResult.isErr()) {
                    const errorId = environmentSpecifiedResult.error;
                    if (errorId === JsonElement.ErrorId.JsonValueIsNotDefined) {
                        environmentSpecified = false;
                    } else {
                        return JsonElementErr.createOuter(environmentSpecifiedResult.error, ErrorCode.MarketIvemId_TryCreateFromJsonEnvironmentSpecifiedIsInvalid);
                    }
                } else {
                    environmentSpecified = environmentSpecifiedResult.value;
                }

                let market: T | undefined;
                if (environmentSpecified) {
                    market = markets.tryGetMarket(marketZenithCode, unknownAllowed);
                } else {
                    market = markets.tryGetDefaultEnvironmentMarket(marketZenithCode, unknownAllowed);
                }

                if (market === undefined) {
                    const errorCode = environmentSpecified ?
                        ErrorCode.MarketIvemId_TryCreateFromJsonEnvironmentedMarketIsUnknown :
                        ErrorCode.MarketIvemId_TryCreateFromJsonUnenvironmentedTradingMarketIsUnknown;
                    return new Err(`${errorCode} (${marketZenithCode})`);
                } else {
                    const marketIvemId = new constructor(code, market);
                    return new Ok(marketIvemId);
                }
            }
        }
        // function checkLogConfigError(code: string, text: string, maxTextLength: Integer) {
        //     if (configErrorLoggingActive) {
        //         ErrorCodeLogger.logConfigError(code, text, maxTextLength);
        //     }
        // }

        // const marketJsonValue = json[JsonName.Market];
        // if (marketJsonValue === undefined) {
        //     checkLogConfigError('LIITCFJMU23300192993', JSON.stringify(json), 200);
        //     return undefined;
        // } else {
        //     const marketId = MarketInfo.tryJsonValueToId(marketJsonValue);
        //     if (marketId === undefined) {
        //         checkLogConfigError('LIITCFJM2300192993', JSON.stringify(json), 200);
        //         return undefined;
        //     } else {
        //         const code = json[JsonName.Code];
        //         if (code === undefined || code === '') {
        //             checkLogConfigError('LIITCFJC2300192994', JSON.stringify(json), 200);
        //             return undefined;
        //         } else {
        //             const environmentJsonValue = json[JsonName.Environment];
        //             if (environmentJsonValue === undefined) {
        //                 return new DataIvemId(code, marketId); // no explicit environmentId
        //             } else {
        //                 const explicitEnvironmentId = DataEnvironment.tryJsonToId(environmentJsonValue);
        //                 if (explicitEnvironmentId === undefined) {
        //                     checkLogConfigError('LIITCFJE2300192995', JSON.stringify(json), 200);
        //                     return undefined;
        //                 } else {
        //                     return new DataIvemId(code, marketId, explicitEnvironmentId);
        //                 }
        //             }
        //         }
        //     }
        // }
    }

    export function createJsonElementArray<T extends Market>(marketIvemIds: readonly MarketIvemId<T>[]) {
        const marketIvemIdCount = marketIvemIds.length;
        const marketIvemIdElements = new Array<JsonElement>(marketIvemIdCount);

        for (let i = 0; i < marketIvemIdCount; i++) {
            const marketIvemId = marketIvemIds[i];
            const jsonElement = new JsonElement();
            marketIvemId.saveToJson(jsonElement);
            marketIvemIdElements[i] = jsonElement;
        }
        return marketIvemIdElements;
    }

    export function tryCreateArrayFromJsonElementArray<T extends Market>(
        markets: MarketsService.Markets<T>,
        elements: JsonElement[],
        constructor: MarketIvemId.Constructor<T>,
        unknownMarketAllowed: boolean
    ): Result<MarketIvemId<T>[]> {
        const count = elements.length;
        const marketIvemIds = new Array<MarketIvemId<T>>(count);
        for (let i = 0; i < count; i++) {
            const element = elements[i];
            const marketIvemIdResult = tryCreateFromJson(markets, element, constructor, unknownMarketAllowed);
            if (marketIvemIdResult.isErr()) {
                return marketIvemIdResult.createOuter(`${ErrorCode.MarketIvemId_TryCreateArrayFromJsonElementArray}(${i})`);
            } else {
                marketIvemIds[i] = marketIvemIdResult.value;
            }
        }
        return new Ok(marketIvemIds);
    }

    // export function arrayToJson(arrayValue: DataIvemId[]) {
    //     const count = arrayValue.length;
    //     const jsonArray = new Array<Json>(count);
    //     for (let i = 0; i < count; i++) {
    //         jsonArray[i] = arrayValue[i].saveToJson();
    //     }

    //     return jsonArray;
    // }

    // export function tryCreateArrayFromJson(jsonArray: Json[], configErrorLoggingActive = true) {
    //     const count = jsonArray.length;
    //     const resultArray = new Array<DataIvemId>(count);
    //     for (let I = 0; I < count; I++) {
    //         const dataIvemId = tryCreateFromJson(jsonArray[I], configErrorLoggingActive);
    //         if (dataIvemId === undefined) {
    //             return undefined;
    //         } else {
    //             resultArray[I] = dataIvemId;
    //         }
    //     }

    //     return resultArray;
    // }

    export class List<T extends Market> extends ComparableList<MarketIvemId<T>> {
        constructor() {
            super(List.compareItems);
        }
    }

    export namespace List {
        export function compareItems<T extends Market>(left: MarketIvemId<T>, right: MarketIvemId<T>) {
            return compare(left, right);
        }
    }

    // export function tryGetFromJsonElement(element: JsonElement, name: string, context?: string): DataIvemId | undefined {
    //     const jsonValue = element.tryGetNativeObject(name);
    //     if (jsonValue === undefined || jsonValue === null) {
    //         return undefined;
    //     } else {
    //         if (typeof (jsonValue) !== 'object' || Array.isArray(jsonValue)) {
    //             const errorText = JsonElement.generateGetErrorText(StringId.DataIvemIdNotJsonObject, jsonValue, context);
    //             Logger.logError(errorText);
    //             return undefined;
    //         } else {
    //             const jsonObject = jsonValue as MarketIvemId.Json;
    //             const result = MarketIvemId.tryCreateFromJson(jsonObject);
    //             if (result !== undefined) {
    //                 return result;
    //             } else {
    //                 const errorText = JsonElement.generateGetErrorText(StringId.InvalidDataIvemIdJson, jsonValue, context);
    //                 Logger.logError(errorText);
    //                 return undefined;
    //             }
    //         }
    //     }
    // }

    // export function getFromJsonElement(element: JsonElement, name: string, defaultValue: DataIvemId, context?: string) {
    //     const tryResult = tryGetFromJsonElement(element, name, context);
    //     return (tryResult === undefined) ? defaultValue : tryResult;
    // }

    export const enum FieldId {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        DataIvemId,
        Code,
        // eslint-disable-next-line @typescript-eslint/no-shadow
        Market,
        Environment,
    }

    export namespace Field {
        export type Id = FieldId;

        interface Info {
            readonly id: FieldId;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly displayId: StringId;
            readonly headingId: StringId;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };
        const infosObject: InfosObject = {
            DataIvemId: {
                id: FieldId.DataIvemId,
                name: 'DataIvemId',
                dataTypeId: FieldDataTypeId.Object,
                displayId: StringId.DataIvemIdFieldDisplay_DataIvemId,
                headingId: StringId.DataIvemIdFieldHeading_DataIvemId,
            },
            Code: {
                id: FieldId.Code,
                name: 'Code',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemIdFieldDisplay_Code,
                headingId: StringId.DataIvemIdFieldHeading_Code,
            },
            Market: {
                id: FieldId.Market,
                name: 'Market',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemIdFieldDisplay_Market,
                headingId: StringId.DataIvemIdFieldHeading_Market,
            },
            Environment: {
                id: FieldId.Environment,
                name: 'Environment',
                dataTypeId: FieldDataTypeId.String,
                displayId: StringId.DataIvemIdFieldDisplay_Environment,
                headingId: StringId.DataIvemIdFieldHeading_Environment,
            },
        } as const;

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            for (let id = 0; id < idCount; id++) {
                const info = infos[id];
                if (info.id !== id as FieldId) {
                    throw new EnumInfoOutOfOrderError('MarketIvemId.FieldId', id, idToName(id));
                }
            }
        }

        export function idToName(id: Id) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: Id) {
            return infos[id].dataTypeId;
        }

        export function idToDisplayId(id: Id) {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id) {
            return Strings[idToDisplayId(id)];
        }

        export function idToHeadingId(id: Id) {
            return infos[id].headingId;
        }

        export function idToHeading(id: Id) {
            return Strings[idToHeadingId(id)];
        }
    }
}

/** @internal */
export namespace MarketIvemIdModule {
    export function initialiseStatic() {
        MarketIvemId.Field.initialise();
    }
}
