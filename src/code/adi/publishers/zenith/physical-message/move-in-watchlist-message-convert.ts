import { AssertInternalError, Ok, Result } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    MoveInWatchmakerListDataDefinition,
    RequestErrorDataMessages,
    WatchmakerListRequestAcknowledgeDataMessage
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class MoveInWatchlistMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof MoveInWatchmakerListDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('MIWLMCCRM32220', definition.description);
        }
    }

    parseMessage(subscription: AdiPublisherSubscription, message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id): DataMessage {

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Watchlist) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlist_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_MoveInWatchmakerList_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.WatchlistController.TopicName !== ZenithProtocol.WatchlistController.TopicName.MoveInWatchlist) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_MoveInWatchmakerList_Topic, message.Topic);
                } else {
                    if (subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new WatchmakerListRequestAcknowledgeDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;

                        return dataMessage;
                    }
                }
            }
        }
    }

    private createPublishMessage(definition: MoveInWatchmakerListDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.WatchlistController.MoveInWatchlist.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Watchlist,
            Topic: ZenithProtocol.WatchlistController.TopicName.MoveInWatchlist,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                WatchlistID: definition.listId,
                Offset: definition.offset,
                Count: definition.count,
                Target: definition.target,
            }
        };

        return new Ok(result);
    }
}
