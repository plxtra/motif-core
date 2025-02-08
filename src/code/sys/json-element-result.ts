/* eslint-disable @typescript-eslint/no-unnecessary-condition */
import { JsonElement, Ok, UnreachableCaseError } from '@xilytix/sysutils';
import { I18nStrings, StringId } from '../res/internal-api';
import { ErrorCode } from './error-code';
import { Err } from './error-code-with-extra-err';

/** @public */
export type JsonElementResult<T> = Ok<T, string> | JsonElementErr<T>;

/** @public */
export class JsonElementErr<T = undefined> extends Err<T> {
    constructor(readonly errorId: JsonElement.ErrorId, context?: string) {
        const errorCode = JsonElementErr.errorIdToCode(errorId);
        const error = context === undefined ? errorCode : `${context}: ${errorCode}`;
        super(error);
    }

    override createType<NewT>(errorSuffix?: string) {
        const error = errorSuffix === undefined ? this.error : `${this.error}: ${errorSuffix}`;
        return new JsonElementErr<NewT>(this.errorId, error);
    }
}

/** @public */
export namespace JsonElementErr {
    export function create<T>(errorId: JsonElement.ErrorId): JsonElementErr<T> {
        return new JsonElementErr(errorId);
    }

    export function createOuter<OuterT = undefined>(errorId: JsonElement.ErrorId, outerErrorText: string): Err<OuterT> {
        const innerJsonElementErr = new JsonElementErr(errorId);
        return innerJsonElementErr.createOuter(outerErrorText);
    }

    export function generateErrorText(functionName: string, stringId: StringId, jsonValue: unknown): string {
        let errorText = functionName + ': ' + I18nStrings.getStringPlusEnglish(stringId) + ': ';
        // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
        errorText += `${jsonValue}`.substring(0, 200); // make sure not too long
        return errorText;
    }

    export function generateGetErrorText(stringId: StringId, jsonValue: unknown): string {
        return generateErrorText('JsonElement.Get', stringId, jsonValue);
    }

    export function errorIdToCode(errorId: JsonElement.ErrorId): ErrorCode {
        switch (errorId) {
            case JsonElement.ErrorId.InvalidJsonText: return ErrorCode.JsonElement_InvalidJsonText;
            case JsonElement.ErrorId.ElementIsNotDefined: return ErrorCode.JsonElement_ElementIsNotDefined;
            case JsonElement.ErrorId.JsonValueIsNotDefined: return ErrorCode.JsonElement_JsonValueIsNotDefined;
            case JsonElement.ErrorId.JsonValueIsNotOfTypeObject: return ErrorCode.JsonElement_JsonValueIsNotOfTypeObject;
            case JsonElement.ErrorId.JsonValueIsNotOfTypeString: return ErrorCode.JsonElement_JsonValueIsNotOfTypeString;
            case JsonElement.ErrorId.JsonValueIsNotOfTypeStringOrNull: return ErrorCode.JsonElement_JsonValueIsNotOfTypeStringOrNull;
            case JsonElement.ErrorId.JsonValueIsNotOfTypeNumber: return ErrorCode.JsonElement_JsonValueIsNotOfTypeNumber;
            case JsonElement.ErrorId.JsonValueIsNotOfTypeNumberOrNull: return ErrorCode.JsonElement_JsonValueIsNotOfTypeNumberOrNull;
            case JsonElement.ErrorId.JsonValueIsNotOfTypeBoolean: return ErrorCode.JsonElement_JsonValueIsNotOfTypeBoolean;
            case JsonElement.ErrorId.JsonValueIsNotOfTypeBooleanOrNull: return ErrorCode.JsonElement_JsonValueIsNotOfTypeBooleanOrNull;
            case JsonElement.ErrorId.DecimalJsonValueIsNotOfTypeString: return ErrorCode.JsonElement_DecimalJsonValueIsNotOfTypeString;
            case JsonElement.ErrorId.InvalidDecimal: return ErrorCode.JsonElement_InvalidDecimal;
            case JsonElement.ErrorId.JsonValueIsNotAnArray: return ErrorCode.JsonElement_JsonValueIsNotAnArray;
            case JsonElement.ErrorId.JsonValueArrayElementIsNotAnObject: return ErrorCode.JsonElement_JsonValueArrayElementIsNotAnObject;
            case JsonElement.ErrorId.JsonValueArrayElementIsNotJson: return ErrorCode.JsonElement_JsonValueArrayElementIsNotJson;
            case JsonElement.ErrorId.JsonValueArrayElementIsNotAString: return ErrorCode.JsonElement_JsonValueArrayElementIsNotAString;
            case JsonElement.ErrorId.JsonValueArrayElementIsNotAStringOrNull: return ErrorCode.JsonElement_JsonValueArrayElementIsNotAStringOrNull;
            case JsonElement.ErrorId.JsonValueArrayElementIsNotANumber: return ErrorCode.JsonElement_JsonValueArrayElementIsNotANumber;
            case JsonElement.ErrorId.JsonValueArrayElementIsNotANumberOrNull: return ErrorCode.JsonElement_JsonValueArrayElementIsNotANumberOrNull;
            case JsonElement.ErrorId.JsonValueArrayElementIsNotABoolean: return ErrorCode.JsonElement_JsonValueArrayElementIsNotABoolean;
            case JsonElement.ErrorId.JsonValueArrayElementIsNotABooleanOrNull: return ErrorCode.JsonElement_JsonValueArrayElementIsNotABooleanOrNull;
            default:
                throw new UnreachableCaseError('JEEEITS10911', errorId);
        }
    }
}
