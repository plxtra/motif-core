import { AssertInternalError, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    QueryNotificationDistributionMethodDataDefinition,
    QueryNotificationDistributionMethodDataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithChannelConvert } from './zenith-channel-convert';
import { ZenithConvert } from './zenith-convert';

export class QueryNotificationDistributionMethodMessageConvert extends MessageConvert {

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryNotificationDistributionMethodDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('CNDMMCCRM70317', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Channel) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryMethod_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryMethod_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.ChannelController.TopicName !== ZenithProtocol.ChannelController.TopicName.QueryMethod) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryMethod_Topic, message.Topic);
                } else {
                    const publishMsg = message as ZenithProtocol.ChannelController.QueryMethod.PublishPayloadMessageContainer;
                    const data = publishMsg.Data;
                    if (data === undefined || subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new QueryNotificationDistributionMethodDataMessage();
                        const type = data.Type;
                        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                        if (type === undefined) {
                            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Channel_QueryMethod_Type, message.Topic);
                        } else {
                            const methodId = ZenithChannelConvert.DistributionMethodType.toId(type);
                            dataMessage.dataItemId = subscription.dataItemId;
                            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                            dataMessage.methodId = methodId;
                            dataMessage.metadata = data.Metadata;
                            return dataMessage;
                        }
                    }
                }
            }
        }
    }

    private createPublishMessage(definition: QueryNotificationDistributionMethodDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.ChannelController.QueryMethod.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Channel,
            Topic: ZenithProtocol.ChannelController.TopicName.QueryMethod,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Type: ZenithChannelConvert.DistributionMethodType.fromId(definition.distributionMethodId),
            }
        };

        return new Ok(result);
    }
}
