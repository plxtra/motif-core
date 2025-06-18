import { AssertInternalError, Ok, Result, } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    RequestErrorDataMessages,
    UpdateNotificationChannelEnabledDataDefinition,
    UpdateNotificationChannelEnabledDataMessage
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class UpdateNotificationChannelEnabledMessageConvert extends MessageConvert {

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof UpdateNotificationChannelEnabledDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('UNCEMCCRM70317', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Channel) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_UpdateEnabled_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_UpdateEnabled_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.ChannelController.TopicName !== ZenithProtocol.ChannelController.TopicName.UpdateChannelStatus) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_UpdateEnabled_Topic, message.Topic);
                } else {
                    if (subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new UpdateNotificationChannelEnabledDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                        return dataMessage;
                    }
                }
            }
        }
    }

    private createPublishMessage(definition: UpdateNotificationChannelEnabledDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.ChannelController.UpdateChannelStatus.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Channel,
            Topic: ZenithProtocol.ChannelController.TopicName.UpdateChannelStatus,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                ChannelID: definition.notificationChannelId,
                IsActive: definition.enabled ? true : undefined,
            }
        };

        return new Ok(result);
    }
}
