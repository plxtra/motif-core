import { AssertInternalError, Ok, Result } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    NotificationDistributionMethodId,
    QueryNotificationDistributionMethodsDataDefinition,
    QueryNotificationDistributionMethodsDataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithChannelConvert } from './zenith-channel-convert';
import { ZenithConvert } from './zenith-convert';
export namespace QueryNotificationDistributionMethodsMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryNotificationDistributionMethodsDataDefinition) {
            return createPublishMessage();
        } else {
            throw new AssertInternalError('CNDMSMCCRM70317', definition.description);
        }
    }

    function createPublishMessage(): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.ChannelController.QueryMethods.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Channel,
            Topic: ZenithProtocol.ChannelController.TopicName.QueryMethods,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Channel) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryMethods_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryMethods_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.ChannelController.TopicName !== ZenithProtocol.ChannelController.TopicName.QueryMethods) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryMethods_Topic, message.Topic);
                } else {
                    const publishMsg = message as ZenithProtocol.ChannelController.QueryMethods.PublishPayloadMessageContainer;
                    const data = publishMsg.Data;
                    if (data === undefined || subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new QueryNotificationDistributionMethodsDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                        dataMessage.methodIds = parsePublishPayload(data);
                        return dataMessage;
                    }
                }
            }
        }
    }

    function parsePublishPayload(data: ZenithProtocol.ChannelController.QueryMethods.Payload): readonly NotificationDistributionMethodId[]  {
        const count = data.length;
        const methodIds = new Array<NotificationDistributionMethodId>(count);
        for (let i = 0; i < count; i++) {
            const methodType = data[i];
            methodIds[i] = ZenithChannelConvert.DistributionMethodType.toId(methodType);
        }
        return methodIds;
    }
}
