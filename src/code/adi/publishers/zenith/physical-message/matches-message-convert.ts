import { AssertInternalError, Ok, Result, UnexpectedCaseError, UnreachableCaseError } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    AurcChangeTypeId,
    DataChannelId,
    DataIvemIdMatchesDataMessage,
    DataMessage,
    ExecuteScanDataDefinition,
    MatchesDataDefinition,
    QueryMatchesDataDefinition,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithNotifyConvert } from './zenith-notify-convert';

export class MatchesMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof MatchesDataDefinition) {
            return this.createSubUnsubMessage(definition, request.typeId);
        } else {
            if (definition instanceof ExecuteScanDataDefinition) {
                return this.createExecuteScanPublishMessage(definition);
            } else {
                if (definition instanceof QueryMatchesDataDefinition) {
                    return this.createPublishMessage(definition);
                } else {
                    throw new AssertInternalError('MMCCRM70323', definition.description);
                }
            }
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Notify) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Matches_Controller, message.Controller);
        } else {
            let payloadMsg: ZenithProtocol.NotifyController.Matches.PayloadMessageContainer;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    switch (message.Topic as ZenithProtocol.NotifyController.TopicName) {
                        case ZenithProtocol.NotifyController.TopicName.ExecuteScan:
                            payloadMsg = message as ZenithProtocol.NotifyController.ExecuteScan.PublishPayloadMessageContainer;
                            break;
                        case ZenithProtocol.NotifyController.TopicName.QueryMatches:
                            payloadMsg = message as ZenithProtocol.NotifyController.Matches.PayloadMessageContainer;
                            break;
                        default:
                            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Matches_PublishTopic, message.Topic);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.NotifyController.TopicName.Matches)) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Matches_SubTopic, message.Topic);
                    } else {
                        payloadMsg = message as ZenithProtocol.NotifyController.Matches.PayloadMessageContainer;
                    }
                    break;
                default:
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Matches_Action, JSON.stringify(message));
            }

            const dataMessage = this.parsePayloadData(subscription, payloadMsg.Data);
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;

            return dataMessage;
        }
    }

    private createPublishMessage(definition: QueryMatchesDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.NotifyController.Matches.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Notify,
            Topic: ZenithProtocol.NotifyController.TopicName.QueryMatches,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                ID: definition.scanId,
            }
        };

        return new Ok(result);
    }

    private createSubUnsubMessage(definition: MatchesDataDefinition, requestTypeId: AdiPublisherRequest.TypeId): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const topic = ZenithProtocol.NotifyController.TopicName.Matches + ZenithProtocol.topicArgumentsAnnouncer + definition.scanId;

        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Notify,
            Topic: topic,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
        };

        return new Ok(result);
    }

    private createExecuteScanPublishMessage(definition: ExecuteScanDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.NotifyController.ExecuteScan.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Notify,
            Topic: ZenithProtocol.NotifyController.TopicName.ExecuteScan,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Criteria: definition.zenithCriteria,
                Rank: definition.zenithRank,
                Type: ZenithNotifyConvert.ScanType.fromId(definition.targetTypeId),
                Target: ZenithNotifyConvert.Target.fromTargets(definition.targetTypeId, definition.targets),
                Count: definition.maxMatchCount,
            }
        };

        return new Ok(result);
    }

    private parsePayloadData(subscription: AdiPublisherSubscription, data: readonly ZenithProtocol.NotifyController.MatchChange[]): DataMessage {
        switch (subscription.dataDefinition.channelId) {
            case DataChannelId.DataIvemIdMatches: {
                const dataMessage = new DataIvemIdMatchesDataMessage();
                dataMessage.changes = this.parseDataIvemIdData(data);
                return dataMessage;
            }
            default:
                throw new UnexpectedCaseError('MMCPM49971', `${subscription.dataDefinition.channelId}`);
        }

    }

    private parseDataIvemIdData(data: readonly ZenithProtocol.NotifyController.MatchChange[] | undefined): DataIvemIdMatchesDataMessage.Change[] {
        if (data === undefined) {
            return []; // need to check if this is intended from server
        } else {
            const count = data.length;
            const result = new Array<DataIvemIdMatchesDataMessage.Change>(count);
            for (let i = 0; i < count; i++) {
                const matchChange = data[i];
                result[i] = this.parseDataIvemIdScanChange(matchChange);
            }
            return result;
        }
    }

    private parseDataIvemIdScanChange(value: ZenithProtocol.NotifyController.MatchChange): DataIvemIdMatchesDataMessage.Change {
        const changeTypeId = ZenithConvert.AurcChangeType.toId(value.Operation);
        switch (changeTypeId) {
            case AurcChangeTypeId.Add:
            case AurcChangeTypeId.Update: {
                const addUpdateValue = value as ZenithProtocol.NotifyController.AddUpdateMatchChange;
                const key = addUpdateValue.Key;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (key === undefined) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Matches_AddUpdateMissingKey, JSON.stringify(addUpdateValue));
                } else {
                    let rankScore = addUpdateValue.Rank;
                    rankScore ??= 0;
                    const change: DataIvemIdMatchesDataMessage.AddUpdateChange = {
                        typeId: changeTypeId,
                        key,
                        value: ZenithConvert.Symbol.toZenithSymbol(key),
                        rankScore,
                    };
                    return change;
                }
            }
            case AurcChangeTypeId.Remove: {
                const removeValue = value as ZenithProtocol.NotifyController.RemoveMatchChange;
                const key = removeValue.Key;
                // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                if (key === undefined) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Matches_RemoveMissingKey, JSON.stringify(value));
                } else {
                    const change: DataIvemIdMatchesDataMessage.RemoveChange = {
                        typeId: changeTypeId,
                        key,
                        value: ZenithConvert.Symbol.toZenithSymbol(key),
                    };
                    return change;
                }
            }
            case AurcChangeTypeId.Clear: {
                const change: DataIvemIdMatchesDataMessage.ClearChange = {
                    typeId: changeTypeId,
                }
                return change;
            }
            default:
                throw new UnreachableCaseError('SMCPSCD23609', changeTypeId);
        }
    }
}
