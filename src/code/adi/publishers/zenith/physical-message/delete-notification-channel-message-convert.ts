import { AssertInternalError, ErrorCode, Ok, Result, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    DeleteNotificationChannelDataDefinition,
    DeleteNotificationChannelDataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace DeleteNotificationChannelMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof DeleteNotificationChannelDataDefinition) {
            return createPublishMessage(definition);
        } else {
            throw new AssertInternalError('DNCMCCRM70317', definition.description);
        }
    }

    function createPublishMessage(definition: DeleteNotificationChannelDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.ChannelController.DeleteChannel.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Channel,
            Topic: ZenithProtocol.ChannelController.TopicName.DeleteChannel,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                ChannelID: definition.notificationChannelId,
            }
        };

        return new Ok(result);
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Channel) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_Delete_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_Delete_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.ChannelController.TopicName !== ZenithProtocol.ChannelController.TopicName.DeleteChannel) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_Delete_Topic, message.Topic);
                } else {
                    if (subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new DeleteNotificationChannelDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                        return dataMessage;
                    }
                }
            }
        }
    }
}
