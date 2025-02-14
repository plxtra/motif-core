import {
    AssertInternalError, Ok, Result, UnreachableCaseError
} from '@xilytix/sysutils';
import {
    ErrorCode, ZenithDataError
} from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    AurcChangeTypeId,
    DataMessage,
    QueryWatchmakerListDescriptorsDataDefinition,
    RequestErrorDataMessages,
    ScanStatusedDescriptorsDataMessage,
    WatchmakerListDescriptorsDataDefinition,
    WatchmakerListDescriptorsDataMessage
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class WatchlistsMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof WatchmakerListDescriptorsDataDefinition) {
            return this.createSubUnsubMessage(request.typeId);
        } else {
            if (definition instanceof QueryWatchmakerListDescriptorsDataDefinition) {
                return this.createPublishMessage(definition);
            } else {
                throw new AssertInternalError('WSMCCRM32223', definition.description);
            }
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Watchlist) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_Controller, message.Controller);
        } else {
            let payloadMsg: ZenithProtocol.WatchlistController.Watchlists.PayloadMessageContainer;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    switch (message.Topic as ZenithProtocol.WatchlistController.TopicName) {
                        case ZenithProtocol.WatchlistController.TopicName.QueryWatchlists:
                            payloadMsg = message as ZenithProtocol.WatchlistController.QueryWatchlists.PublishPayloadMessageContainer;
                            break;
                        case ZenithProtocol.WatchlistController.TopicName.QueryWatchlist:
                            payloadMsg = message as ZenithProtocol.WatchlistController.QueryWatchlist.PublishPayloadMessageContainer;
                            break;
                        default:
                            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlists_PublishTopic, message.Topic);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.WatchlistController.TopicName.Watchlists)) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlists_SubTopic, message.Topic);
                    } else {
                        payloadMsg = message as ZenithProtocol.WatchlistController.Watchlists.PayloadMessageContainer;
                    }
                    break;
                default:
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlists_Action, JSON.stringify(message));
            }

            const dataMessage = new WatchmakerListDescriptorsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            dataMessage.changes = this.parseData(payloadMsg.Data);
            return dataMessage;
        }
    }

    private createPublishMessage(definition: QueryWatchmakerListDescriptorsDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const controller = ZenithProtocol.MessageContainer.Controller.Watchlist;
        const action = ZenithProtocol.MessageContainer.Action.Publish;
        const transactionId = AdiPublisherRequest.getNextTransactionId();
        const listId = definition.listId;

        if (listId === undefined) {
            const result: ZenithProtocol.WatchlistController.QueryWatchlists.PublishMessageContainer = {
                Controller: controller,
                Topic: ZenithProtocol.WatchlistController.TopicName.QueryWatchlists,
                Action: action,
                TransactionID: transactionId,
            };
            return new Ok(result);
        } else {
            const result: ZenithProtocol.WatchlistController.QueryWatchlist.PublishMessageContainer = {
                Controller: controller,
                Topic: ZenithProtocol.WatchlistController.TopicName.QueryWatchlist,
                Action: action,
                TransactionID: transactionId,
                Data: {
                    Watchlist: listId,
                }
            };
            return new Ok(result);
        }
    }

    private createSubUnsubMessage(requestTypeId: AdiPublisherRequest.TypeId): Ok<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const topic = ZenithProtocol.WatchlistController.TopicName.Watchlists;

        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Watchlist,
            Topic: topic,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
        };

        return new Ok(result);
    }

    private parseData(data: readonly ZenithProtocol.WatchlistController.WatchlistChange[]): WatchmakerListDescriptorsDataMessage.Change[] {
        const count = data.length;
        const result = new Array<WatchmakerListDescriptorsDataMessage.Change>(count);
        for (let i = 0; i < count; i++) {
            const watchlistChange = data[i];
            result[i] = this.parseWatchlistChange(watchlistChange);
        }
        return result;
    }

    private parseWatchlistChange(value: ZenithProtocol.WatchlistController.WatchlistChange): WatchmakerListDescriptorsDataMessage.Change {
        const changeTypeId = ZenithConvert.AurcChangeType.toId(value.Operation);
        switch (changeTypeId) {
            case AurcChangeTypeId.Add:
            case AurcChangeTypeId.Update: {
                const watchlist = value.Watchlist;
                if (watchlist === undefined) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlists_AddUpdateMissingWatchlist, JSON.stringify(value));
                } else {
                    const name = watchlist.Name;
                    const isWritable = watchlist.IsWritable;
                    if (isWritable === undefined) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlists_UndefinedIsWritable, name);
                    } else {
                        const change: WatchmakerListDescriptorsDataMessage.AddUpdateChange = {
                            typeId: changeTypeId,
                            id: watchlist.ID,
                            name: watchlist.Name,
                            description: watchlist.Description,
                            category: watchlist.Category,
                            isWritable,
                        };
                        return change;
                    }
                }
            }
            case AurcChangeTypeId.Remove: {
                const watchlist = value.Watchlist;
                if (watchlist === undefined) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlists_RemoveMissingWatchlist, JSON.stringify(value));
                } else {
                    const change: ScanStatusedDescriptorsDataMessage.RemoveChange = {
                        typeId: changeTypeId,
                        scanId: watchlist.ID,
                    };
                    return change;
                }
            }
            case AurcChangeTypeId.Clear: {
                const change: ScanStatusedDescriptorsDataMessage.ClearChange = {
                    typeId: changeTypeId,
                }
                return change;
            }
            default:
                throw new UnreachableCaseError('WSMCPWC32223', changeTypeId);
        }
    }
}
