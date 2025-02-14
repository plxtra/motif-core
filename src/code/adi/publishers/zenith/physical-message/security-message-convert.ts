import {
    AssertInternalError,
    DecimalFactory,
    Err,
    InternalError,
    Ok,
    Result,
    UnexpectedCaseError
} from '@xilytix/sysutils';
import { StringId, Strings } from '../../../../res/internal-api';
import {
    ErrorCode,
    getUndefinedNullOrFunctionResult,
    ifDefined,
    ZenithDataError
} from "../../../../sys/internal-api";
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_InvalidRequest,
    QuerySecurityDataDefinition,
    RequestErrorDataMessages,
    SecurityDataDefinition,
    SecurityDataMessage,
    unknownZenithCode,
    ZenithSymbol
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class SecurityMessageConvert extends MessageConvert {
    constructor(private readonly _decimalFactory: DecimalFactory) {
        super();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof SecurityDataDefinition) {
            return this.createSubUnsubMessage(request, definition);
        } else {
            if (definition instanceof QuerySecurityDataDefinition) {
                return this.createPublishMessage(request, definition);
            } else {
                throw new AssertInternalError('SMCCRM1111999428', definition.description);
            }
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.SMCPMC699483333434, message.Controller);
        } else {
            const dataMessage = new SecurityDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.MarketController.TopicName !== ZenithProtocol.MarketController.TopicName.QuerySecurity) {
                        throw new ZenithDataError(ErrorCode.SMCPMP11995543833, message.Topic);
                    } else {
                        const publishMsg = message as ZenithProtocol.MarketController.Security.PayloadMessageContainer;
                        dataMessage.securityInfo = this.parseData(publishMsg.Data);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.MarketController.TopicName.Security)) {
                        throw new ZenithDataError(ErrorCode.SMCPMS55845845454, message.Topic);
                    } else {
                        const subMsg = message as ZenithProtocol.MarketController.Security.PayloadMessageContainer;
                        dataMessage.securityInfo = this.parseData(subMsg.Data);
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('SMCPMD559324888222', actionId.toString(10));
            }

            return dataMessage;
        }
    }

    private createPublishMessage(
        request: AdiPublisherRequest,
        definition: QuerySecurityDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const result: ZenithProtocol.MarketController.Security.PublishMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: ZenithProtocol.MarketController.TopicName.QuerySecurity,
                Action: ZenithProtocol.MessageContainer.Action.Publish,
                TransactionID: AdiPublisherRequest.getNextTransactionId(),
                Data: {
                    Market: marketZenithCode,
                    Code: definition.code,
                }
            };

            return new Ok(result);
        }
    }

    private createSubUnsubMessage(
        request: AdiPublisherRequest,
        definition: SecurityDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const zenithSymbol = ZenithSymbol.createZenithCodeFromDestructured(definition.code, marketZenithCode);
            const topic = ZenithProtocol.MarketController.TopicName.Security + ZenithProtocol.topicArgumentsAnnouncer + zenithSymbol;

            const result: ZenithProtocol.SubUnsubMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: topic,
                Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(request.typeId),
            };

            return new Ok(result);
        }
    }

    private parseData(data: ZenithProtocol.MarketController.Security.Payload): SecurityDataMessage.Rec {
        // let marketId: MarketId | undefined;
        // let exchangeId: ExchangeId | undefined;
        // let environmentId: DataEnvironmentId | undefined;
        // const dataMarket = data.Market;
        // if (dataMarket === undefined) {
        //     marketId = undefined;
        //     environmentId = undefined;
        // } else {
        //     const environmentedMarketId = ZenithConvert.EnvironmentedMarket.toId(dataMarket);
        //     marketId = environmentedMarketId.marketId;
        //     environmentId = environmentedMarketId.environmentId;
        // }

        // let environmentedExchangeId: EnvironmentedExchangeId | undefined;
        // if (data.Exchange !== undefined) {
        //     environmentedExchangeId = ZenithConvert.EnvironmentedExchange.toId(data.Exchange);
        // } else {
        //     if (dataMarket !== undefined) {
        //         environmentedExchangeId = ZenithConvert.EnvironmentedExchange.toId(dataMarket);
        //     } else {
        //         environmentedExchangeId = undefined;
        //     }
        // }
        // if (environmentedExchangeId === undefined) {
        //     exchangeId = undefined;
        // } else {
        //     exchangeId = environmentedExchangeId.exchangeId;
        //     environmentId = environmentedExchangeId.environmentId;
        // }

        const tradingMarkets = data.TradingMarkets;
        const tradingMarketZenithCodes = tradingMarkets === undefined ? undefined : tradingMarkets.slice();

        const extended = data.Extended;

        const strikePrice = this._decimalFactory.newUndefinableNullableDecimal(data.StrikePrice);
        const contractSize = this._decimalFactory.newUndefinableNullableDecimal(data.ContractSize);
        const open = this._decimalFactory.newUndefinableNullableDecimal(data.Open);
        const high = this._decimalFactory.newUndefinableNullableDecimal(data.High);
        const low = this._decimalFactory.newUndefinableNullableDecimal(data.Low);
        const close = this._decimalFactory.newUndefinableNullableDecimal(data.Close);
        const settlement = this._decimalFactory.newUndefinableNullableDecimal(data.Settlement);
        const last = this._decimalFactory.newUndefinableNullableDecimal(data.Last);
        const bestAsk = this._decimalFactory.newUndefinableNullableDecimal(data.BestAsk);
        const askQuantity = this._decimalFactory.newUndefinableDecimal(data.AskQuantity);
        const bestBid = this._decimalFactory.newUndefinableNullableDecimal(data.BestBid);
        const bidQuantity = this._decimalFactory.newUndefinableDecimal(data.BidQuantity);
        const volume = this._decimalFactory.newUndefinableDecimal(data.Volume);
        const auctionPrice = this._decimalFactory.newUndefinableNullableDecimal(data.AuctionPrice);
        const auctionQuantity = this._decimalFactory.newUndefinableNullableDecimal(data.AuctionQuantity);
        const auctionRemainder = this._decimalFactory.newUndefinableNullableDecimal(data.AuctionRemainder);
        const vWAP = this._decimalFactory.newUndefinableNullableDecimal(data.VWAP);
        const valueTraded = this._decimalFactory.newUndefinableDecimal(data.ValueTraded);
        const shareIssue = this._decimalFactory.newUndefinableNullableDecimal(data.ShareIssue);

        try {
            const result: SecurityDataMessage.Rec = {
                code: data.Code,
                marketZenithCode: data.Market,
                exchangeZenithCode: data.Exchange,
                // zenithDataEnvironmentCode: environmentId,
                name: data.Name,
                classId: ifDefined(data.Class, x => ZenithConvert.IvemClass.toId(x)),
                cfi: data.CFI,
                tradingState: data.TradingState,
                tradingMarketZenithCodes,
                isIndex: data.IsIndex === true,
                expiryDate: getUndefinedNullOrFunctionResult(data.ExpiryDate, x => ZenithConvert.Date.DashedYyyyMmDdDate.toSourceTzOffsetDate(x)),
                strikePrice,
                callOrPutId: getUndefinedNullOrFunctionResult(data.CallOrPut, x => ZenithConvert.CallOrPut.toId(x)),
                contractSize,
                subscriptionDataTypeIds: ifDefined(data.SubscriptionData, x => ZenithConvert.SubscriptionData.toIdArray(x)),
                quotationBasis: data.QuotationBasis,
                currencyId: getUndefinedNullOrFunctionResult(data.Currency, x => ZenithConvert.Currency.tryToId(x)),
                open,
                high,
                low,
                close,
                settlement,
                last,
                trend: ifDefined(data.Trend, x => ZenithConvert.Trend.toId(x)),
                bestAsk,
                askCount: data.AskCount,
                askQuantity,
                askUndisclosed: data.AskUndisclosed,
                bestBid,
                bidCount: data.BidCount,
                bidQuantity,
                bidUndisclosed: data.BidUndisclosed,
                numberOfTrades: data.NumberOfTrades,
                volume,
                auctionPrice,
                auctionQuantity,
                auctionRemainder,
                vWAP,
                valueTraded,
                openInterest: data.OpenInterest,
                shareIssue,
                statusNote: data.StatusNote,
                extended: getUndefinedNullOrFunctionResult(extended, value => ZenithConvert.Security.Extended.toAdi(this._decimalFactory, value)),
            } as const;
            return result;
        } catch (error) {
            throw InternalError.prependErrorMessage(error, 'Security Data Message: ');
        }
    }

    // function parseTradingMarkets(tradingMarkets: string[]): MarketId[] {
    //     return tradingMarkets.map(tm => ZenithConvert.EnvironmentedMarket.toId(tm).marketId);
    // }
}
