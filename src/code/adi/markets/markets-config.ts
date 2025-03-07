import { CommaText, Err, Json, JsonElement, Ok, Result } from '@pbkware/js-utils';
import { I18nStrings } from '../../res/i18n-strings';
import { ErrorCode } from '../../sys/error-code';
import { JsonElementErr, JsonElementResult } from '../../sys/json-element-result';
import { OrderTradeType, OrderTradeTypeId, OrderTriggerType, OrderTriggerTypeId, OrderType, OrderTypeId, SymbolField, SymbolFieldId, TimeInForce, TimeInForceId, unknownZenithCode } from '../common/data-types';
import { ExchangeEnvironmentZenithCode } from '../common/internal-api';

export interface MarketsConfig {
    defaultDefaultZenithExchangeCode: string | undefined;
    defaultExchangeEnvironmentPriorityList: readonly ExchangeEnvironmentZenithCode[] | undefined;
    productionExchangeEnvironmentList: readonly ExchangeEnvironmentZenithCode[];
    exchanges: readonly MarketsConfig.Exchange[];
    exchangeEnvironments: readonly MarketsConfig.ExchangeEnvironment[];
}

export namespace MarketsConfig {
    export type LanguagesDisplay = Record<string, string>;

    export namespace StandardExchangeEnvironmentZenithCode {
        export const inferredProduction: ExchangeEnvironmentZenithCode = null;
        export const production: ExchangeEnvironmentZenithCode = 'production';
        export const delayed: ExchangeEnvironmentZenithCode = 'delayed';
        export const sample: ExchangeEnvironmentZenithCode = 'sample';
        export const demo: ExchangeEnvironmentZenithCode = 'demo';
        export const test: ExchangeEnvironmentZenithCode = 'test';
    }

    export const defaultDefaultExchangeEnvironmentPriorityList: readonly ExchangeEnvironmentZenithCode[] = [
        StandardExchangeEnvironmentZenithCode.inferredProduction,
        StandardExchangeEnvironmentZenithCode.production,
        StandardExchangeEnvironmentZenithCode.delayed,
        StandardExchangeEnvironmentZenithCode.sample,
        StandardExchangeEnvironmentZenithCode.demo,
        StandardExchangeEnvironmentZenithCode.test,
    ];
    const defaultProductionExchangeEnvironmentList: readonly ExchangeEnvironmentZenithCode[] = [
        StandardExchangeEnvironmentZenithCode.inferredProduction,
        StandardExchangeEnvironmentZenithCode.production,
    ];

    type PropertyName = keyof MarketsConfig;
    const defaultDefaultZenithExchangeCodePropertyName: PropertyName = 'defaultDefaultZenithExchangeCode'; // Exchange environmented zenith codes
    const defaultExchangeEnvironmentPriorityListPropertyName: PropertyName = 'defaultExchangeEnvironmentPriorityList'; // Exchange environmented zenith codes
    const productionExchangeEnvironmentListPropertyName: PropertyName = 'productionExchangeEnvironmentList';
    const exchangesPropertyName: PropertyName = 'exchanges';
    const exchangeEnvironmentsPropertyName: PropertyName = 'exchangeEnvironments';

    export interface Exchange {
        readonly zenithCode: string;
        readonly defaultExchangeEnvironmentZenithCode: ExchangeEnvironmentZenithCode | undefined; // Use null if specifying an Exchange Environment which is implicit (ie not included in a zenith symbol code)
        readonly symbologyCode: string | undefined;
        readonly defaultSymbolNameField: SymbolFieldId;
        readonly allowedSymbolNameFields: readonly SymbolFieldId[];
        readonly defaultSymbolSearchFields: readonly SymbolFieldId[];
        readonly allowedSymbolSearchFields: readonly SymbolFieldId[];
        readonly abbreviatedDisplay: string | undefined;
        readonly fullDisplay: string | undefined;
        readonly displayPriority: number | undefined;
        readonly dataMarkets: readonly Exchange.DataMarket[];
        readonly tradingMarkets: readonly Exchange.TradingMarket[];
        readonly defaultLitMarketZenithCode: string | null | undefined;  // used to display value of holdings. Set to null if exchange has no lit markets
        readonly defaultTradingMarketZenithCode: string | null | undefined;  // used to find default order route for market.  Set to null if exchange has not trading markets. If undefined, use defaultLitMarketZenithCode
    }

    export function createEmpty(): MarketsConfig {
        return {
            defaultDefaultZenithExchangeCode: undefined,
            defaultExchangeEnvironmentPriorityList: undefined,
            productionExchangeEnvironmentList: [],
            exchangeEnvironments: [],
            exchanges: [],
        }
    }

    export function tryParse(config: Json): Result<MarketsConfig> {
        const configElement = new JsonElement(config);
        const defaultDefaultZenithExchangeCodeResult = configElement.tryGetUndefinableString(defaultDefaultZenithExchangeCodePropertyName);
        if (defaultDefaultZenithExchangeCodeResult.isErr()) {
            return new JsonElementErr(defaultDefaultZenithExchangeCodeResult.error, defaultDefaultZenithExchangeCodePropertyName);
        } else {
            const defaultDefaultZenithExchangeCode = defaultDefaultZenithExchangeCodeResult.value;
            if (defaultDefaultZenithExchangeCode !== undefined && isZenithCodeBlankOrUnknown(defaultDefaultZenithExchangeCode)) {
                return new Err(ErrorCode.MarketConfig_DefaultDefaultZenithExchangeCodeIsBlankOrUnknown);
            } else {
                const defaultExchangeEnvironmentPriorityListResult = configElement.tryGetUndefinableStringOrNullArray(defaultExchangeEnvironmentPriorityListPropertyName);
                if (defaultExchangeEnvironmentPriorityListResult.isErr()) {
                    return new JsonElementErr(defaultExchangeEnvironmentPriorityListResult.error, defaultExchangeEnvironmentPriorityListPropertyName);
                } else {
                    const productionExchangeEnvironmentStringResult = configElement.tryGetUndefinableStringOrNullArray(productionExchangeEnvironmentListPropertyName);
                    if (productionExchangeEnvironmentStringResult.isErr()) {
                        return new JsonElementErr(productionExchangeEnvironmentStringResult.error, productionExchangeEnvironmentListPropertyName);
                    } else {
                        let productionExchangeEnvironmentList: readonly ExchangeEnvironmentZenithCode[] | undefined = productionExchangeEnvironmentStringResult.value;
                        if (productionExchangeEnvironmentList === undefined) {
                            productionExchangeEnvironmentList = defaultProductionExchangeEnvironmentList;
                        }
                        const exchangeElementArrayResult = configElement.tryGetUndefinableElementArray(exchangesPropertyName);
                        if (exchangeElementArrayResult.isErr()) {
                            return new JsonElementErr(exchangeElementArrayResult.error, exchangesPropertyName);
                        } else {
                            const exchangesParseResult = tryParseExchanges(exchangeElementArrayResult.value);
                            if (exchangesParseResult.isErr()) {
                                return new Err(`${exchangesParseResult.error}: ${exchangesPropertyName}]`);
                            } else {
                                const exchangeEnvironmentElementArrayResult = configElement.tryGetUndefinableElementArray(exchangeEnvironmentsPropertyName);
                                if (exchangeEnvironmentElementArrayResult.isErr()) {
                                    return new JsonElementErr(exchangeEnvironmentElementArrayResult.error, exchangeEnvironmentsPropertyName);
                                } else {
                                    const exchangeEnvironmentsParseResult = tryParseExchangeEnvironments(exchangeEnvironmentElementArrayResult.value);
                                    if (exchangeEnvironmentsParseResult.isErr()) {
                                        return new Err(`${exchangeEnvironmentsParseResult.error}: ${exchangeEnvironmentsPropertyName}`);
                                    } else {
                                        const marketsConfig: MarketsConfig = {
                                            defaultDefaultZenithExchangeCode,
                                            defaultExchangeEnvironmentPriorityList: defaultExchangeEnvironmentPriorityListResult.value,
                                            productionExchangeEnvironmentList,
                                            exchanges: exchangesParseResult.value,
                                            exchangeEnvironments: exchangeEnvironmentsParseResult.value,
                                        };

                                        return new Ok(marketsConfig);
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    function tryParseExchanges(exchangeElements: JsonElement[] | undefined): Result<readonly Exchange[]> {
        if (exchangeElements === undefined) {
            return new Ok([]);
        } else {
            const count = exchangeElements.length;
            const exchanges = new Array<MarketsConfig.Exchange>(count);
            for (let i = 0; i < count; i++) {
                const exchangeElement = exchangeElements[i];
                const exchangeResult = Exchange.tryParse(exchangeElement);
                if (exchangeResult.isErr()) {
                    return new Err(`${exchangeResult.error}: [Exchange index: ${i}]`);
                } else {
                    exchanges[i] = exchangeResult.value;
                }
            }
            return new Ok(exchanges);
        }
    }

    function tryParseExchangeEnvironments(exchangeEnvironmentElements: JsonElement[] | undefined): Result<readonly ExchangeEnvironment[]> {
        if (exchangeEnvironmentElements === undefined) {
            return new Ok([]);
        } else {
            const count = exchangeEnvironmentElements.length;
            const exchangeEnvironments = new Array<MarketsConfig.ExchangeEnvironment>(count);
            for (let i = 0; i < count; i++) {
                const exchangeEnvironmentElement = exchangeEnvironmentElements[i];
                const exchangeEnvironmentResult = ExchangeEnvironment.tryParse(exchangeEnvironmentElement);
                if (exchangeEnvironmentResult.isErr()) {
                    return new Err(`${exchangeEnvironmentResult.error}: [Exchange Environment index: ${i}]`);
                } else {
                    exchangeEnvironments[i] = exchangeEnvironmentResult.value;
                }
            }
            return new Ok(exchangeEnvironments);
        }
    }

    export namespace Exchange {
        export const defaultAllowedSymbolNameFieldIds: readonly SymbolFieldId[] = [SymbolFieldId.Name, SymbolFieldId.Code];
        export const defaultAllowedSymbolSearchFieldIds: readonly SymbolFieldId[] = [SymbolFieldId.Code, SymbolFieldId.Name];

        // eslint-disable-next-line @typescript-eslint/no-shadow
        type PropertyName = keyof Exchange;

        const zenithCodePropertyName: PropertyName = 'zenithCode';
        const defaultExchangeEnvironmentZenithCodePropertyName: PropertyName = 'defaultExchangeEnvironmentZenithCode';
        const symbologyCodePropertyName: PropertyName = 'symbologyCode';
        const defaultSymbolNameFieldPropertyName: PropertyName = 'defaultSymbolNameField';
        const allowedSymbolNameFieldsPropertyName: PropertyName = 'allowedSymbolNameFields';
        const defaultSymbolSearchFieldsPropertyName: PropertyName = 'defaultSymbolSearchFields';
        const allowedSymbolSearchFieldsPropertyName: PropertyName = 'allowedSymbolSearchFields';
        const abbreviatedDisplayPropertyName: PropertyName = 'abbreviatedDisplay';
        const fullDisplayPropertyName: PropertyName = 'fullDisplay';
        const exchangeDisplayPriorityPropertyName: PropertyName = 'displayPriority';
        const dataMarketsPropertyName: PropertyName = 'dataMarkets';
        const tradingMarketsPropertyName: PropertyName = 'tradingMarkets';
        const defaultLitMarketZenithCodePropertyName: PropertyName = 'defaultLitMarketZenithCode';
        const defaultTradingMarketZenithCodePropertyName: PropertyName = 'defaultTradingMarketZenithCode';

        // eslint-disable-next-line @typescript-eslint/no-shadow
        export function tryParse(exchangeElement: JsonElement): Result<Exchange> {
            const zenithCodeResult = exchangeElement.tryGetString(zenithCodePropertyName);
            if (zenithCodeResult.isErr()) {
                return new JsonElementErr(zenithCodeResult.error, zenithCodePropertyName)
            } else {
                const zenithCode = zenithCodeResult.value;
                if (isZenithCodeBlankOrUnknown(zenithCode)) {
                    return new Err(ErrorCode.MarketConfig_ExchangeZenithCodeIsBlankOrUnknown);
                } else {
                    const defaultExchangeEnvironmentZenithCodeResult = exchangeElement.tryGetUndefinableStringOrNull(defaultExchangeEnvironmentZenithCodePropertyName);
                    if (defaultExchangeEnvironmentZenithCodeResult.isErr()) {
                        return new JsonElementErr(defaultExchangeEnvironmentZenithCodeResult.error, `${zenithCode}: ${defaultExchangeEnvironmentZenithCodePropertyName}`)
                    } else {
                        const defaultExchangeEnvironmentZenithCode = defaultExchangeEnvironmentZenithCodeResult.value;
                        if (defaultExchangeEnvironmentZenithCode !== undefined && defaultExchangeEnvironmentZenithCode !== null && isZenithCodeBlankOrUnknown(defaultExchangeEnvironmentZenithCode)) {
                            return new Err(ErrorCode.MarketConfig_ExchangeDefaultExchangeEnvironmentZenithCodeIsBlankOrUnknown);
                        } else {
                            const symbologyCodeResult = exchangeElement.tryGetUndefinableString(symbologyCodePropertyName);
                            if (symbologyCodeResult.isErr()) {
                                return new JsonElementErr(symbologyCodeResult.error, `${zenithCode}: ${symbologyCodePropertyName}`)
                            } else {
                                const allowedSymbolNameFieldIdsResult = tryGetUndefinableSymbolFieldIdArray(exchangeElement, allowedSymbolNameFieldsPropertyName);
                                if (allowedSymbolNameFieldIdsResult.isErr()) {
                                    return new Err(`${allowedSymbolNameFieldIdsResult.error}: ${zenithCode}`);
                                } else {
                                    let allowedSymbolNameFieldIds: readonly SymbolFieldId[] | undefined = allowedSymbolNameFieldIdsResult.value;
                                    if (allowedSymbolNameFieldIds === undefined || allowedSymbolNameFieldIds.length === 0) {
                                        allowedSymbolNameFieldIds = defaultAllowedSymbolNameFieldIds;
                                    }

                                    const defaultSymbolNameFieldIdResult = tryGetUndefinableSymbolFieldId(exchangeElement, defaultSymbolNameFieldPropertyName);
                                    if (defaultSymbolNameFieldIdResult.isErr()) {
                                        return new Err(`${defaultSymbolNameFieldIdResult.error}: ${zenithCode}`);
                                    } else {
                                        let defaultSymbolNameFieldId = defaultSymbolNameFieldIdResult.value;
                                        if (defaultSymbolNameFieldId === undefined) {
                                            defaultSymbolNameFieldId = allowedSymbolNameFieldIds[0];
                                        }

                                        const allowedSymbolSearchFieldIdsResult = tryGetUndefinableSymbolFieldIdArray(exchangeElement, allowedSymbolSearchFieldsPropertyName);
                                        if (allowedSymbolSearchFieldIdsResult.isErr()) {
                                            return new Err(`${allowedSymbolSearchFieldIdsResult.error}: ${zenithCode}`)
                                        } else {
                                            let allowedSymbolSearchFieldIds: readonly SymbolFieldId[] | undefined = allowedSymbolSearchFieldIdsResult.value;
                                            if (allowedSymbolSearchFieldIds === undefined || allowedSymbolSearchFieldIds.length === 0) {
                                                allowedSymbolSearchFieldIds = defaultAllowedSymbolSearchFieldIds;
                                            }

                                            const defaultSymbolSearchFieldIdsResult = tryGetUndefinableSymbolFieldIdArray(exchangeElement, defaultSymbolSearchFieldsPropertyName);
                                            if (defaultSymbolSearchFieldIdsResult.isErr()) {
                                                return new Err(`${defaultSymbolSearchFieldIdsResult.error}: ${zenithCode}`);
                                            } else {
                                                let defaultSymbolSearchFieldIds: readonly SymbolFieldId[] | undefined = defaultSymbolSearchFieldIdsResult.value;
                                                if (defaultSymbolSearchFieldIds === undefined) {
                                                    defaultSymbolSearchFieldIds = allowedSymbolSearchFieldIds.slice(0, 2);
                                                }

                                                const abbreviatedDisplayResult = tryParseLanguagedDisplay(exchangeElement, abbreviatedDisplayPropertyName);
                                                if (abbreviatedDisplayResult.isErr()) {
                                                    return abbreviatedDisplayResult.createType(zenithCode);
                                                } else {
                                                    const fullDisplayResult = tryParseLanguagedDisplay(exchangeElement, fullDisplayPropertyName);
                                                    if (fullDisplayResult.isErr()) {
                                                        return fullDisplayResult.createType(zenithCode);
                                                    } else {
                                                        const displayPriorityResult = exchangeElement.tryGetUndefinableNumber(exchangeDisplayPriorityPropertyName);
                                                        if (displayPriorityResult.isErr()) {
                                                            return new JsonElementErr(displayPriorityResult.error, `${zenithCode}: ${exchangeDisplayPriorityPropertyName}`)
                                                        } else {

                                                            const dataMarketsElementArrayResult = exchangeElement.tryGetUndefinableElementArray(dataMarketsPropertyName);
                                                            if (dataMarketsElementArrayResult.isErr()) {
                                                                return new JsonElementErr(dataMarketsElementArrayResult.error, `${zenithCode}: ${dataMarketsPropertyName}`);
                                                            } else {
                                                                const dataMarketsParseResult = tryParseDataMarkets(dataMarketsElementArrayResult.value);
                                                                if (dataMarketsParseResult.isErr()) {
                                                                    return new Err(`${dataMarketsParseResult.error}: ${zenithCode}: ${dataMarketsPropertyName}`);
                                                                } else {

                                                                    const tradingMarketsElementArrayResult = exchangeElement.tryGetUndefinableElementArray(tradingMarketsPropertyName);
                                                                    if (tradingMarketsElementArrayResult.isErr()) {
                                                                        return new JsonElementErr(tradingMarketsElementArrayResult.error, `${zenithCode}: ${tradingMarketsPropertyName}`);
                                                                    } else {
                                                                        const tradingMarketsParseResult = tryParseTradingMarkets(tradingMarketsElementArrayResult.value);
                                                                        if (tradingMarketsParseResult.isErr()) {
                                                                            return new Err(`${tradingMarketsParseResult.error}: ${zenithCode}: ${tradingMarketsPropertyName}`);
                                                                        } else {

                                                                            const defaultLitMarketZenithCodeResult = exchangeElement.tryGetUndefinableStringOrNull(defaultLitMarketZenithCodePropertyName);
                                                                            if (defaultLitMarketZenithCodeResult.isErr()) {
                                                                                return new JsonElementErr(defaultLitMarketZenithCodeResult.error, `${zenithCode}: ${defaultLitMarketZenithCodePropertyName}`);
                                                                            } else {
                                                                                const defaultTradingMarketZenithCodeResult = exchangeElement.tryGetUndefinableStringOrNull(defaultTradingMarketZenithCodePropertyName);
                                                                                if (defaultTradingMarketZenithCodeResult.isErr()) {
                                                                                    return new JsonElementErr(defaultTradingMarketZenithCodeResult.error, `${zenithCode}: ${defaultTradingMarketZenithCodePropertyName}`);
                                                                                } else {
                                                                                    const exchange: Exchange = {
                                                                                        zenithCode,
                                                                                        defaultExchangeEnvironmentZenithCode,
                                                                                        symbologyCode: symbologyCodeResult.value,
                                                                                        defaultSymbolNameField: defaultSymbolNameFieldId,
                                                                                        allowedSymbolNameFields: allowedSymbolNameFieldIds,
                                                                                        defaultSymbolSearchFields: defaultSymbolSearchFieldIds,
                                                                                        allowedSymbolSearchFields: allowedSymbolSearchFieldIds,
                                                                                        abbreviatedDisplay: abbreviatedDisplayResult.value,
                                                                                        fullDisplay: fullDisplayResult.value,
                                                                                        displayPriority: displayPriorityResult.value,
                                                                                        dataMarkets: dataMarketsParseResult.value,
                                                                                        tradingMarkets: tradingMarketsParseResult.value,
                                                                                        defaultLitMarketZenithCode: defaultLitMarketZenithCodeResult.value,
                                                                                        defaultTradingMarketZenithCode: defaultTradingMarketZenithCodeResult.value,
                                                                                    };

                                                                                    return new Ok(exchange);
                                                                                }
                                                                            }
                                                                        }
                                                                    }
                                                                }
                                                            }
                                                        }
                                                    }
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        function tryParseDataMarkets(marketElements: JsonElement[] | undefined): Result<readonly DataMarket[]> {
            if (marketElements === undefined) {
                return new Ok([]);
            } else {
                const count = marketElements.length;
                const markets = new Array<DataMarket>(count);
                for (let i = 0; i < count; i++) {
                    const marketElement = marketElements[i];
                    const marketResult = DataMarket.tryParse(marketElement);
                    if (marketResult.isErr()) {
                        return new Err(`${marketResult.error}: [market index: ${i}]`);
                    } else {
                        markets[i] = marketResult.value;
                    }
                }
                return new Ok(markets);
            }
        }

        function tryParseTradingMarkets(marketElements: JsonElement[] | undefined): Result<readonly TradingMarket[]> {
            if (marketElements === undefined) {
                return new Ok([]);
            } else {
                const count = marketElements.length;
                const markets = new Array<TradingMarket>(count);
                for (let i = 0; i < count; i++) {
                    const marketElement = marketElements[i];
                    const marketResult = TradingMarket.tryParse(marketElement);
                    if (marketResult.isErr()) {
                        return new Err(`${marketResult.error}: [market index: ${i}]`);
                    } else {
                        markets[i] = marketResult.value;
                    }
                }
                return new Ok(markets);
            }
        }

        export interface Market {
            zenithCode: string;
            name: string | undefined;
            symbologyExchangeSuffixCode: string | undefined;
            displayPriority: number | undefined;
            display: string | undefined;
            symbologySupportedExchanges: readonly string[] | undefined; // Specifies the exchanges from which symbols are supported in this market. If undefined, then only symbols from the market's exchange
        }

        export namespace Market {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            type PropertyName = keyof Market;

            // eslint-disable-next-line @typescript-eslint/no-shadow
            const zenithCodePropertyName: PropertyName = 'zenithCode';
            const namePropertyName: PropertyName = 'name';
            const symbologyExchangeSuffixCodePropertyName: PropertyName = 'symbologyExchangeSuffixCode';
            const marketDisplayPriorityPropertyName: PropertyName = 'displayPriority';
            const displayPropertyName: PropertyName = 'display';
            const symbologySupportedExchangesPropertyName: PropertyName = 'symbologySupportedExchanges';

            // eslint-disable-next-line @typescript-eslint/no-shadow
            export function tryParse(marketElement: JsonElement): Result<Market> {
                const zenithCodeResult = marketElement.tryGetString(zenithCodePropertyName);
                if (zenithCodeResult.isErr()) {
                    return new JsonElementErr(zenithCodeResult.error, zenithCodePropertyName)
                } else {
                    const zenithCode = zenithCodeResult.value;
                    if (isZenithCodeBlankOrUnknown(zenithCode)) {
                        return new Err(ErrorCode.MarketConfig_MarketZenithCodeIsBlankOrUnknown);
                    } else {

                        const nameResult = marketElement.tryGetUndefinableString(namePropertyName);
                        if (nameResult.isErr()) {
                            return new JsonElementErr(nameResult.error, `${zenithCode}: ${namePropertyName}`)
                        } else {

                            const symbologyExchangeSuffixCodeResult = marketElement.tryGetUndefinableString(symbologyExchangeSuffixCodePropertyName);
                            if (symbologyExchangeSuffixCodeResult.isErr()) {
                                return new JsonElementErr(symbologyExchangeSuffixCodeResult.error, `${zenithCode}: ${symbologyExchangeSuffixCodePropertyName}`)
                            } else {

                                const displayPriorityResult = marketElement.tryGetUndefinableNumber(marketDisplayPriorityPropertyName);
                                if (displayPriorityResult.isErr()) {
                                    return new JsonElementErr(displayPriorityResult.error, `${zenithCode}: ${marketDisplayPriorityPropertyName}`)
                                } else {
                                    const displayResult = tryParseLanguagedDisplay(marketElement, displayPropertyName);
                                    if (displayResult.isErr()) {
                                        return displayResult.createType(zenithCode);
                                    } else {

                                        const symbologySupportedExchangesResult = marketElement.tryGetUndefinableStringArray(symbologySupportedExchangesPropertyName);
                                        if (symbologySupportedExchangesResult.isErr()) {
                                            return new JsonElementErr(symbologySupportedExchangesResult.error, `${zenithCode}: ${symbologySupportedExchangesPropertyName}`);
                                        } else {

                                            const market: Market = {
                                                zenithCode,
                                                name: nameResult.value,
                                                symbologyExchangeSuffixCode: symbologyExchangeSuffixCodeResult.value,
                                                displayPriority: displayPriorityResult.value,
                                                display: displayResult.value,
                                                symbologySupportedExchanges: symbologySupportedExchangesResult.value,
                                            };

                                            return new Ok(market);
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }

        export interface DataMarket extends Market {
            lit: boolean | undefined;
            boards: readonly DataMarket.Board[];
            bestTradingMarketZenithCode: string | undefined;
        }

        export namespace DataMarket {
            // eslint-disable-next-line @typescript-eslint/no-shadow
            type PropertyName = keyof DataMarket;

            // eslint-disable-next-line @typescript-eslint/no-shadow
            const litPropertyName: PropertyName = 'lit';
            const boardsPropertyName: PropertyName = 'boards';
            const bestTradingMarketZenithCodePropertyName: PropertyName = 'bestTradingMarketZenithCode';

            // eslint-disable-next-line @typescript-eslint/no-shadow
            export function tryParse(marketElement: JsonElement): Result<DataMarket> {
                const marketResult = Market.tryParse(marketElement);
                if (marketResult.isErr()) {
                    return marketResult.createType();
                } else {
                    const market = marketResult.value;
                    const zenithCode = market.zenithCode;
                    const litResult = marketElement.tryGetUndefinableBoolean(litPropertyName);
                    if (litResult.isErr()) {
                        return new JsonElementErr(litResult.error, `${zenithCode}: ${litPropertyName}`)
                    } else {

                        const boardsElementArrayResult = marketElement.tryGetUndefinableElementArray(boardsPropertyName);
                        if (boardsElementArrayResult.isErr()) {
                            return new JsonElementErr(boardsElementArrayResult.error, `${zenithCode}: ${boardsPropertyName}`);
                        } else {
                            const boardsParseResult = tryParseBoards(boardsElementArrayResult.value);
                            if (boardsParseResult.isErr()) {
                                return new Err(`${boardsParseResult.error}: ${boardsPropertyName}`);
                            } else {

                                const bestTradingMarketZenithCodeResult = marketElement.tryGetUndefinableString(bestTradingMarketZenithCodePropertyName);
                                if (bestTradingMarketZenithCodeResult.isErr()) {
                                    return new JsonElementErr(bestTradingMarketZenithCodeResult.error, `${zenithCode}: ${bestTradingMarketZenithCodePropertyName}`);
                                } else {

                                    const dataMarket: DataMarket = {
                                        ...market,
                                        lit: litResult.value,
                                        boards: boardsParseResult.value,
                                        bestTradingMarketZenithCode: bestTradingMarketZenithCodeResult.value,
                                    };

                                    return new Ok(dataMarket);
                                }
                            }
                        }
                    }
                }
            }

            function tryParseBoards(boardElements: JsonElement[] | undefined): Result<readonly Board[]> {
                if (boardElements === undefined) {
                    return new Ok([]);
                } else {
                    const count = boardElements.length;
                    const boards = new Array<Board>(count);
                    for (let i = 0; i < count; i++) {
                        const boardElement = boardElements[i];
                        const boardResult = Board.tryParse(boardElement);
                        if (boardResult.isErr()) {
                            return new Err(`${boardResult.error}: [Board index: ${i}]`);
                        } else {
                            boards[i] = boardResult.value;
                        }
                    }
                    return new Ok(boards);
                }
            }

            export interface Board {
                zenithCode: string;
                name: string | undefined;
                display: string | undefined;
            }

            export namespace Board {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const zenithCodePropertyName = 'zenithCode';
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const namePropertyName = 'name';
                // eslint-disable-next-line @typescript-eslint/no-shadow
                const displayPropertyName = 'display';


                // eslint-disable-next-line @typescript-eslint/no-shadow
                export function tryParse(boardElement: JsonElement): Result<Board> {
                    const zenithCodeResult = boardElement.tryGetString(zenithCodePropertyName);
                    if (zenithCodeResult.isErr()) {
                        return new JsonElementErr(zenithCodeResult.error, zenithCodePropertyName)
                    } else {
                        const zenithCode = zenithCodeResult.value;
                        if (isZenithCodeBlankOrUnknown(zenithCode)) {
                            return new Err(ErrorCode.MarketConfig_MarketBoardZenithCodeIsBlankOrUnknown)
                        } else {
                            const nameResult = boardElement.tryGetUndefinableString(namePropertyName);
                            if (nameResult.isErr()) {
                                return new JsonElementErr(nameResult.error, `${zenithCode}: ${namePropertyName}`)
                            } else {
                                const displayResult = tryParseLanguagedDisplay(boardElement, displayPropertyName);
                                if (displayResult.isErr()) {
                                    return displayResult.createType(zenithCode);
                                } else {

                                    const board: Board = {
                                        zenithCode,
                                        name: nameResult.value,
                                        display: displayResult.value,
                                    };

                                    return new Ok(board);

                                }
                            }
                        }
                    }
                }
            }
        }

        export interface TradingMarket extends Market {
            symbologicalCorrespondingDataMarketZenithCode: string | undefined; // Get Symbology information from this DataMarket. If undefined, tries to find DataMarket with same Zenith code
            allowedOrderTypes: readonly OrderTypeId[]; // EquityOrderType[],
            defaultOrderType: OrderTypeId; // EquityOrderType, // Recommended order type to be initially shown in an order pad
            allowedOrderTimeInForces: readonly TimeInForceId[]; // EquityOrderValidity[],
            defaultOrderTimeInForce: TimeInForceId; // EquityOrderValidity, // Recommended order validity to be initially shown in an order pad
            marketOrderTypeAllowedOrderTimeInForces: readonly TimeInForceId[]; // EquityOrderValidity[], // Order validities for Market Order Type.  If undefined, use AllowedOrderValidities
            allowedOrderTriggerTypes: readonly OrderTriggerTypeId[]; // OrderCondition.Name[], // If missing, then no conditional orders (immediate only)
            allowedOrderTradeTypes: readonly OrderTradeTypeId[]; // OrderTradeType[],
            // quantityMultiple: Integer, // Defaults to 1
        }

        export namespace TradingMarket {
            export const defaultAllowedOrderTypeIds: readonly OrderTypeId[] = [OrderTypeId.Limit];
            export const defaultAllowedOrderTimeInForceIds: readonly TimeInForceId[] = [TimeInForceId.GoodTillCancel];
            export const defaultAllowedOrderTriggerTypeIds: readonly OrderTriggerTypeId[] = [OrderTriggerTypeId.Immediate];
            export const defaultAllowedOrderTradeTypeIds: readonly OrderTradeTypeId[] = [OrderTradeTypeId.Buy, OrderTradeTypeId.Sell];

            // eslint-disable-next-line @typescript-eslint/no-shadow
            type PropertyName = keyof TradingMarket;

            // eslint-disable-next-line @typescript-eslint/no-shadow
            const symbologicalCorrespondingDataMarketZenithCodePropertyName: PropertyName = 'symbologicalCorrespondingDataMarketZenithCode';
            const allowedOrderTypesPropertyName: PropertyName = 'allowedOrderTypes';
            const defaultOrderTypePropertyName: PropertyName = 'defaultOrderType';
            const allowedOrderTimeInForcesPropertyName: PropertyName = 'allowedOrderTimeInForces';
            const defaultOrderTimeInForcePropertyName: PropertyName = 'defaultOrderTimeInForce';
            const marketOrderTypeAllowedOrderTimeInForcesPropertyName: PropertyName = 'marketOrderTypeAllowedOrderTimeInForces';
            const allowedOrderTriggerTypesPropertyName: PropertyName = 'allowedOrderTriggerTypes';
            const allowedOrderTradeTypesPropertyName: PropertyName = 'allowedOrderTradeTypes';

            // eslint-disable-next-line @typescript-eslint/no-shadow
            export function tryParse(marketElement: JsonElement): Result<TradingMarket> {
                const marketResult = Market.tryParse(marketElement);
                if (marketResult.isErr()) {
                    return marketResult.createType();
                } else {
                    const market = marketResult.value;
                    const zenithCode = market.zenithCode;

                    const symbologicalCorrespondingDataMarketZenithCodeResult = marketElement.tryGetUndefinableString(symbologicalCorrespondingDataMarketZenithCodePropertyName);
                    if (symbologicalCorrespondingDataMarketZenithCodeResult.isErr()) {
                        return new JsonElementErr(symbologicalCorrespondingDataMarketZenithCodeResult.error, symbologicalCorrespondingDataMarketZenithCodePropertyName);
                    } else {

                        const allowedOrderTypeIdsResult = tryGetUndefinableOrderTypeIdArray(marketElement, allowedOrderTypesPropertyName);
                        if (allowedOrderTypeIdsResult.isErr()) {
                            return new Err(`${allowedOrderTypeIdsResult.error}: ${zenithCode}`);
                        } else {
                            let allowedOrderTypeIds: readonly OrderTypeId[] | undefined = allowedOrderTypeIdsResult.value;
                            if (allowedOrderTypeIds === undefined || allowedOrderTypeIds.length === 0) {
                                allowedOrderTypeIds = defaultAllowedOrderTypeIds;
                            }

                            const defaultOrderTypeIdResult = tryGetUndefinableOrderTypeId(marketElement, defaultOrderTypePropertyName);
                            if (defaultOrderTypeIdResult.isErr()) {
                                return new Err(`${defaultOrderTypeIdResult.error}: ${zenithCode}`);
                            } else {
                                let defaultOrderTypeId = defaultOrderTypeIdResult.value;
                                if (defaultOrderTypeId === undefined) {
                                    defaultOrderTypeId = allowedOrderTypeIds[0];
                                }

                                const allowedOrderTimeInForceIdsResult = tryGetUndefinableTimeInForceIdArray(marketElement, allowedOrderTimeInForcesPropertyName);
                                if (allowedOrderTimeInForceIdsResult.isErr()) {
                                    return new Err(`${allowedOrderTimeInForceIdsResult.error}: ${zenithCode}`);
                                } else {
                                    let allowedOrderTimeInForceIds: readonly TimeInForceId[] | undefined = allowedOrderTimeInForceIdsResult.value;
                                    if (allowedOrderTimeInForceIds === undefined || allowedOrderTimeInForceIds.length === 0) {
                                        allowedOrderTimeInForceIds = defaultAllowedOrderTimeInForceIds;
                                    }

                                    const defaultOrderTimeInForceIdResult = tryGetUndefinableTimeInForceId(marketElement, defaultOrderTimeInForcePropertyName);
                                    if (defaultOrderTimeInForceIdResult.isErr()) {
                                        return new Err(`${defaultOrderTimeInForceIdResult.error}: ${zenithCode}`);
                                    } else {
                                        let defaultOrderTimeInForceId = defaultOrderTimeInForceIdResult.value;
                                        if (defaultOrderTimeInForceId === undefined) {
                                            defaultOrderTimeInForceId = allowedOrderTimeInForceIds[0];
                                        }

                                        const marketOrderTypeAllowedOrderTimeInForceIdsResult = tryGetUndefinableTimeInForceIdArray(marketElement, marketOrderTypeAllowedOrderTimeInForcesPropertyName);
                                        if (marketOrderTypeAllowedOrderTimeInForceIdsResult.isErr()) {
                                            return new Err(`${marketOrderTypeAllowedOrderTimeInForceIdsResult.error}: ${zenithCode}`);
                                        } else {
                                            let marketOrderTypeAllowedOrderTimeInForceIds: readonly TimeInForceId[] | undefined = marketOrderTypeAllowedOrderTimeInForceIdsResult.value;
                                            if (marketOrderTypeAllowedOrderTimeInForceIds === undefined || marketOrderTypeAllowedOrderTimeInForceIds.length === 0) {
                                                marketOrderTypeAllowedOrderTimeInForceIds = allowedOrderTimeInForceIds;
                                            }

                                            const allowedOrderTriggerTypeIdsResult = tryGetUndefinableOrderTriggerTypeIdArray(marketElement, allowedOrderTriggerTypesPropertyName);
                                            if (allowedOrderTriggerTypeIdsResult.isErr()) {
                                                return new Err(`${allowedOrderTriggerTypeIdsResult.error}: ${zenithCode}`);
                                            } else {
                                                let allowedOrderTriggerTypeIds: readonly OrderTriggerTypeId[] | undefined = allowedOrderTriggerTypeIdsResult.value;
                                                if (allowedOrderTriggerTypeIds === undefined || allowedOrderTriggerTypeIds.length === 0) {
                                                    allowedOrderTriggerTypeIds = defaultAllowedOrderTriggerTypeIds;
                                                }

                                                const allowedOrderTradeTypeIdsResult = tryGetUndefinableOrderTradeTypeIdArray(marketElement, allowedOrderTradeTypesPropertyName);
                                                if (allowedOrderTradeTypeIdsResult.isErr()) {
                                                    return new Err(`${allowedOrderTradeTypeIdsResult.error}: ${zenithCode}`);
                                                } else {
                                                    let allowedOrderTradeTypeIds: readonly OrderTradeTypeId[] | undefined = allowedOrderTradeTypeIdsResult.value;
                                                    if (allowedOrderTradeTypeIds === undefined || allowedOrderTradeTypeIds.length === 0) {
                                                        allowedOrderTradeTypeIds = defaultAllowedOrderTradeTypeIds;
                                                    }

                                                    const tradingMarket: TradingMarket = {
                                                        ...market,
                                                        symbologicalCorrespondingDataMarketZenithCode: symbologicalCorrespondingDataMarketZenithCodeResult.value,
                                                        allowedOrderTypes: allowedOrderTypeIds,
                                                        defaultOrderType: defaultOrderTypeId,
                                                        allowedOrderTimeInForces: allowedOrderTimeInForceIds,
                                                        defaultOrderTimeInForce: defaultOrderTimeInForceId,
                                                        marketOrderTypeAllowedOrderTimeInForces: marketOrderTypeAllowedOrderTimeInForceIds,
                                                        allowedOrderTriggerTypes: allowedOrderTriggerTypeIds,
                                                        allowedOrderTradeTypes: allowedOrderTradeTypeIds,
                                                    };

                                                    return new Ok(tradingMarket);
                                                }
                                            }
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    export interface ExchangeEnvironment {
        zenithCode: ExchangeEnvironmentZenithCode;
        display: string | undefined;
    }

    export namespace ExchangeEnvironment {
        // eslint-disable-next-line @typescript-eslint/no-shadow
        type PropertyName = keyof ExchangeEnvironment;

        const zenithCodePropertyName: PropertyName = 'zenithCode';
        const displayPropertyName: PropertyName = 'display';

        // eslint-disable-next-line @typescript-eslint/no-shadow
        export function tryParse(exchangeEnvironmentElement: JsonElement): Result<ExchangeEnvironment> {
            const zenithCodeResult = exchangeEnvironmentElement.tryGetStringOrNull(zenithCodePropertyName);
            if (zenithCodeResult.isErr()) {
                return new JsonElementErr(zenithCodeResult.error, zenithCodePropertyName)
            } else {
                const zenithCode = zenithCodeResult.value;
                if (zenithCode !== null && isZenithCodeBlankOrUnknown(zenithCode)) {
                    return new Err(ErrorCode.MarketConfig_ExchangeEnvironmentZenithCodeIsBlankOrUnknown)
                } else {
                    const displayResult = tryParseLanguagedDisplay(exchangeEnvironmentElement, displayPropertyName);
                    if (displayResult.isErr()) {
                        return displayResult.createType(zenithCode === null ? 'null' : zenithCode);
                    } else {
                        const environment: ExchangeEnvironment = {
                            zenithCode,
                            display: displayResult.value,
                        };

                        return new Ok(environment);
                    }
                }
            }
        }
    }

    export function tryParseLanguagedDisplay(jsonElement: JsonElement, displayElementName: string): JsonElementResult<string | undefined> {
        const displayElementResult = jsonElement.tryGetUndefinableElement(displayElementName);
        if (displayElementResult.isErr()) {
            return new JsonElementErr(displayElementResult.error, displayElementName);
        } else {
            const displayElement = displayElementResult.value;

            if (displayElement === undefined) {
                return new Ok(undefined);
            } else {
                const languageCode = I18nStrings.getlanguageCode();
                const displayResult = displayElement.tryGetUndefinableString(languageCode);
                if (displayResult.isErr()) {
                    return new JsonElementErr(displayResult.error, displayElementName);
                } else {
                    return new Ok(displayResult.value);
                }
            }
        }
    }

    function isZenithCodeBlankOrUnknown(zenithCode: string): boolean {
        return zenithCode === '' || zenithCode === unknownZenithCode;
    }

    function tryGetUndefinableSymbolFieldId(element: JsonElement, propertyName: string): Result<SymbolFieldId | undefined> {
        const jsonValueResult = element.tryGetUndefinableString(propertyName);
        if (jsonValueResult.isErr()) {
            return new JsonElementErr(jsonValueResult.error, propertyName);
        } else {
            const jsonValue = jsonValueResult.value;
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                const id = SymbolField.tryJsonValueToId(jsonValue);
                if (id === undefined) {
                    return new Err(`Invalid SymbolFieldId: ${jsonValue}`);
                } else {
                    return new Ok(id);
                }
            }
        }
    }

    function tryGetUndefinableSymbolFieldIdArray(element: JsonElement, propertyName: string): Result<SymbolFieldId[] | undefined> {
        const jsonValueResult = element.tryGetUndefinableStringArray(propertyName);
        if (jsonValueResult.isErr()) {
            return new JsonElementErr(jsonValueResult.error, propertyName);
        } else {
            const jsonValue = jsonValueResult.value;
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                const idArray = SymbolField.tryJsonValueArrayToIdArray(jsonValue, false);
                if (idArray === undefined) {
                    return new Err(`Invalid SymbolFieldId: ${CommaText.fromStringArray(jsonValue)}`);
                } else {
                    return new Ok(idArray);
                }
            }
        }
    }

    function tryGetUndefinableOrderTypeId(element: JsonElement, propertyName: string): Result<OrderTypeId | undefined> {
        const jsonValueResult = element.tryGetUndefinableString(propertyName);
        if (jsonValueResult.isErr()) {
            return new JsonElementErr(jsonValueResult.error, propertyName);
        } else {
            const jsonValue = jsonValueResult.value;
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                const id = OrderType.tryJsonValueToId(jsonValue);
                if (id === undefined) {
                    return new Err(`Invalid OrderTypeId: ${jsonValue}`);
                } else {
                    return new Ok(id);
                }
            }
        }
    }

    function tryGetUndefinableOrderTypeIdArray(element: JsonElement, propertyName: string): Result<OrderTypeId[] | undefined> {
        const jsonValueResult = element.tryGetUndefinableStringArray(propertyName);
        if (jsonValueResult.isErr()) {
            return new JsonElementErr(jsonValueResult.error, propertyName);
        } else {
            const jsonValue = jsonValueResult.value;
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                const idArray = OrderType.tryJsonValueArrayToIdArray(jsonValue, false);
                if (idArray === undefined) {
                    return new Err(`Invalid OrderTypeId: ${CommaText.fromStringArray(jsonValue)}`);
                } else {
                    return new Ok(idArray);
                }
            }
        }
    }

    function tryGetUndefinableTimeInForceId(element: JsonElement, propertyName: string): Result<TimeInForceId | undefined> {
        const jsonValueResult = element.tryGetUndefinableString(propertyName);
        if (jsonValueResult.isErr()) {
            return new JsonElementErr(jsonValueResult.error, propertyName);
        } else {
            const jsonValue = jsonValueResult.value;
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                const id = TimeInForce.tryJsonValueToId(jsonValue);
                if (id === undefined) {
                    return new Err(`Invalid TimeInForceId: ${jsonValue}`);
                } else {
                    return new Ok(id);
                }
            }
        }
    }

    function tryGetUndefinableTimeInForceIdArray(element: JsonElement, propertyName: string): Result<TimeInForceId[] | undefined> {
        const jsonValueResult = element.tryGetUndefinableStringArray(propertyName);
        if (jsonValueResult.isErr()) {
            return new JsonElementErr(jsonValueResult.error, propertyName);
        } else {
            const jsonValue = jsonValueResult.value;
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                const idArray = TimeInForce.tryJsonValueArrayToIdArray(jsonValue, false);
                if (idArray === undefined) {
                    return new Err(`Invalid TimeInForceId: ${CommaText.fromStringArray(jsonValue)}`);
                } else {
                    return new Ok(idArray);
                }
            }
        }
    }

    function tryGetUndefinableOrderTriggerTypeIdArray(element: JsonElement, propertyName: string): Result<OrderTriggerTypeId[] | undefined> {
        const jsonValueResult = element.tryGetUndefinableStringArray(propertyName);
        if (jsonValueResult.isErr()) {
            return new JsonElementErr(jsonValueResult.error, propertyName);
        } else {
            const jsonValue = jsonValueResult.value;
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                const idArray = OrderTriggerType.tryJsonValueArrayToIdArray(jsonValue, false);
                if (idArray === undefined) {
                    return new Err(`Invalid OrderTriggerTypeId: ${CommaText.fromStringArray(jsonValue)}`);
                } else {
                    return new Ok(idArray);
                }
            }
        }
    }

    function tryGetUndefinableOrderTradeTypeIdArray(element: JsonElement, propertyName: string): Result<OrderTradeTypeId[] | undefined> {
        const jsonValueResult = element.tryGetUndefinableStringArray(propertyName);
        if (jsonValueResult.isErr()) {
            return new JsonElementErr(jsonValueResult.error, propertyName);
        } else {
            const jsonValue = jsonValueResult.value;
            if (jsonValue === undefined) {
                return new Ok(undefined);
            } else {
                const idArray = OrderTradeType.tryJsonValueArrayToIdArray(jsonValue, false);
                if (idArray === undefined) {
                    return new Err(`Invalid OrderTriggerTypeId: ${CommaText.fromStringArray(jsonValue)}`);
                } else {
                    return new Ok(idArray);
                }
            }
        }
    }
}
