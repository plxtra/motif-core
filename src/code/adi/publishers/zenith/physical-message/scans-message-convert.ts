import {
    AssertInternalError, ErrorCode, Ok, Result, UnreachableCaseError, ZenithDataError
} from '../../../../sys/internal-api';
import {
    ActiveFaultedStatusId,
    AdiPublisherRequest,
    AdiPublisherSubscription,
    AurcChangeTypeId,
    DataMessage,
    QueryScanDescriptorsDataDefinition,
    RequestErrorDataMessages,
    ScanDescriptorsDataDefinition,
    ScanStatusedDescriptorsDataMessage
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithNotifyConvert } from './zenith-notify-convert';

export namespace ScansMessageConvert {
    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof ScanDescriptorsDataDefinition) {
            return createSubUnsubMessage(request.typeId);
        } else {
            if (definition instanceof QueryScanDescriptorsDataDefinition) {
                return createPublishMessage();
            } else {
                throw new AssertInternalError('SMCCRM70324', definition.description);
            }
        }
    }

    function createPublishMessage(): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.NotifyController.Scans.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Notify,
            Topic: ZenithProtocol.NotifyController.TopicName.QueryScans,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    function createSubUnsubMessage(requestTypeId: AdiPublisherRequest.TypeId): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const topic = ZenithProtocol.NotifyController.TopicName.Scans;

        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Notify,
            Topic: topic,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
        };

        return new Ok(result);
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Notify) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_Controller, message.Controller);
        } else {
            let payloadMsg: ZenithProtocol.NotifyController.Scans.PayloadMessageContainer;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.NotifyController.TopicName !== ZenithProtocol.NotifyController.TopicName.QueryScans) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_PublishTopic, message.Topic);
                    } else {
                        payloadMsg = message as ZenithProtocol.NotifyController.Scans.PayloadMessageContainer;
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.NotifyController.TopicName.Scans)) {
                        throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_SubTopic, message.Topic);
                    } else {
                        payloadMsg = message as ZenithProtocol.NotifyController.Scans.PayloadMessageContainer;
                    }
                    break;
                default:
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Scans_Action, JSON.stringify(message));
            }

            const dataMessage = new ScanStatusedDescriptorsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            dataMessage.changes = parseData(payloadMsg.Data);
            return dataMessage;
        }
    }

    function parseData(data: readonly ZenithProtocol.NotifyController.ScanChange[]): ScanStatusedDescriptorsDataMessage.Change[] {
        const count = data.length;
        const result = new Array<ScanStatusedDescriptorsDataMessage.Change>(count);
        for (let i = 0; i < count; i++) {
            const scanChange = data[i];
            result[i] = parseScanChange(scanChange);
        }
        return result;
    }

    function parseScanChange(zenithChange: ZenithProtocol.NotifyController.ScanChange): ScanStatusedDescriptorsDataMessage.Change {
        const changeTypeId = ZenithConvert.AurcChangeType.toId(zenithChange.Operation);
        switch (changeTypeId) {
            case AurcChangeTypeId.Add:
            case AurcChangeTypeId.Update: {
                const addUpdateZenithChange = zenithChange as ZenithProtocol.NotifyController.AddUpdateRemoveScanChange;
                const scan = addUpdateZenithChange.Scan;
                const scanStatusId = ZenithConvert.ActiveFaultedStatus.toId(scan.Status);
                const scanStateMetadata = scan.Metadata;
                const metadata = scanStateMetadata === undefined ? undefined : ZenithNotifyConvert.ScanMetaType.to(scanStateMetadata);
                const change: ScanStatusedDescriptorsDataMessage.AddUpdateChange = {
                    typeId: changeTypeId,
                    scanId: scan.ID,
                    scanName: scan.Name,
                    scanDescription: scan.Description,
                    versionNumber: metadata === undefined ? undefined : metadata.versionNumber,
                    versionId: metadata === undefined ? undefined : metadata.versionId,
                    versioningInterrupted: metadata === undefined ? true : metadata.versioningInterrupted,
                    lastSavedTime: metadata === undefined ? undefined : metadata.lastSavedTime,
                    lastEditSessionId: metadata === undefined ? undefined : metadata.lastEditSessionId,
                    symbolListEnabled: metadata === undefined ? undefined : metadata.symbolListEnabled,
                    zenithCriteriaSource: metadata === undefined ? undefined : metadata.zenithCriteriaSource,
                    zenithRankSource: metadata === undefined ? undefined : metadata.zenithRankSource,
                    readonly: !scan.IsWritable,
                    scanStatusId,
                    enabled: scanStatusId !== ActiveFaultedStatusId.Inactive,
                };
                return change;
            }
            case AurcChangeTypeId.Remove: {
                const addUpdateZenithChange = zenithChange as ZenithProtocol.NotifyController.AddUpdateRemoveScanChange;
                const scan = addUpdateZenithChange.Scan;
                const change: ScanStatusedDescriptorsDataMessage.RemoveChange = {
                    typeId: changeTypeId,
                    scanId: scan.ID,
                };
                return change;
            }
            case AurcChangeTypeId.Clear: {
                const change: ScanStatusedDescriptorsDataMessage.ClearChange = {
                    typeId: changeTypeId,
                }
                return change;
            }
            default:
                throw new UnreachableCaseError('SMCPSCD23609', changeTypeId);
        }
    }
}
