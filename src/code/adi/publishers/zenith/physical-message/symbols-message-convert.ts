import {
    AssertInternalError,
    DecimalFactory,
    getErrorMessage,
    Ok,
    Result
} from '@pbkware/js-utils';
import {
    ErrorCode,
    ifDefined,
    ZenithDataError
} from "../../../../sys";
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    AurcChangeTypeId,
    DataIvemAttributes,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    RequestErrorDataMessages,
    SearchSymbolsDataDefinition,
    SymbolFieldId,
    SymbolsDataMessage,
    TmcLeg,
    ZenithEnvironmentedValueParts,
    ZenithProtocolCommon,
    ZenithSymbol
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithMarketMyxConvert } from './zenith-market-myx-convert';

export class SymbolsMessageConvert extends MessageConvert {
    constructor(private readonly _decimalFactory: DecimalFactory) {
        super();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof SearchSymbolsDataDefinition) {
            return this.createSearchPublishMessage(definition);
        } else {
            // if (definition instanceof SymbolsDataDefinition) {
            //     return this.createSubUnsubMessage(definition, request.typeId);
            // } else {
                throw new AssertInternalError('SMCCRM1111999428', definition.description);
            // }
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.SMCPMC588329999199, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.SMCPMD558382000, actionId.toString(10));
            } else {
                if (message.Topic as ZenithProtocol.MarketController.TopicName !== ZenithProtocol.MarketController.TopicName.SearchSymbols) {
                    throw new ZenithDataError(ErrorCode.SMCPMP5885239991, message.Topic);
                } else {
                    const publishMsg = message as ZenithProtocol.MarketController.SearchSymbols.PublishPayloadMessageContainer;
                    const data = publishMsg.Data;
                    if (data === undefined || data === null) {
                        if (data === undefined && subscription.errorWarningCount === 0) {
                            return this.createDataMessage(subscription, []);
                        } else {
                            return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription, AdiPublisherSubscription.AllowedRetryTypeId.Never);
                        }
                    } else {
                        const changes = this.parsePublishPayload(data);
                        return this.createDataMessage(subscription, changes);
                    }
                }
            }
        }
    }

    // function convertMarketsArray(marketIds: readonly MarketId[] | undefined) {
    //     if (marketIds === undefined) {
    //         return undefined;
    //     } else {
    //         const count = marketIds.length;
    //         const result = new Array<string>(count);
    //         for (let i = 0; i < count; i++) {
    //             result[i] = ZenithConvert.EnvironmentedMarket.fromId(marketIds[i]);
    //         }
    //         return result;
    //     }
    // }

    // function convertField(id: SearchSymbolsDataDefinition.FieldId) {
    //     switch (id) {
    //         case SearchSymbolsDataDefinition.FieldId.Code: return Zenith.MarketController.SearchSymbols.SearchField.Code;
    //         case SearchSymbolsDataDefinition.FieldId.Name: return Zenith.MarketController.SearchSymbols.SearchField.Name;
    //         // case SearchSymbolsDataDefinition.FieldId.Ticker: return Zenith.MarketController.SearchSymbols.AlternateKey.Ticker;
    //         // case SearchSymbolsDataDefinition.FieldId.Gics: return Zenith.MarketController.SearchSymbols.AlternateKey.Gics;
    //         // case SearchSymbolsDataDefinition.FieldId.Isin: return Zenith.MarketController.SearchSymbols.AlternateKey.Isin;
    //         // case SearchSymbolsDataDefinition.FieldId.Base: return Zenith.MarketController.SearchSymbols.AlternateKey.Base;
    //         // case SearchSymbolsDataDefinition.FieldId.Ric: return Zenith.MarketController.SearchSymbols.AlternateKey.Ric;
    //         default:
    //             // throw new UnreachableCaseError('MCSCFFI11945', id);
    //     }
    // }

    // function convertFields(ids: readonly SearchSymbolsDataDefinition.FieldId[] | undefined) {
    //     if (ids === undefined) {
    //         return undefined;
    //     } else {
    //         const count = ids.length;
    //         const zenithFields = new Array<string>(count);
    //         for (let i = 0; i < count; i++) {
    //             const id = ids[i];
    //             zenithFields[i] = convertField(id);
    //         }
    //         return zenithFields.join(Zenith.MarketController.SearchSymbols.fieldSeparator);
    //     }
    // }

    // function createPublishMessage(definition: SearchSymbolsDataDefinition) {
    //     const exchange = definition.exchangeId === undefined ? undefined :
    //         ZenithConvert.EnvironmentedExchange.fromId(definition.exchangeId);
    //     const targetDate = definition.targetDate === undefined ? undefined :
    //     ZenithConvert.Date.DateTimeIso8601.fromDate(definition.targetDate);

    //     const result: Zenith.MarketController.SearchSymbols.PublishMessageContainer = {
    //         Controller: Zenith.MessageContainer.Controller.Market,
    //         Topic: Zenith.MarketController.TopicName.SearchSymbols,
    //         Action: Zenith.MessageContainer.Action.Publish,
    //         TransactionID: AdiPublisherRequest.getNextTransactionId(),
    //         Data: {
    //             SearchText: definition.searchText,
    //             Exchange: exchange,
    //             Markets: convertMarketsArray(definition.marketIds),
    //             Field: convertFields(definition.fieldIds),
    //             IsPartial: definition.isPartial,
    //             IsCaseSensitive: definition.isCaseSensitive,
    //             PreferExact: definition.preferExact,
    //             StartIndex: definition.startIndex,
    //             Count: definition.count,
    //             TargetDate: targetDate,
    //             ShowFull: definition.showFull,
    //             Account: definition.accountId,
    //             CFI: definition.cfi,
    //         }
    //     };

    //     return result;
    // }

    private createSearchPublishMessage(definition: SearchSymbolsDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        // const exchange = definition.zenithExchangeCode === undefined
        //     ? undefined
        //     : ZenithConvert.EnvironmentedExchange.fromId(definition.zenithExchangeCode);
        const ivemClass = definition.ivemClassId === undefined
            ? undefined
            : ZenithConvert.SymbolClass.fromId(definition.ivemClassId);
        const conditions = this.createSearchConditions(definition.conditions);
        const expiryDateMin = definition.expiryDateMin === undefined
            ? undefined
            : ZenithConvert.Date.DateTimeIso8601.fromDate(definition.expiryDateMin);
        const expiryDateMax = definition.expiryDateMax === undefined
            ? undefined
            : ZenithConvert.Date.DateTimeIso8601.fromDate(definition.expiryDateMax);
        const strikePriceMin = definition.strikePriceMin === undefined
            ? undefined
            : definition.strikePriceMin.toNumber();
        const strikePriceMax = definition.strikePriceMax === undefined
            ? undefined
            : definition.strikePriceMax.toNumber();
        const zenithMarketCodes = definition.marketZenithCodes;

        const result: ZenithProtocol.MarketController.SearchSymbols.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Market,
            Topic: ZenithProtocol.MarketController.TopicName.SearchSymbols,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                CFI: definition.cfi,
                Class: ivemClass,
                CombinationLeg: definition.combinationLeg,
                Conditions: conditions,
                Count: definition.count,
                Exchange: definition.exchangeZenithCode,
                ExpiryDateMin: expiryDateMin,
                ExpiryDateMax: expiryDateMax,
                FullSymbol: definition.fullSymbol,
                Index: definition.index,
                Markets: zenithMarketCodes === undefined ? undefined : zenithMarketCodes.slice(),
                PreferExact: definition.preferExact,
                StartIndex: definition.startIndex,
                StrikePriceMin: strikePriceMin,
                StrikePriceMax: strikePriceMax,
                // Field: convertFields(definition.fieldIds),
                // IsPartial: definition.isPartial,
                // IsCaseSensitive: definition.isCaseSensitive,
                // TargetDate: targetDate,
                // Account: definition.accountId,
            }
        };

        return new Ok(result);
    }

    private createSearchConditions(conditions: SearchSymbolsDataDefinition.Condition[] | undefined) {
        if (conditions === undefined) {
            return undefined;
        } else {
            const count = conditions.length;
            let result: ZenithProtocol.MarketController.SearchSymbols.Condition[] = [];
            for (let i = 0; i < count; i++) {
                const condition = conditions[i];
                result = [...result, ...this.createFieldSearchConditions(condition)];
            }
            return result;
        }
    }

    private createFieldSearchConditions(condition: SearchSymbolsDataDefinition.Condition) {
        const fieldIds = condition.fieldIds;
        let result: ZenithProtocol.MarketController.SearchSymbols.Condition[];
        if (fieldIds === undefined) {
            result = [this.createFieldSearchCondition(undefined, undefined, condition)];
        } else {
            const maxCount = fieldIds.length;
            result = new Array<ZenithProtocol.MarketController.SearchSymbols.Condition>(maxCount);
            let count = 0;
            const containsCode = fieldIds.includes(SymbolFieldId.Code);
            const containsName = fieldIds.includes(SymbolFieldId.Name);
            if (containsCode && containsName) {
                result[count++] = this.createFieldSearchCondition(undefined, undefined, condition); // undefined field = code + name
            } else {
                if (containsCode) {
                    const field = ZenithProtocol.MarketController.SearchSymbols.Condition.Field.Code;
                    result[count++] = this.createFieldSearchCondition(field, undefined, condition);
                }
                if (containsName) {
                    const field = ZenithProtocol.MarketController.SearchSymbols.Condition.Field.Name;
                    result[count++] = this.createFieldSearchCondition(field, undefined, condition);
                }
            }

            for (const fieldId of fieldIds) {
                const alternateKey = ZenithConvert.SymbolAlternateKey.fromId(fieldId);
                if (alternateKey !== undefined) {
                    const field = ZenithProtocol.MarketController.SearchSymbols.Condition.Field.Alternate;
                    result[count++] = this.createFieldSearchCondition(field, alternateKey, condition);
                }
            }

            result.length = count;
        }

        return result;
    }

    private createFieldSearchCondition(
        field: ZenithProtocol.MarketController.SearchSymbols.Condition.Field | undefined,
        alternateKey: ZenithProtocol.MarketController.SearchSymbols.AlternateKey | undefined,
        condition: SearchSymbolsDataDefinition.Condition
    ) {
        const match = condition.matchIds === undefined
            ? undefined
            : ZenithConvert.SymbolConditionMatch.fromIds(condition.matchIds);

        const group = condition.group ?? '--Common%%';

        const result: ZenithProtocol.MarketController.SearchSymbols.Condition = {
            Field: field,
            Group: group,
            IsCaseSensitive: condition.isCaseSensitive,
            Key: alternateKey,
            Match: match,
            Text: condition.text,
        };

        return result;
    }


    // private createSubUnsubMessage(definition: SymbolsDataDefinition, requestTypeId: AdiPublisherRequest.TypeId) {
    //     const topicName = Zenith.MarketController.TopicName.Symbols;
    //     const market = ZenithConvert.EnvironmentedMarket.fromId(definition.marketId);
    //     const zenithClass = ZenithConvert.IvemClass.fromId(definition.classId);
    //     const topic = topicName + Zenith.topicArgumentsAnnouncer + zenithClass + Zenith.topicArgumentsSeparator + market;

    //     const result: Zenith.SubUnsubMessageContainer = {
    //         Controller: Zenith.MessageContainer.Controller.Trading,
    //         Topic: topic,
    //         Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
    //     };

    //     return result;
    // }

    private createDataMessage(subscription: AdiPublisherSubscription, changes: SymbolsDataMessage.Change[]) {
        const dataMessage = new SymbolsDataMessage();
        dataMessage.dataItemId = subscription.dataItemId;
        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
        dataMessage.changes = changes;
        return dataMessage;
    }

    private parsePublishPayload(symbols: ZenithProtocol.MarketController.SearchSymbols.Detail[] | null) {
        let result: SymbolsDataMessage.Change[];
        if (symbols === null) {
            const change: SymbolsDataMessage.ClearChange = {
                typeId: AurcChangeTypeId.Clear,
            };
            result = [change];
        } else {
            result = new Array<SymbolsDataMessage.Change>(symbols.length);

            for (let index = 0; index < symbols.length; index++) {
                const symbol = symbols[index] as ZenithProtocol.MarketController.SearchSymbols.FullDetail;
                result[index] = this.createAddChange(AurcChangeTypeId.Add, symbol);
            }
        }

        return result;
    }

    // function parseSubPayload(changes: Zenith.MarketController.Symbols.Change[]) {
    //     const result = new Array<SymbolsDataMessage.Change>(changes.length);

    //     for (let index = 0; index < changes.length; index++) {
    //         const change = changes[index];
    //         result[index] = parseChange(change);
    //     }

    //     return result;
    // }

    // function parseChange(change: Zenith.MarketController.Symbols.Change) {
    //     const changeTypeId = ZenithConvert.AurcChangeType.toId(change.O);
    //     switch (changeTypeId) {
    //         case AurcChangeTypeId.Clear: return createClearChange();
    //         case AurcChangeTypeId.Remove: return createRemoveChange(change.Symbol);
    //         case AurcChangeTypeId.Update:
    //             const updateDetail = change.Symbol as Zenith.MarketController.Symbols.FullDetail;
    //             return createUpdateChange(changeTypeId, updateDetail);
    //         case AurcChangeTypeId.Add:
    //             const addDetail = change.Symbol as Zenith.MarketController.Symbols.FullDetail;
    //             return createAddChange(changeTypeId, addDetail);
    //         default: throw new UnreachableCaseError('SMCPC677777488', changeTypeId);
    //     }
    // }

    // function createClearChange() {
    //     const change: SymbolsDataMessage.Change = {
    //         typeId: AurcChangeTypeId.Clear,
    //     };

    //     return change;
    // }

    // function createRemoveChange(detail: Zenith.MarketController.Symbols.Detail | undefined) {
    //     if (detail === undefined) {
    //         throw new AssertInternalError('SMCCRC232200095534');
    //     } else {
    //         const { marketId, environmentId } = ZenithConvert.EnvironmentedMarket.toId(detail.Market);
    //         const dataIvemId = MarketIvemId.createFromCodeMarket(detail.Code, marketId);
    //         if (environmentId !== ExchangeInfo.getDefaultEnvironmentId()) {
    //             dataIvemId.explicitEnvironmentId = environmentId;
    //         }

    //         const change: SymbolsDataMessage.RemoveChange = {
    //             typeId: AurcChangeTypeId.Remove,
    //             dataIvemId,
    //         };

    //         return change;
    //     }
    // }

    // function createUpdateChange(changeTypeId: AurcChangeTypeId, detail: Zenith.MarketController.Symbols.FullDetail | undefined) {
    //     if (detail === undefined) {
    //         throw new AssertInternalError('SMCCUCFD232200095534');
    //     } else {
    //         try {
    //             const { dataIvemId, exchangeId } = parseDataIvemIdExchangeName(detail);

    //             const result: SymbolsDataMessage.UpdateChange = {
    //                 typeId: changeTypeId,
    //                 dataIvemId,
    //                 ivemClassId: ZenithConvert.IvemClass.toId(detail.Class),
    //                 subscriptionDataIds: ZenithConvert.SubscriptionData.toIdArray(detail.SubscriptionData),
    //                 tradingMarketIds: parseTradingMarkets(detail.TradingMarkets),
    //                 exchangeId,
    //                 name: detail.Name,
    //                 // ShowFull fields are only included if specified in request
    //                 cfi: detail.CFI,
    //                 depthDirectionId: ifDefinedAndNotNull(detail.DepthDirection, x => ZenithConvert.DepthDirection.toId(x)),
    //                 isIndex: detail.IsIndex,
    //                 expiryDate: ifDefinedAndNotNull(detail.ExpiryDate, x => ZenithConvert.Date.DateYYYYMMDD.toSourceTzOffsetDate(x)),
    //                 strikePrice: newUndefinableNullableDecimal(detail.StrikePrice),
    //                 exerciseTypeId: ifDefinedAndNotNull(detail.ExerciseType, x => ZenithConvert.ExerciseType.toId(x)),
    //                 callOrPutId: ifDefinedAndNotNull(detail.CallOrPut, x => ZenithConvert.CallOrPut.toId(x)),
    //                 contractSize: detail.ContractSize,
    //                 alternateCodes: detail.Alternates === null ? null : parseAlternates(exchangeId, detail.Alternates),
    //                 attributes: detail.Attributes === null ? null : parseAttributes(exchangeId, detail.Attributes),
    //                 tmcLegs: detail.Legs === null ? null : parseLegs(detail.Legs),
    //                 categories: detail.Categories,
    //             };

    //             return result;
    //         } catch (error) {
    //             throw new ZenithDataError(ErrorCode.SMCCUCFD1212943448, `${error}: ${detail}`);
    //         }
    //     }
    // }

    private createAddChange(changeTypeId: AurcChangeTypeId, detail: ZenithProtocol.MarketController.SearchSymbols.FullDetail | undefined) {
        if (detail === undefined) {
            throw new AssertInternalError('SMCCACFFD232200095534');
        } else {
            try {
                const exchangeZenithCode = this.getExchange(detail);
                const zenithExchangeCode = ZenithEnvironmentedValueParts.getValueFromString(exchangeZenithCode);
                const detailAlternate = detail.Alternate;
                const alternateCodes = detailAlternate === undefined ? {} : ZenithConvert.SymbolAlternate.toAdi(detailAlternate);
                const symbol: ZenithSymbol = {
                    code: detail.Code,
                    marketZenithCode: detail.Market,
                }

                const result: SymbolsDataMessage.AddChange = {
                    typeId: changeTypeId,
                    symbol,
                    exchangeZenithCode,
                    ivemClassId: ZenithConvert.IvemClass.toId(detail.Class),
                    subscriptionDataTypeIds: ZenithConvert.SubscriptionData.toIdArray(detail.SubscriptionData),
                    tradingMarketZenithCodes: detail.TradingMarkets,
                    name: detail.Name,
                    // ShowFull fields are only included if specified in request
                    cfi: detail.CFI,
                    depthDirectionId: ifDefined(detail.DepthDirection, x => ZenithConvert.DepthDirection.toId(x)),
                    isIndex: detail.IsIndex,
                    expiryDate: ifDefined(detail.ExpiryDate, x => ZenithConvert.Date.DashedYyyyMmDdDate.toSourceTzOffsetDate(x)),
                    strikePrice: this._decimalFactory.newUndefinableDecimal(detail.StrikePrice),
                    exerciseTypeId: ifDefined(detail.ExerciseType, x => ZenithConvert.ExerciseType.toId(x)),
                    callOrPutId: ifDefined(detail.CallOrPut, x => ZenithConvert.CallOrPut.toId(x)),
                    contractSize: this._decimalFactory.newUndefinableDecimal(detail.ContractSize),
                    lotSize: detail.LotSize,
                    alternateCodes,
                    attributes: this.parseAttributes(zenithExchangeCode, detail.Attributes),
                    tmcLegs: detail.Legs === null ? undefined : this.parseLegs(detail.Legs, exchangeZenithCode),
                    categories: detail.Categories,
                };

                return result;
            } catch (error) {
                throw new ZenithDataError(ErrorCode.SMCCACFFD121243448, `${getErrorMessage(error)}: ${JSON.stringify(detail)}`);
            }
        }
    }

    // function parseTradingMarkets(tradingMarkets: string[]): MarketId[] {
    //     return tradingMarkets.map(tm => ZenithConvert.EnvironmentedMarket.toId(tm).marketId);
    // }

    private getExchange(detail: ZenithProtocol.MarketController.SearchSymbols.Detail) {
        const exchange = detail.Exchange;
        if (exchange === undefined) {
            return detail.Market; // Exchange and Market are same so only provided once
        } else {
            return exchange;
        }
    }

    // interface DataIvemIdExchangeId {
    //     dataIvemId: DataIvemId;
    //     exchangeId: ExchangeId;
    // }

    // function parseDataIvemIdExchangeName(detail: ZenithProtocol.MarketController.SearchSymbols.Detail) {
    //     const { marketId, environmentId } = ZenithConvert.EnvironmentedMarket.toId(detail.Market);

    //     let symbolExchange: string;
    //     if (detail.Exchange !== undefined) {
    //         symbolExchange = detail.Exchange;
    //     } else {
    //         symbolExchange = detail.Market; // Exchange and Market are same so only provided once
    //     }
    //     const environmentedExchangeId = ZenithConvert.EnvironmentedExchange.toId(symbolExchange);
    //     const exchangeId = environmentedExchangeId.exchangeId;

    //     const defaultEnvironmentId = ExchangeInfo.getDefaultDataEnvironmentId(exchangeId);
    //     const explicitEnvironmentId = environmentId === defaultEnvironmentId ? undefined : environmentId;
    //     const dataIvemId = new DataIvemId(detail.Code, marketId, explicitEnvironmentId);

    //     const result: DataIvemIdExchangeId = {
    //         dataIvemId,
    //         exchangeId,
    //     };

    //     return result;
    // }

    private parseAttributes(zenithExchangeCode: string, attributes: ZenithProtocol.MarketController.SearchSymbols.Attributes | undefined) {
        if (attributes === undefined) {
            return undefined;
        } else {
            let result: DataIvemAttributes | undefined;
            switch (zenithExchangeCode as ZenithProtocolCommon.KnownExchange) {
                case ZenithProtocolCommon.KnownExchange.Myx:
                    result = ZenithMarketMyxConvert.Symbols.Attributes.toDataIvem(attributes);
                    break;
                default: {
                    const entries = Object.entries(attributes);
                    result = new DataIvemAttributes(zenithExchangeCode);
                    for (const [key, value] of entries) {
                        if (value !== undefined) {
                            result.addUnrecognised(key, value);
                        }
                    }

                    return result;
                }
            }
            return result;
        }
    }

    // function parseAlternates(exchangeId: ExchangeId, value: ZenithProtocol.MarketController.SearchSymbols.Alternates | undefined) {
    //     if (value === undefined) {
    //         return undefined;
    //     } else {
    //         let result: DataIvemAlternateCodes | undefined;
    //         switch (exchangeId) {
    //             case ExchangeId.Myx: {
    //                 const myxValue = value as ZenithMarketMyx.MarketController.Symbols.Alternates;
    //                 result = ZenithMarketMyxConvert.Symbols.Alternates.toAdi(myxValue);
    //                 break;
    //             }
    //             case ExchangeId.Asx: {
    //                 const asxValue = value as ZenithMarketAsx.MarketController.Symbols.Alternates;
    //                 result = ZenithMarketAsxConvert.Symbols.Alternates.toAdi(asxValue);
    //                 break;
    //             }
    //             case ExchangeId.Nzx: {
    //                 const nzxValue = value as ZenithMarketNzx.MarketController.Symbols.Alternates;
    //                 result = ZenithMarketNzxConvert.Symbols.Alternates.toAdi(nzxValue);
    //                 break;
    //             }
    //             case ExchangeId.Ptx: {
    //                 const ptxValue = value as ZenithMarketPtx.MarketController.Symbols.Alternates;
    //                 result = ZenithMarketPtxConvert.Symbols.Alternates.toAdi(ptxValue);
    //                 break;
    //             }
    //             case ExchangeId.Fnsx: {
    //                 const fnsxValue = value as ZenithMarketFnsx.MarketController.Symbols.Alternates;
    //                 result = ZenithMarketFnsxConvert.Symbols.Alternates.toAdi(fnsxValue);
    //                 break;
    //             }
    //             case ExchangeId.Fpsx: {
    //                 const fpsxValue = value as ZenithMarketFnsx.MarketController.Symbols.Alternates;
    //                 result = ZenithMarketFnsxConvert.Symbols.Alternates.toAdi(fpsxValue);
    //                 break;
    //             }
    //             case ExchangeId.Cfx: {
    //                 const cfxValue = value as ZenithMarketFnsx.MarketController.Symbols.Alternates;
    //                 result = ZenithMarketFnsxConvert.Symbols.Alternates.toAdi(cfxValue);
    //                 break;
    //             }
    //             case ExchangeId.Dax: {
    //                 const daxValue = value as ZenithMarketFnsx.MarketController.Symbols.Alternates;
    //                 result = ZenithMarketFnsxConvert.Symbols.Alternates.toAdi(daxValue);
    //                 break;
    //             }
    //             default:
    //                 ErrorCodeLogger.logDataError('SMCCAUC77667733773', ExchangeInfo.idToName(exchangeId));
    //                 result = undefined;
    //         }
    //         return result;
    //     }
    // }

    private parseLegs(value: ZenithProtocol.MarketController.Leg[] | undefined, zenithExchangeCode: string) {
        if (value === undefined) {
            return undefined;
        } else {
            const result = new Array<TmcLeg>(value.length);
            for (let i = 0; i < value.length; i++) {
                const zenithLeg = value[i];
                const leg: TmcLeg = {
                    zenithIvemId: { code: zenithLeg.Code, zenithExchangeCode },
                    ratio: zenithLeg.Ratio,
                    orderSideId: ZenithConvert.OrderSide.toId(zenithLeg.Side)
                };
                result[i] = leg;
            }

            return result;
        }
    }
}
