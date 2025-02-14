import { AssertInternalError, DecimalFactory, Err, Ok, Result, UnexpectedCaseError } from '@xilytix/sysutils';
import { StringId, Strings } from '../../../../res/internal-api';
import { ErrorCode, ifDefined, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    DepthDataDefinition,
    DepthDataMessage,
    ErrorPublisherSubscriptionDataMessage_InvalidRequest,
    QueryDepthDataDefinition,
    RequestErrorDataMessages,
    unknownZenithCode,
    ZenithSymbol
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class DepthMessageConvert extends MessageConvert{

    constructor(private readonly _decimalFactory: DecimalFactory) {
        super();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof DepthDataDefinition) {
            return this.createSubUnsubMessage(request, definition);
        } else {
            if (definition instanceof QueryDepthDataDefinition) {
                return this.createPublishMessage(request, definition);
            } else {
                throw new AssertInternalError('DMCCRM1111999428', definition.description);
            }
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.DepthMessageConvert_ControllerNotMatched, message.Controller);
        } else {
            let responseUpdateMessageContainer: ZenithProtocol.MarketController.DepthLevels.PayloadMessageContainer;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.MarketController.TopicName !== ZenithProtocol.MarketController.TopicName.QueryDepthFull) {
                        throw new ZenithDataError(ErrorCode.DepthMessageConvert_ActionNotPublish, message.Topic);
                    } else {
                        responseUpdateMessageContainer = message as ZenithProtocol.MarketController.DepthLevels.PayloadMessageContainer;
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.MarketController.TopicName.Depth)) {
                        throw new ZenithDataError(ErrorCode.DepthMessageConvert_TopicNotQueryDepthFull, message.Topic);
                    } else {
                        responseUpdateMessageContainer = message as ZenithProtocol.MarketController.DepthLevels.PayloadMessageContainer;
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('DMCPM10813', actionId.toString(10));
            }
            const data = responseUpdateMessageContainer.Data;
            const dataMessage = new DepthDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            dataMessage.orderChangeRecords = this.parseData(data);
            return dataMessage;
        }
    }

    private createPublishMessage(
        request: AdiPublisherRequest,
        definition: QueryDepthDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const msgContainer: ZenithProtocol.MarketController.Depth.PublishMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: ZenithProtocol.MarketController.TopicName.QueryDepthFull,
                Action: ZenithProtocol.MessageContainer.Action.Publish,
                TransactionID: AdiPublisherRequest.getNextTransactionId(),
                Data: {
                    Market: marketZenithCode,
                    Code: definition.code,
                }
            };

            return new Ok(msgContainer);
        }
    }

    private createSubUnsubMessage(
        request: AdiPublisherRequest,
        definition: DepthDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const zenithSymbol = ZenithSymbol.createZenithCodeFromDestructured(definition.code, marketZenithCode);
            const topic = ZenithProtocol.MarketController.TopicName.Depth + ZenithProtocol.topicArgumentsAnnouncer + zenithSymbol;

            const msgContainer: ZenithProtocol.SubUnsubMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: topic,
                Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(request.typeId),
            };

            return new Ok(msgContainer);
        }
    }

    private parseData(data: ZenithProtocol.MarketController.Depth.Change[]): DepthDataMessage.ChangeRecords {
        const result: DepthDataMessage.ChangeRecord[] = [];
        for (let index = 0; index < data.length; index++) {
            const record = this.parseOrderChangeRecord(data[index]);
            result.push(record);
        }
        return result;
    }

    private parseOrderChangeRecord(cr: ZenithProtocol.MarketController.Depth.Change): DepthDataMessage.ChangeRecord {
        const zenithOrder = cr.Order;
        const order = zenithOrder === undefined ? undefined : this.parseOrderInfo(zenithOrder);
        return {
            o: cr.O,
            order,
        };
    }

    private parseOrderInfo(order: ZenithProtocol.MarketController.Depth.Change.Order): DepthDataMessage.DepthOrder {
        if (order.Quantity === null) {
            // redefine quantity to be disclosed quantity
            order.Quantity = 0;
            order.HasUndisclosed = true;
        }

        return {
            id: order.ID,
            sideId: ifDefined(order.Side, x => ZenithConvert.OrderSide.toId(x)),
            price: this._decimalFactory.newUndefinableDecimal(order.Price),
            position: order.Position,
            broker: order.Broker,
            crossRef: order.CrossRef,
            quantity: order.Quantity,
            hasUndisclosed: order.HasUndisclosed,
            zenithMarketCode: order.Market,
            // dataEnvironmentId: environmentId,
            attributes: order.Attributes,
        };
    }
}
