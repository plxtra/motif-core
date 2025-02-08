import { compareString, ComparisonResult } from '@xilytix/sysutils';
import { ZenithProtocolCommon } from './zenith-protocol-common';

export type ExchangeEnvironmentZenithCode = string | null;

export namespace ExchangeEnvironmentZenithCode {
    const nullJsonValueFirstChar = ']';
    const notNullJsonValuePrefixChar = '[';

    export function toZenithProtocolString(value: ExchangeEnvironmentZenithCode) {
        if (value === null) {
            return '';
        } else {
            return `${ZenithProtocolCommon.environmentOpenChar}${value}${ZenithProtocolCommon.environmentCloseChar}`;
        }
    }

    export function createDisplay(value: ExchangeEnvironmentZenithCode): string {
        if (value === null) {
            return '(prod)';
        } else {
            return value;
        }
    }

    export function createMapKey(value: ExchangeEnvironmentZenithCode): string {
        if (value === null) {
            return nullJsonValueFirstChar;
        } else {
            return notNullJsonValuePrefixChar + value;
        }
    }

    export function compare(left: ExchangeEnvironmentZenithCode, right: ExchangeEnvironmentZenithCode) {
        if (left === null) {
            return right === null ? ComparisonResult.LeftEqualsRight : ComparisonResult.LeftLessThanRight;
        } else {
            return right === null ? ComparisonResult.LeftGreaterThanRight : compareString(left, right);
        }
    }

    export function toStringJsonValue(value: ExchangeEnvironmentZenithCode): string {
        if (value === null) {
            return nullJsonValueFirstChar;
        } else {
            return notNullJsonValuePrefixChar + value;
        }
    }

    export function tryCreateFromStringJsonValue(value: string): ExchangeEnvironmentZenithCode | undefined {
        const valueLength = value.length;
        if (valueLength === 0) {
            return undefined;
        } else {
            const firstChar = value[0];
            if (firstChar === notNullJsonValuePrefixChar) {
                if (valueLength === 1) {
                    return null;
                } else {
                    return undefined;
                }
            } else {
                return value.substring(1);
            }
        }
    }
}

