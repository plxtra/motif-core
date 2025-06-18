import { AssertInternalError, Ok, Result, UnreachableCaseError } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataIvemIdQueryWatchmakerListMembersDataDefinition,
    DataIvemIdWatchmakerListMembersDataDefinition,
    DataMessage,
    IrrcChangeTypeId,
    RequestErrorDataMessages,
    WatchmakerListDataIvemIdsDataMessage
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithWatchlistConvert } from './zenith-watchlist-convert';

// Handles both Watchlist subscription and QueryMembers request
export class WatchlistMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof DataIvemIdWatchmakerListMembersDataDefinition) {
            return this.createSubUnsubMessage(definition, request.typeId);
        } else {
            if (definition instanceof DataIvemIdQueryWatchmakerListMembersDataDefinition) {
                return this.createPublishMessage(definition);
            } else {
                throw new AssertInternalError('WMCCRM32223', definition.description);
            }
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
            let payloadMsg: ZenithProtocol.WatchlistController.Watchlist.PayloadMessageContainer;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.WatchlistController.TopicName !== ZenithProtocol.WatchlistController.TopicName.QueryMembers) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_QueryMembers_PublishTopic, message.Topic);
                    } else {
                        payloadMsg = message as ZenithProtocol.WatchlistController.Watchlist.PayloadMessageContainer;
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.WatchlistController.TopicName.Watchlist)) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlist_SubTopic, message.Topic);
                    } else {
                        payloadMsg = message as ZenithProtocol.WatchlistController.Watchlist.PayloadMessageContainer;
                    }
                    break;
                default:
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Watchlist_Action, JSON.stringify(message));
            }

            const dataMessage = new WatchmakerListDataIvemIdsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            dataMessage.changes = this.parseData(payloadMsg.Data);
            return dataMessage;
        }
    }

    private createPublishMessage(definition: DataIvemIdQueryWatchmakerListMembersDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.WatchlistController.Watchlist.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Watchlist,
            Topic: ZenithProtocol.WatchlistController.TopicName.QueryMembers,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Watchlist: definition.listId,
            }
        };

        return new Ok(result);
    }

    private createSubUnsubMessage(
        definition: DataIvemIdWatchmakerListMembersDataDefinition,
        requestTypeId: AdiPublisherRequest.TypeId
    ): Ok<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const topic = ZenithProtocol.WatchlistController.TopicName.Watchlist + ZenithProtocol.topicArgumentsAnnouncer + definition.listId;

        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Watchlist,
            Topic: topic,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
        };

        return new Ok(result);
    }

    private parseData(data: readonly ZenithProtocol.WatchlistController.MemberChange[]): WatchmakerListDataIvemIdsDataMessage.Change[] {
        const count = data.length;
        const result = new Array<WatchmakerListDataIvemIdsDataMessage.Change>(count);
        for (let i = 0; i < count; i++) {
            const memberChange = data[i];
            result[i] = this.parseMemberChange(memberChange);
        }
        return result;
    }

    private parseMemberChange(value: ZenithProtocol.WatchlistController.MemberChange): WatchmakerListDataIvemIdsDataMessage.Change {
        const changeTypeId = ZenithConvert.IrrcChangeType.toId(value.Operation);
        switch (changeTypeId) {
            case IrrcChangeTypeId.Insert:
            case IrrcChangeTypeId.Replace: {
                const insertReplaceValue = value as ZenithProtocol.WatchlistController.InsertReplaceMemberChange;
                const change: WatchmakerListDataIvemIdsDataMessage.InsertReplaceChange = {
                    typeId: changeTypeId,
                    at: insertReplaceValue.At,
                    count: insertReplaceValue.Count,
                    items: ZenithWatchlistConvert.Members.toZenithSymbols(insertReplaceValue.Members),
                }
                return change;
            }
            case IrrcChangeTypeId.Remove: {
                const removeValue = value as ZenithProtocol.WatchlistController.RemoveMemberChange;
                const change: WatchmakerListDataIvemIdsDataMessage.RemoveChange = {
                    typeId: changeTypeId,
                    at: removeValue.At,
                    count: removeValue.Count,
                }
                return change;
            }
            case IrrcChangeTypeId.Clear: {
                const change: WatchmakerListDataIvemIdsDataMessage.ClearChange = {
                    typeId: changeTypeId,
                }
                return change;
            }
            default:
                throw new UnreachableCaseError('WMCPWC32223', changeTypeId);
        }
    }
}
