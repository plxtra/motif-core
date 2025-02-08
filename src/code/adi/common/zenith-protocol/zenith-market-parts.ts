import { ErrorCode, ErrorCodeWithExtra, ErrorCodeWithExtraErr, Ok, Result, UnreachableCaseError } from '../../../sys/internal-api';
import { ExchangeEnvironmentZenithCode } from './exchange-environment-zenith-code';
import { ZenithProtocolCommon } from './zenith-protocol-common';

export interface ZenithMarketParts {
    exchange: string;
    m1: string | undefined;
    m2: string | undefined;
    environment: ExchangeEnvironmentZenithCode;
}

export namespace ZenithMarketParts {
    export class M1M2 {
        constructor(public m1?: string, public m2?: string) { }
    }

    enum ParseState {
        OutStart,
        InExchange,
        InM1,
        InM2,
        InEnvironment,
        OutFinished,
    }

    export interface Error {
        readonly code: ErrorCode;
        readonly extra: string;
    }

    export function createError(code: ErrorCode, extra: string): ErrorCodeWithExtraErr<ZenithMarketParts> {
        return new ErrorCodeWithExtraErr<ZenithMarketParts>({
            code,
            extra,
        });
    }

    export function tryParse(value: string): Result<ZenithMarketParts, ErrorCodeWithExtra> {
        let exchange: string | undefined;
        let m1: string | undefined;
        let m2: string | undefined;
        let environment: ExchangeEnvironmentZenithCode = null;

        let bldr = '';
        let state = ParseState.OutStart;

        for (let i = 0; i < value.length; i++) {
            switch (value[i]) {
                case ZenithProtocolCommon.marketDelimiter:
                    switch (state) {
                        case ParseState.OutStart:
                            state = ParseState.InM1;
                            break;
                        case ParseState.InExchange:
                            exchange = bldr;
                            bldr = '';
                            state = ParseState.InM1;
                            break;
                        case ParseState.InM1:
                            m1 = bldr;
                            bldr = '';
                            state = ParseState.InM2;
                            break;
                        case ParseState.InM2:
                            return createError(ErrorCode.ExchangeMarketBoardParts_MarketDelimiterInM2, value);
                        case ParseState.InEnvironment:
                            return createError(ErrorCode.ExchangeMarketBoardParts_MarketDelimiterInEnvironment, value);
                        case ParseState.OutFinished:
                            return createError(ErrorCode.ExchangeMarketBoardParts_MarketDelimiterAfterEnvironment, value);
                        default:
                            throw new UnreachableCaseError('ZSPTPMDD48832', state);
                    }
                    break;

                case ZenithProtocolCommon.environmentOpenChar:
                    switch (state) {
                        case ParseState.OutStart:
                            return createError(ErrorCode.ExchangeMarketBoardParts_EnvironmentOpenCharAtStart, value);
                        case ParseState.InExchange:
                            exchange = bldr;
                            bldr = '';
                            state = ParseState.InEnvironment;
                            break;
                        case ParseState.InM1:
                            m1 = bldr;
                            bldr = '';
                            state = ParseState.InEnvironment;
                            break;
                        case ParseState.InM2:
                            m2 = bldr;
                            bldr = '';
                            state = ParseState.InEnvironment;
                            break;
                        case ParseState.InEnvironment:
                            return createError(ErrorCode.ExchangeMarketBoardParts_EnvironmentOpenCharInEnvironment, value);
                        case ParseState.OutFinished:
                            return createError(ErrorCode.ExchangeMarketBoardParts_EnvironmentOpenCharAfterEnvironment, value);
                        default:
                            throw new UnreachableCaseError('ZSPTPEOD23887', state);
                    }
                    break;

                case ZenithProtocolCommon.environmentCloseChar:
                    switch (state) {
                        case ParseState.OutStart:
                            return createError(ErrorCode.ExchangeMarketBoardParts_EnvironmentCloseCharAtStart, value);
                        case ParseState.InExchange:
                            return createError(ErrorCode.ExchangeMarketBoardParts_EnvironmentCloseCharInEnvironment, value);
                        case ParseState.InM1:
                            return createError(ErrorCode.ExchangeMarketBoardParts_EnvironmentCloseCharInM1, value);
                        case ParseState.InM2:
                            return createError(ErrorCode.ExchangeMarketBoardParts_EnvironmentCloseCharInM2, value);
                        case ParseState.InEnvironment:
                            environment = bldr;
                            bldr = '';
                            state = ParseState.OutFinished;
                            break;
                        case ParseState.OutFinished:
                            return createError(ErrorCode.ExchangeMarketBoardParts_EnvironmentCloseCharAfterEnvironment, value);
                        default:
                            throw new UnreachableCaseError('ZSPTPECD23887', state);
                    }
                    break;

                default:
                    switch (state) {
                        case ParseState.OutStart:
                            bldr += value[i];
                            state = ParseState.InExchange;
                            break;
                        case ParseState.OutFinished:
                            return createError(ErrorCode.ExchangeMarketBoardParts_CharAfterEnvironment, value);
                        default:
                            bldr += value[i];
                            break;
                    }
                    break;
            }
        }

        switch (state) {
            case ParseState.InExchange:
                exchange = bldr;
                break;
            case ParseState.InM1:
                m1 = bldr;
                break;
            case ParseState.InM2:
                m2 = bldr;
                break;
        }

        if (exchange === undefined) {
            return createError(ErrorCode.ExchangeMarketBoardParts_ExchangeNotSpecified, value);
        } else {
            const parts: ZenithMarketParts = {
                exchange,
                m1,
                m2,
                environment,
            };

            return new Ok(parts);
        }
    }

    export function createSymbol(parts: ZenithMarketParts) {
        return createSymbolFromDestructured(parts.exchange, parts.m1, parts.m2, parts.environment);
    }

    export function createSymbolFromDestructured(exchange: string, m1: string | undefined, m2: string | undefined, environment: ExchangeEnvironmentZenithCode | undefined): string {
        const m2ZeroLength = m2 === undefined || m2.length === 0;

        const m1ZeroLength = m1 === undefined || m1.length === 0;
        let delimitedM1: string;
        if (m1ZeroLength) {
            delimitedM1 = m2ZeroLength ? '' : ZenithProtocolCommon.marketDelimiter;
        } else {
            delimitedM1 = ZenithProtocolCommon.marketDelimiter + m1;
        }

        const delimitedM2 = m2ZeroLength ? '' : ZenithProtocolCommon.marketDelimiter + m2;

        if (environment === undefined) {
            return `${exchange}${delimitedM1}${delimitedM2}`;
        } else {
            const zenithProtocolEnvironmentString = ExchangeEnvironmentZenithCode.toZenithProtocolString(environment);
            return `${exchange}${delimitedM1}${delimitedM2}${zenithProtocolEnvironmentString}`;
        }
    }
}
