import { AssertInternalError, Ok, Result } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    OrderStatusesDataDefinition,
    OrderStatusesDataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace OrderStatusesMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof OrderStatusesDataDefinition) {
            return createPublishMessage(definition);
        } else {
            throw new AssertInternalError('OSOMCCRM55583399', definition.description);
        }
    }

    function createPublishMessage(definition: OrderStatusesDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        // const tradingFeedName = ZenithConvert.Feed.EnvironmentedTradingFeed.fromId(definition.tradingFeedId);

        const result: ZenithProtocol.TradingController.OrderStatuses.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.QueryOrderStatuses,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Provider: definition.tradingFeedZenithCode,
            }
        };

        return new Ok(result);
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.OSOMCPMA6744444883, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.OSOMCPMA333928660, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.QueryOrderStatuses) {
                    throw new ZenithDataError(ErrorCode.OSOMCPMT1009199929, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.TradingController.OrderStatuses.PublishPayloadMessageContainer;

                    const dataMessage = new OrderStatusesDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    try {
                        dataMessage.statuses = parseData(responseMsg.Data);
                    } catch (error) {
                        const updatedError = AssertInternalError.createIfNotError(
                            error,
                            'OSOMCPMP8847',
                            undefined,
                            AssertInternalError.ExtraFormatting.PrependWithColonSpace
                        );
                        throw updatedError;
                    }

                    return dataMessage;
                }
            }
        }
    }

    function parseData(value: ZenithProtocol.TradingController.OrderStatuses.Status[]) {
        return value.map((status) => ZenithConvert.OrderStatus.toAdi(status));
    }
}
