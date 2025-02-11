import { AssertInternalError, Err, newUndefinableDecimal, Ok, Result, UnexpectedCaseError } from '@xilytix/sysutils';
import { StringId, Strings } from '../../../../res/internal-api';
import { ErrorCode, ifDefined, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    DepthLevelsDataDefinition,
    DepthLevelsDataMessage,
    ErrorPublisherSubscriptionDataMessage_InvalidRequest,
    QueryDepthLevelsDataDefinition,
    RequestErrorDataMessages,
    unknownZenithCode,
    ZenithSymbol
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

/** @internal */
export namespace DepthLevelsMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof DepthLevelsDataDefinition) {
            return createSubUnsubMessage(request, definition);
        } else {
            if (definition instanceof QueryDepthLevelsDataDefinition) {
                return createPublishMessage(request, definition);
            } else {
                throw new AssertInternalError('DLMCCRM1111999428', definition.description);
            }
        }
    }

    function createPublishMessage(
        request: AdiPublisherRequest,
        definition: QueryDepthLevelsDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const result: ZenithProtocol.MarketController.DepthLevels.PublishMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: ZenithProtocol.MarketController.TopicName.QueryDepthLevels,
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

    function createSubUnsubMessage(
        request: AdiPublisherRequest,
        definition: DepthLevelsDataDefinition,
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const marketZenithCode = definition.marketZenithCode;
        if (marketZenithCode === unknownZenithCode) {
            const subscription = request.subscription;
            const errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, Strings[StringId.UnknownMarket]);
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const zenithSymbol = ZenithSymbol.createZenithCodeFromDestructured(definition.code, marketZenithCode);
            const topic = ZenithProtocol.MarketController.TopicName.Levels + ZenithProtocol.topicArgumentsAnnouncer + zenithSymbol;

            const result: ZenithProtocol.SubUnsubMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Market,
                Topic: topic,
                Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(request.typeId),
            };

            return new Ok(result);
        }
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.DepthLevelsMessageConvert_ControllerNotMatched, message.Controller);
        } else {
            let responseUpdateMessageContainer: ZenithProtocol.MarketController.DepthLevels.PayloadMessageContainer;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.MarketController.TopicName !== ZenithProtocol.MarketController.TopicName.QueryDepthLevels) {
                        throw new ZenithDataError(ErrorCode.DepthLevelsMessageConvert_ActionNotPublish, message.Topic);
                    } else {
                        responseUpdateMessageContainer = message as ZenithProtocol.MarketController.DepthLevels.PayloadMessageContainer;
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.MarketController.TopicName.Levels)) {
                        throw new ZenithDataError(ErrorCode.DepthLevelsMessageConvert_TopicNotQueryLevels, message.Topic);
                    } else {
                        responseUpdateMessageContainer = message as ZenithProtocol.MarketController.DepthLevels.PayloadMessageContainer;
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('DLMCPM10813', actionId.toString(10));
            }
            const data = responseUpdateMessageContainer.Data;
            const dataMessage = new DepthLevelsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            dataMessage.levelChangeRecords = parseData(data);
            return dataMessage;
        }
    }

    function parseData(data: ZenithProtocol.MarketController.DepthLevels.Change[]): DepthLevelsDataMessage.ChangeRecord[] {
        const result: DepthLevelsDataMessage.ChangeRecord[] = [];
        for (let index = 0; index < data.length; index++) {
            const record = parseLevelChangeRecord(data[index]);
            result.push(record);
        }
        return result;
    }

    function parseLevelChangeRecord(cr: ZenithProtocol.MarketController.DepthLevels.Change): DepthLevelsDataMessage.ChangeRecord {
        return {
            o: cr.O,
            level: ifDefined(cr.Level, parseOrderInfo),
        };
    }

    function parseOrderInfo(order: ZenithProtocol.MarketController.DepthLevels.Change.Level): DepthLevelsDataMessage.Level {
        // const { marketId, environmentId: environmentIdIgnored } = (order.Market !== undefined)
        //     ? ZenithConvert.EnvironmentedMarket.toId(order.Market)
        //     : { marketId: undefined, environmentId: undefined };

        return {
            id: order.ID,
            sideId: ifDefined(order.Side, x => ZenithConvert.OrderSide.toId(x)),
            price: order.Price === null ? null : newUndefinableDecimal(order.Price),
            volume: ifDefined(order.Volume, x => x),
            orderCount: ifDefined(order.Count, x => x),
            hasUndisclosed: ifDefined(order.HasUndisclosed, x => x),
            marketZenithCode: order.Market,
        };
    }
}
