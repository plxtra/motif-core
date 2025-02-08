import { ExchangeEnvironmentZenithCode } from './exchange-environment-zenith-code';
import { ZenithProtocolCommon } from './zenith-protocol-common';

export interface ZenithEnvironmentedValueParts {
    value: string;
    environmentZenithCode: ExchangeEnvironmentZenithCode;
}

export namespace ZenithEnvironmentedValueParts {
    export function fromString(stringValue: string): ZenithEnvironmentedValueParts {
        const length = stringValue.length;
        const lastCharPos = length - 1;
        if (length < 2 || stringValue[lastCharPos] !== ZenithProtocolCommon.environmentCloseChar) {
            return {
                value: stringValue,
                environmentZenithCode: null,
            };
        } else {
            const environmentOpenChar = ZenithProtocolCommon.environmentOpenChar;
            let environmentOpenerPos = -1;
            for (let i = length - 1; i >= 0; i--) {
                if (stringValue[i] === environmentOpenChar) {
                    environmentOpenerPos = i;
                    break;
                }
            }
            if (environmentOpenerPos < 0) {
                return {
                    value: stringValue,
                    environmentZenithCode: null,
                };
            } else {
                return {
                    value: stringValue.substring(0, environmentOpenerPos),
                    environmentZenithCode: stringValue.substring(environmentOpenerPos + 1, lastCharPos),
                };
            }
        }
    }

    export function getValueFromString(stringValue: string): string {
        const length = stringValue.length;
        const lastCharPos = length - 1;
        if (length < 2 || stringValue[lastCharPos] !== ZenithProtocolCommon.environmentCloseChar) {
            return stringValue;
        } else {
            const environmentOpenChar = ZenithProtocolCommon.environmentOpenChar;
            for (let i = length - 1; i >= 0; i--) {
                if (stringValue[i] === environmentOpenChar) {
                    return stringValue.substring(0, i);
                }
            }
            return stringValue;
        }
    }

    export function getEnvironmentFromString(stringValue: string): ExchangeEnvironmentZenithCode {
        const length = stringValue.length;
        const lastCharPos = length - 1;
        if (length < 2 || stringValue[lastCharPos] !== ZenithProtocolCommon.environmentCloseChar) {
            return null;
        } else {
            const environmentOpenChar = ZenithProtocolCommon.environmentOpenChar;
            for (let i = length - 1; i >= 0; i--) {
                if (stringValue[i] === environmentOpenChar) {
                    return stringValue.substring(i + 1, lastCharPos);
                }
            }
            return null;
        }
    }

    export function toString(environmentedValue: ZenithEnvironmentedValueParts) {
        return toStringFromDestructured(environmentedValue.value, environmentedValue.environmentZenithCode)
    }

    export function toStringFromDestructured(value: string, environment: ExchangeEnvironmentZenithCode) {
        return `${value}${ExchangeEnvironmentZenithCode.toZenithProtocolString(environment)}`;
    }

    export function isStringEnvironmented(stringValue: string) {
        const length = stringValue.length;
        const lastCharPos = length - 1;
        return length === 0 || stringValue[lastCharPos] !== ZenithProtocolCommon.environmentCloseChar;
    }
}

