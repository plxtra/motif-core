import { CommaText, compareString, ComparisonResult, Err, JsonElement, MapKey, Ok, priorityCompareString, Result } from '@pbkware/js-utils';
import { ErrorCode, JsonElementErr } from '../../sys/internal-api';
import { Exchange, MarketsService } from '../markets/internal-api';

export class IvemId {
    readonly mapKey: MapKey;

    constructor(
        readonly code: string,
        readonly exchange: Exchange,
    ) {
        this.mapKey = IvemId.generateMapKey(this.code, this.exchange.mapKey);
    }

    get name(): string {
        return this.code + '.' + this.exchange.zenithCode; // Zenith code will remain same even if replaced
    }

    static isUndefinableEqual(Left: IvemId | undefined, Right: IvemId | undefined): boolean {
        if (Left === undefined) {
            return Right === undefined;
        } else {
            if (Right === undefined) {
                return false;
            } else {
                return this.isEqual(Left, Right);
            }
        }
    }

    static isEqual(left: IvemId, right: IvemId): boolean {
        return (left.code === right.code) && (left.exchange.zenithCode === right.exchange.zenithCode); // Zenith code will remain same even if replaced
    }

    static compare(left: IvemId, right: IvemId): ComparisonResult {
        let result = compareString(left.exchange.zenithCode, right.exchange.zenithCode); // Zenith code will remain same even if replaced
        if (result === ComparisonResult.LeftEqualsRight) {
            result = compareString(left.code, right.code);
        }
        return result;
    }

    static priorityExchangeCompare(left: IvemId, right: IvemId, priorityZenithExchangeCode: string): ComparisonResult {
        let result = priorityCompareString(left.exchange.zenithCode, right.exchange.zenithCode, priorityZenithExchangeCode); // Zenith code will remain same even if replaced
        if (result === ComparisonResult.LeftEqualsRight) {
            result = compareString(left.code, right.code);
        }
        return result;
    }

    createCopy() {
        return new IvemId(this.code, this.exchange); // Ok to use destroyed exchange
    }

    saveToJson(element: JsonElement) {
        element.setString(IvemId.JsonName.code, this.code);
        const exchange = this.exchange;
        if (exchange.exchangeEnvironmentIsDefault) {
            element.setString(IvemId.JsonName.exchangeZenithCode, exchange.unenvironmentedZenithCode); // Zenith exchange code will remain same even if replaced
        } else {
            element.setString(IvemId.JsonName.exchangeZenithCode, exchange.zenithCode); // Zenith code will remain same even if replaced
            element.setBoolean(IvemId.JsonName.environmentSpecified, true);
        }
    }

    // toJson(): IvemId.PersistJson {
    //     const result: IvemId.PersistJson = {
    //         code: this._code,
    //         exchange: ExchangeInfo.idToJsonValue(this._exchangeId)
    //     } as const;
    //     return result;
    // }
}

export namespace IvemId {
    export namespace JsonName {
        export const code = 'code';
        export const exchangeZenithCode = 'exchangeZenithCode';
        export const environmentSpecified = 'environmentSpecified';
    }
    // export interface PersistJson extends Json {
    //     code: string;
    //     exchange: string;
    // }

    export const nullCode = '';

    export function generateMapKey(code: string, zenithExchangeCode: string): MapKey {
        if (code === nullCode) {
            return '';
        } else {
            return CommaText.from2Values(code, zenithExchangeCode);
        }
    }

    export function createUnknown(unknownExchange: Exchange): IvemId {
        return new IvemId(nullCode, unknownExchange);
    }

    export function tryCreateFromJson(marketsService: MarketsService, element: JsonElement, unknownAllowed: boolean): Result<IvemId> {
        const codeResult = element.tryGetString(JsonName.code);
        if (codeResult.isErr()) {
            return JsonElementErr.createOuter(codeResult.error, ErrorCode.IvemId_CodeNotSpecified);
        } else {
            const code = codeResult.value;

            const exchangeZenithCodeResult = element.tryGetString(JsonName.exchangeZenithCode);
            if (exchangeZenithCodeResult.isErr()) {
                return JsonElementErr.createOuter(exchangeZenithCodeResult.error, ErrorCode.IvemId_ExchangeNotSpecified);
            } else {
                const exchangeZenithCode = exchangeZenithCodeResult.value;

                const environmentSpecifiedResult = element.tryGetBoolean(JsonName.environmentSpecified);
                let environmentSpecified: boolean;
                if (environmentSpecifiedResult.isErr()) {
                    const errorId = environmentSpecifiedResult.error;
                    if (errorId === JsonElement.ErrorId.JsonValueIsNotDefined) {
                        environmentSpecified = false;
                    } else {
                        return JsonElementErr.createOuter(environmentSpecifiedResult.error, ErrorCode.IvemId_EnvironmentSpecifiedIsInvalid);
                    }
                } else {
                    environmentSpecified = environmentSpecifiedResult.value;
                }

                let exchange: Exchange | undefined;
                if (environmentSpecified) {
                    exchange = marketsService.tryGetExchange(exchangeZenithCode, unknownAllowed);
                } else {
                    exchange = marketsService.tryGetDefaultEnvironmentExchange(exchangeZenithCode, unknownAllowed);
                }

                if (exchange === undefined) {
                    const errorCode = environmentSpecified ? ErrorCode.IvemId_EnvironmentedExchangeIsUnknown : ErrorCode.IvemId_UnenvironmentedExchangeIsUnknown;
                    return new Err(`${errorCode} (${exchangeZenithCode})`);
                } else {
                    const ivemId = new IvemId(code, exchange);
                    return new Ok(ivemId);
                }
            }
        }
    }

    export function createJsonElementArray(ivemIds: readonly IvemId[]) {
        const ivemIdCount = ivemIds.length;
        const ivemIdElements = new Array<JsonElement>(ivemIdCount);

        for (let i = 0; i < ivemIdCount; i++) {
            const ivemId = ivemIds[i];
            const jsonElement = new JsonElement();
            ivemId.saveToJson(jsonElement);
            ivemIdElements[i] = jsonElement;
        }
        return ivemIdElements;
    }

    export function tryCreateArrayFromJsonElementArray(marketsService: MarketsService, elements: JsonElement[], unknownExchangeAllowed: boolean): Result<IvemId[]> {
        const count = elements.length;
        const ivemIds = new Array<IvemId>(count);
        for (let i = 0; i < count; i++) {
            const element = elements[i];
            const ivemIdResult = tryCreateFromJson(marketsService, element, unknownExchangeAllowed);
            if (ivemIdResult.isErr()) {
                return ivemIdResult.createOuter(`${ErrorCode.MarketIvemId_TryCreateArrayFromJsonElementArray}(${i})`);
            } else {
                ivemIds[i] = ivemIdResult.value;
            }
        }
        return new Ok(ivemIds);
    }

    // export function tryCreateFromJson(value: PersistJson): IvemId | undefined {
    //     const { code, exchange } = value;
    //     if (code === undefined) {
    //         return undefined;
    //     } else {
    //         if (code === '') {
    //             return undefined;
    //         } else {
    //             if (exchange === undefined) {
    //                 return undefined;
    //             } else {
    //                 const exchangeId = ExchangeInfo.tryJsonValueToId(exchange);
    //                 if (exchangeId === undefined) {
    //                     return undefined;
    //                 } else {
    //                     return new IvemId(code, exchangeId);
    //                 }
    //             }
    //         }
    //     }
    // }

    // export function tryCreateArrayFromJson(jsonArray: PersistJson[]) {
    //     const count = jsonArray.length;
    //     const resultArray = new Array<IvemId>(count);
    //     for (let I = 0; I < count; I++) {
    //         const ivemId = tryCreateFromJson(jsonArray[I]);
    //         if (ivemId === undefined) {
    //             return undefined;
    //         } else {
    //             resultArray[I] = ivemId;
    //         }
    //     }

    //     return resultArray;
    // }

    // export function tryGetFromJsonElement(element: JsonElement, name: string, context?: string): IvemId | undefined {
    //     const jsonValue = element.tryGetNativeObject(name);
    //     if (jsonValue === undefined || jsonValue === null) {
    //         return undefined;
    //     } else {
    //         const result = IvemId.tryCreateFromJson(jsonValue as IvemId.PersistJson);
    //         if (result !== undefined) {
    //             return result;
    //         } else {
    //             const errorText = JsonElement.generateGetErrorText(StringId.InvalidIvemIdJson, jsonValue, context);
    //             Logger.logError(errorText);
    //             return undefined;
    //         }
    //     }
    // }

    // export function getFromJsonElement(element: JsonElement, name: string, defaultValue: IvemId, context?: string) {
    //     const tryResult = tryGetFromJsonElement(element, name, context);
    //     return (tryResult === undefined) ? defaultValue : tryResult;
    // }

    // export class List extends TList<IvemId> {
    //     private getAsJsonValue(): string {
    //         const ivemIdJsonArray = new Array<string>(this.count);
    //         for (let i = 0; i < this.count; i++) {
    //             ivemIdJsonArray[i] = this.getItem(i).asJsonElement();
    //         }
    //         return CommaText.fromStringArray(ivemIdJsonArray);
    //     }

    //     get asJsonValue(): string {
    //         return this.getAsJsonValue();
    //     }

    //     tryLoadFromJsonValue(Value: string): boolean {
    //         super.clear();
    //         const commaTextToResult = CommaText.toStringArrayWithResult(Value);
    //         if (!commaTextToResult.success) {
    //             return false;
    //         } else {
    //             const ivemIdJsonArray = commaTextToResult.array;
    //             this.capacity = ivemIdJsonArray.length;
    //             for (const ivemIdJsonValue of ivemIdJsonArray) {
    //                 const ivemId = new IvemId();
    //                 if (ivemId.tryLoadFromJsonValue(ivemIdJsonValue)) {
    //                     super.add(ivemId);
    //                 } else {
    //                     super.clear();
    //                     return false;
    //                 }
    //             }
    //         }
    //         return true;
    //     }
    // }

    // export interface TryToArrayResult {
    //     success: boolean;
    //     array: IvemId[];
    // }
}
