import { AssertInternalError, ErrorCode, Ok, Result, UnreachableCaseError, ZenithDataError } from '../../../../sys/internal-api';
import {
    ActiveFaultedStatusId,
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    QueryScanDetailDataDefinition,
    QueryScanDetailDataMessage,
    RequestErrorDataMessages,
    ScanTargetTypeId
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithNotifyConvert } from './zenith-notify-convert';

export namespace QueryScanMessageConvert {
    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof QueryScanDetailDataDefinition) {
            return createPublishMessage(definition);
        } else {
            throw new AssertInternalError('QSMCCRM70319', definition.description);
        }
    }

    function createPublishMessage(definition: QueryScanDetailDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.NotifyController.QueryScan.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Notify,
            Topic: ZenithProtocol.NotifyController.TopicName.QueryScan,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                ScanID: definition.scanId,
            }
        };

        return new Ok(result);
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Notify) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_QueryScan_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_QueryScan_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.NotifyController.TopicName !== ZenithProtocol.NotifyController.TopicName.QueryScan) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_QueryScan_Topic, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.NotifyController.QueryScan.PublishPayloadMessageContainer;
                    const response = responseMsg.Data;
                    const dataMessage = new QueryScanDetailDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    dataMessage.scanId = response.ScanID;
                    const details = response.Details;
                    dataMessage.scanName = details.Name;
                    dataMessage.scanDescription = details.Description;
                    const metadata = details.Metadata;
                    if (metadata === undefined) {
                        dataMessage.versionNumber = undefined;
                        dataMessage.versionId = undefined;
                        dataMessage.versioningInterrupted = false;
                        dataMessage.lastSavedTime = undefined;
                        dataMessage.lastEditSessionId = undefined;
                        dataMessage.symbolListEnabled = undefined;
                        dataMessage.zenithCriteriaSource = undefined;
                        dataMessage.zenithRankSource = undefined;
                    } else {
                        const convertMetadata = ZenithNotifyConvert.ScanMetaType.to(metadata);
                        dataMessage.versionNumber = convertMetadata.versionNumber;
                        dataMessage.versionId = convertMetadata.versionId;
                        dataMessage.versioningInterrupted = convertMetadata.versioningInterrupted;
                        dataMessage.lastSavedTime = convertMetadata.lastSavedTime;
                        dataMessage.lastEditSessionId = convertMetadata.lastEditSessionId;
                        dataMessage.symbolListEnabled = convertMetadata.symbolListEnabled;
                        dataMessage.zenithCriteriaSource = convertMetadata.zenithCriteriaSource;
                        dataMessage.zenithRankSource = convertMetadata.zenithRankSource;
                    }
                    dataMessage.scanReadonly = !details.IsWritable
                    const scanStatusId = ZenithConvert.ActiveFaultedStatus.toId(details.Status);
                    dataMessage.scanStatusId = scanStatusId
                    dataMessage.enabled = scanStatusId !== ActiveFaultedStatusId.Inactive;
                    const parameters = response.Parameters;
                    dataMessage.targetTypeId = ZenithNotifyConvert.ScanType.toId(parameters.Type);
                    switch (dataMessage.targetTypeId) {
                        case ScanTargetTypeId.Symbols:
                            dataMessage.targetSymbols = ZenithNotifyConvert.Target.toZenithSymbols(parameters.Target);
                            break;
                        case ScanTargetTypeId.Markets:
                            dataMessage.targetMarketZenithCodes = ZenithNotifyConvert.Target.toMarketZenithCodes(parameters.Target);
                            break;
                        default:
                            throw new UnreachableCaseError('QSMCPM33358', dataMessage.targetTypeId);
                    }
                    dataMessage.maxMatchCount = parameters.Count,
                    dataMessage.zenithCriteria = parameters.Criteria;
                    dataMessage.zenithRank = parameters.Rank;
                    const parametersNotifications = parameters.Notifications;
                    dataMessage.attachedNotificationChannels = parametersNotifications === undefined ? [] : ZenithNotifyConvert.NotificationParameters.to(parametersNotifications);

                    return dataMessage;
                }
            }
        }
    }
}
