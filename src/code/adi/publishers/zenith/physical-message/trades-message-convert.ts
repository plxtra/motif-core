import { AssertInternalError, DecimalFactory, Err, Ok, Result, UnexpectedCaseError, } from '@pbkware/js-utils';
import { StringId, Strings } from '../../../../res';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_InvalidRequest,
    QueryTradesDataDefinition,
    RequestErrorDataMessages,
    TradesDataDefinition,
    TradesDataMessage,
    unknownZenithCode,
    ZenithSymbol
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class TradesMessageConvert extends MessageConvert {
    constructor(private readonly _decimalFactory: DecimalFactory) {
        super();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof TradesDataDefinition) {
            return this.createSubUnsubMessage(request, definition);
        } else {
            if (definition instanceof QueryTradesDataDefinition) {
                return this.createPublishMessage(request, definition);
            } else {
                throw new AssertInternalError('TMCCRM888888333', definition.description);
            }
        }
    }

    parseMessage(subscription: AdiPublisherSubscription, message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id): DataMessage {

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.TMCPMC2019942466, message.Controller);
        } else {
            const dataMessage = new TradesDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.MarketController.TopicName !== ZenithProtocol.MarketController.TopicName.QueryTrades) {
                        throw new ZenithDataError(ErrorCode.TMCPMP9333857676, message.Topic);
                    } else {
                        const publishMsg = message as ZenithProtocol.MarketController.Trades.PayloadMessageContainer;
                        dataMessage.changes = this.parseData(publishMsg.Data);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.MarketController.TopicName.Trades)) {
                        throw new ZenithDataError(ErrorCode.TMCPMS1102993424, message.Topic);
                    } else {
                        const subMsg = message as ZenithProtocol.MarketController.Trades.PayloadMessageContainer;
                        dataMessage.changes = this.parseData(subMsg.Data);
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('TMCPMD558382000', actionId.toString(10));
            }

            return dataMessage;
        }
    }

    private createPublishMessage(
        request: AdiPublisherRequest,
        definition: QueryTradesDataDefinition
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const tradingDate = definition.tradingDate;
            const result: ZenithProtocol.MarketController.Trades.PublishMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: ZenithProtocol.MarketController.TopicName.QueryTrades,
                Action: ZenithProtocol.MessageContainer.Action.Publish,
                TransactionID: AdiPublisherRequest.getNextTransactionId(),
                Data: {
                    Market: marketZenithCode,
                    Code: definition.code,
                    Count: definition.count,
                    FirstTradeID: definition.firstTradeId,
                    LastTradeID: definition.lastTradeId,
                    TradingDate: tradingDate === undefined ? undefined : ZenithConvert.Date.DateTimeIso8601.fromDate(tradingDate),
                }
            };

            return new Ok(result);
        }
    }

    private createSubUnsubMessage(
        request: AdiPublisherRequest,
        definition: TradesDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const zenithSymbol = ZenithSymbol.createZenithCodeFromDestructured(definition.code, marketZenithCode)
            const topic = ZenithProtocol.MarketController.TopicName.Trades + ZenithProtocol.topicArgumentsAnnouncer + zenithSymbol;

            const result: ZenithProtocol.SubUnsubMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: topic,
                Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(request.typeId),
            };

            return new Ok(result);
        }
    }

    private parseData(data: ZenithProtocol.MarketController.Trades.Change[]): TradesDataMessage.Change[] {
        const count = data.length;
        const result = new Array<TradesDataMessage.Change>(count);
        for (let index = 0; index < count; index++) {
            const change = data[index];
            result[index] = ZenithConvert.Trades.toDataMessageChange(this._decimalFactory, change);
        }
        return result;
    }
}
