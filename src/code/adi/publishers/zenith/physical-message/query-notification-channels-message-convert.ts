import { AssertInternalError, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    ActiveFaultedStatusId,
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    NotificationChannel,
    QueryNotificationChannelsDataDefinition,
    QueryNotificationChannelsDataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithChannelConvert } from './zenith-channel-convert';
import { ZenithConvert } from './zenith-convert';

export class QueryNotificationChannelsMessageConvert extends MessageConvert {

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryNotificationChannelsDataDefinition) {
            return this.createPublishMessage();
        } else {
            throw new AssertInternalError('QNCSMCCRM70317', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Channel) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryChannels_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryChannels_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.ChannelController.TopicName !== ZenithProtocol.ChannelController.TopicName.QueryChannels) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryChannels_Topic, message.Topic);
                } else {
                    const publishMsg = message as ZenithProtocol.ChannelController.QueryChannels.PublishPayloadMessageContainer;
                    const data = publishMsg.Data;
                    if (data === undefined || subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new QueryNotificationChannelsDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                        dataMessage.notificationChannels = this.parsePublishPayload(data);
                        return dataMessage;
                    }
                }
            }
        }
    }

    private createPublishMessage(): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.ChannelController.QueryChannels.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Channel,
            Topic: ZenithProtocol.ChannelController.TopicName.QueryChannels,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    private parsePublishPayload(data: ZenithProtocol.ChannelController.QueryChannels.PublishPayload): readonly NotificationChannel[] {
        const count = data.length;
        const channels = new Array<NotificationChannel>(count);
        for (let i = 0; i < count; i++) {
            const channelState = data[i];
            const convertedUserMetadata = ZenithChannelConvert.UserMetadata.to(channelState.Metadata);
            const channelStatusId = ZenithConvert.ActiveFaultedStatus.toId(channelState.Status);

            const channel: NotificationChannel = {
                channelId: channelState.ID,
                channelName: channelState.Name,
                channelDescription: channelState.Description,
                userMetadata: channelState.Metadata,
                favourite: convertedUserMetadata.favourite,
                channelStatusId,
                enabled: channelStatusId !== ActiveFaultedStatusId.Inactive,
                faulted: channelStatusId === ActiveFaultedStatusId.Faulted,
                distributionMethodId: ZenithChannelConvert.DistributionMethodType.toId(channelState.Type),
                settings: undefined,
            };

            channels[i] = channel;
        }

        return channels;
    }
}
