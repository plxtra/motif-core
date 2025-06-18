import { AssertInternalError, Ok, Result, } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    RequestErrorDataMessages,
    UpdateNotificationChannelDataDefinition,
    UpdateNotificationChannelDataMessage
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithChannelConvert } from './zenith-channel-convert';
import { ZenithConvert } from './zenith-convert';

export class UpdateNotificationChannelMessageConvert extends MessageConvert {

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof UpdateNotificationChannelDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('UNCMCCRM70317', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Channel) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_Update_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_Update_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.ChannelController.TopicName !== ZenithProtocol.ChannelController.TopicName.UpdateChannel) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_Update_Topic, message.Topic);
                } else {
                    if (subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new UpdateNotificationChannelDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                        return dataMessage;
                    }
                }
            }
        }
    }

    private createPublishMessage(definition: UpdateNotificationChannelDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const details: ZenithProtocol.ChannelController.ChannelDescriptor = {
            Name: definition.notificationChannelName,
            Description: definition.notificationChannelDescription,
            Metadata: ZenithChannelConvert.UserMetadata.fromMerge(definition.userMetadata, definition.favourite),
        }

        const parameters: ZenithProtocol.ChannelController.ChannelParameters = {
            Type: ZenithChannelConvert.DistributionMethodType.fromId(definition.distributionMethodId),
            Settings: definition.settings,
        }

        const result: ZenithProtocol.ChannelController.UpdateChannel.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Channel,
            Topic: ZenithProtocol.ChannelController.TopicName.UpdateChannel,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                ChannelID: definition.notificationChannelId,
                Details: details,
                Parameters: parameters,
                IsActive: definition.enabled ? true : undefined,
            }
        };

        return new Ok(result);
    }
}
