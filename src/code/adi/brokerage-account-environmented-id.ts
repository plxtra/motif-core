import { compareString, ComparisonResult, Err, JsonElement, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, JsonElementErr } from '../sys/internal-api';
import { unknownZenithCode as dataTypeUnknownZenithCode, ExchangeEnvironmentZenithCode, ZenithEnvironmentedValueParts } from './common/internal-api';
import { ExchangeEnvironment, MarketsService } from './markets/internal-api';

export interface BrokerageAccountEnvironmentedId {
    code: string;
    upperCode: string;
    environment: ExchangeEnvironment;
    display: string;
}

export namespace BrokerageAccountEnvironmentedId {
    export const unknownCode = '<|unknown|>';
    export const unknownZenithCode = ZenithEnvironmentedValueParts.toStringFromDestructured(unknownCode, dataTypeUnknownZenithCode);

    namespace JsonName {
        export const code = 'code';
        export const environment = 'environment';
    }

    export function createFromZenithCode(marketsService: MarketsService, zenithCode: string): BrokerageAccountEnvironmentedId {
        const parts = ZenithEnvironmentedValueParts.fromString(zenithCode);
        return create(marketsService, parts.value, parts.environmentZenithCode);
    }

    export function create(marketsService: MarketsService, code: string, environmentZenithCode: ExchangeEnvironmentZenithCode): BrokerageAccountEnvironmentedId {
        const environment = marketsService.getExchangeEnvironmentOrUnknown(environmentZenithCode);

        let display: string;
        if (environment === marketsService.defaultExchangeEnvironment) {
            display = code;
        } else {
            display = ZenithEnvironmentedValueParts.toStringFromDestructured(code, environment.zenithCode);
        }

        return {
            code,
            upperCode: code.toUpperCase(),
            environment,
            display,
        };
    }
    // eslint-disable-next-line @typescript-eslint/no-shadow
    export function isEqual(left: BrokerageAccountEnvironmentedId, right: BrokerageAccountEnvironmentedId) {
        return left.code === right.code && left.environment === right.environment;
    }

    export function compare(left: BrokerageAccountEnvironmentedId, right: BrokerageAccountEnvironmentedId): ComparisonResult {
        const result = compareString(left.code, right.code);
        if (result === ComparisonResult.LeftEqualsRight) {
            return ExchangeEnvironment.compareByZenithCode(left.environment, right.environment)
        } else {
            return result;
        }
    }

    export function saveToJson(element: JsonElement, brokerageAccountEnvironmentedId: BrokerageAccountEnvironmentedId) {
        element.setString(JsonName.code, brokerageAccountEnvironmentedId.code);
        const environmentZenithCodeAsStringJsonValue = ExchangeEnvironmentZenithCode.toStringJsonValue(brokerageAccountEnvironmentedId.environment.zenithCode);
        element.setString(JsonName.environment, environmentZenithCodeAsStringJsonValue);
    }

    export function tryCreateFromJson(marketsService: MarketsService, element: JsonElement): Result<BrokerageAccountEnvironmentedId> {
        const codeResult = element.tryGetString(JsonName.code);
        if (codeResult.isErr()) {
            return JsonElementErr.createOuter(codeResult.error, ErrorCode.BrokerageAccountEnvironmentId_TryCreateFromJson_IdNotSpecified);
        } else {
            const code = codeResult.value;

            const environmentZenithCodeAsStringJsonValueResult = element.tryGetString(JsonName.environment);
            if (environmentZenithCodeAsStringJsonValueResult.isErr()) {
                return JsonElementErr.createOuter(environmentZenithCodeAsStringJsonValueResult.error, ErrorCode.BrokerageAccountEnvironmentId_TryCreateFromJson_EnvironmentZenithCodeNotSpecified);
            } else {
                const environmentZenithCodeAsStringJsonValue = environmentZenithCodeAsStringJsonValueResult.value;

                const environmentZenithCode = ExchangeEnvironmentZenithCode.tryCreateFromStringJsonValue(environmentZenithCodeAsStringJsonValue);
                if (environmentZenithCode === undefined) {
                    return new Err(`${ErrorCode.BrokerageAccountEnvironmentId_TryCreateFromJson_InvalidEnvironmentZenithCode}: ${environmentZenithCodeAsStringJsonValue}`);
                } else {
                    const brokerageAccountId = BrokerageAccountEnvironmentedId.create(marketsService, code, environmentZenithCode);
                    return new Ok(brokerageAccountId);
                }
            }
        }
    }
}
