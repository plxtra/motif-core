import { AssertInternalError, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    ActiveFaultedStatusId,
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    QueryNotificationChannelDataDefinition,
    QueryNotificationChannelDataMessage,
    RequestErrorDataMessages,
    SettingsedNotificationChannel
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithChannelConvert } from './zenith-channel-convert';
import { ZenithConvert } from './zenith-convert';

export class QueryNotificationChannelMessageConvert extends MessageConvert {

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryNotificationChannelDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('QNCMCCRM70317', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Channel) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryChannel_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryChannel_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.ChannelController.TopicName !== ZenithProtocol.ChannelController.TopicName.QueryChannel) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryChannel_Topic, message.Topic);
                } else {
                    const publishMsg = message as ZenithProtocol.ChannelController.QueryChannel.PublishPayloadMessageContainer;
                    const data = publishMsg.Data;
                    if (data === undefined || subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new QueryNotificationChannelDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                        dataMessage.notificationChannel = this.parsePublishPayload(data);
                        return dataMessage;
                    }
                }
            }
        }
    }

    private createPublishMessage(definition: QueryNotificationChannelDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.ChannelController.QueryChannel.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Channel,
            Topic: ZenithProtocol.ChannelController.TopicName.QueryChannel,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                ChannelID: definition.notificationChannelId,
            }
        };

        return new Ok(result);
    }

    private parsePublishPayload(data: ZenithProtocol.ChannelController.QueryChannel.PublishPayload): SettingsedNotificationChannel {
        const parameters = data.Parameters;
        const details = data.Details;
        const convertedUserMetadata = ZenithChannelConvert.UserMetadata.to(details.Metadata);
        const channelStatusId = ZenithConvert.ActiveFaultedStatus.toId(details.Status);

        // handle bug in server
        let channelId = data.ChannelID;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (channelId === undefined) {
            channelId = (data as unknown as { ScanID: string}).ScanID;
        }

        const channel: SettingsedNotificationChannel = {
            channelId: channelId,
            channelName: details.Name,
            channelDescription: details.Description,
            userMetadata: details.Metadata,
            favourite: convertedUserMetadata.favourite,
            channelStatusId,
            enabled: channelStatusId !== ActiveFaultedStatusId.Inactive,
            faulted: channelStatusId === ActiveFaultedStatusId.Faulted,
            distributionMethodId: ZenithChannelConvert.DistributionMethodType.toId(parameters.Type),
            settings: parameters.Settings,
        };

        return channel;
    }
}
