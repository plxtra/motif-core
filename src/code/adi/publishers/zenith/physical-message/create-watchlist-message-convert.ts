import { AssertInternalError, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    CreateOrCopyWatchmakerListDataMessage,
    DataIvemIdCreateWatchmakerListDataDefinition,
    DataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithWatchlistConvert } from './zenith-watchlist-convert';

export class CreateWatchlistMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof DataIvemIdCreateWatchmakerListDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('CWLMC32220', definition.description);
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
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_DataIvemIdCreateWatchmakerList_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.WatchlistController.TopicName !== ZenithProtocol.WatchlistController.TopicName.CreateWatchlist) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_DataIvemIdCreateWatchmakerList_Topic, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.WatchlistController.CreateWatchlist.PublishPayloadMessageContainer;
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

    private createPublishMessage(definition: DataIvemIdCreateWatchmakerListDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.WatchlistController.CreateWatchlist.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Watchlist,
            Topic: ZenithProtocol.WatchlistController.TopicName.CreateWatchlist,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Details: {
                    Name: definition.name,
                    Description: definition.listDescription,
                    Category: definition.category,
                },
                Members: ZenithWatchlistConvert.Members.fromZenithSymbols(definition.members),
            }
        };

        return new Ok(result);
    }
}
