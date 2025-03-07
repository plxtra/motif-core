import { AssertInternalError, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    DeleteScanDataDefinition,
    DeleteScanDataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    RequestErrorDataMessages
} from '../../../common/internal-api';
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class DeleteScanMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof DeleteScanDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('DSMCCRM70320', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Notify) {
            throw new ZenithDataError(ErrorCode.ZenithMessageConvert_Notify_Controller, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.ZenithMessageConvert_DeleteScan_Action, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.NotifyController.TopicName !== ZenithProtocol.NotifyController.TopicName.DeleteScan) {
                    throw new ZenithDataError(ErrorCode.ZenithMessageConvert_DeleteScan_Topic, message.Topic);
                } else {
                    if (subscription.errorWarningCount > 0) {
                        return ErrorPublisherSubscriptionDataMessage_PublishRequestError.createFromAdiPublisherSubscription(subscription);
                    } else {
                        const dataMessage = new DeleteScanDataMessage();
                        dataMessage.dataItemId = subscription.dataItemId;
                        dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;

                        return dataMessage;
                    }
                }
            }
        }
    }

    private createPublishMessage(definition: DeleteScanDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.NotifyController.DeleteScan.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Notify,
            Topic: ZenithProtocol.NotifyController.TopicName.DeleteScan,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                ScanID: definition.scanId,
            }
        };

        return new Ok(result);
    }
}
