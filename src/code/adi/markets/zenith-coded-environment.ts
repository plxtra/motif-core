import { compareString, ComparisonResult } from '@pbkware/js-utils';
import { ExchangeEnvironmentZenithCode } from '../common/internal-api';

export interface ZenithCodedEnvironment {
    readonly zenithCode: ExchangeEnvironmentZenithCode;
    destroyed: boolean;
}

export namespace ZenithCodedEnvironment {
    export function compareZenithCode(left: ExchangeEnvironmentZenithCode, right: ExchangeEnvironmentZenithCode) {
        if (left === null) {
            return right === null ? ComparisonResult.LeftEqualsRight : ComparisonResult.LeftLessThanRight;
        } else {
            return right === null ? ComparisonResult.LeftGreaterThanRight : compareString(left, right);
        }
    }
}
