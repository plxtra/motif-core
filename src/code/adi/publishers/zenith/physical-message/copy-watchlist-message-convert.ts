import { AssertInternalError, Ok, Result, } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    CopyWatchmakerListDataDefinition,
    CreateOrCopyWatchmakerListDataMessage,
    DataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class CopyWatchlistMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof CopyWatchmakerListDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('COWLMC32220', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Watchlist) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlist_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_CopyWatchmakerList_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.WatchlistController.TopicName !== ZenithProtocol.WatchlistController.TopicName.CopyWatchlist) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_CopyWatchmakerList_Topic, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.WatchlistController.CopyWatchlist.PublishPayloadMessageContainer;
                    const response = responseMsg.Data;
                    const dataMessage = new CreateOrCopyWatchmakerListDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    dataMessage.listId = response.WatchlistID;

                    return dataMessage;
                }
            }
        }
    }

    private createPublishMessage(definition: CopyWatchmakerListDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.WatchlistController.CopyWatchlist.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Watchlist,
            Topic: ZenithProtocol.WatchlistController.TopicName.CopyWatchlist,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                WatchlistID: definition.listId,
                Details: {
                    Name: definition.name,
                    Description: definition.listDescription,
                    Category: definition.category,
                },
            }
        };

        return new Ok(result);
    }
}
