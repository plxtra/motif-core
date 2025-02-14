import { AssertInternalError, Ok, Result } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    FeedsDataDefinition,
    FeedsDataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class FeedsMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof FeedsDataDefinition) {
            return this.createSubUnsubRequestMessage(request);
        } else {
            throw new AssertInternalError('FMCCRM09993444447', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id,
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Zenith) {
            throw new ZenithDataError(ErrorCode.FMCPMC4433149989, message.Controller);
        } else {
            const dataMessage = new FeedsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Sub) {
                throw new ZenithDataError(ErrorCode.FMCPMA5583200023, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.ZenithController.TopicName !== ZenithProtocol.ZenithController.TopicName.Feeds) {
                    throw new ZenithDataError(ErrorCode.FMCPMT5583200023, JSON.stringify(message));
                } else {
                    const subMsg = message as ZenithProtocol.ZenithController.Feeds.PayloadMessageContainer;
                    dataMessage.feeds = this.parseData(subMsg.Data);
                    return dataMessage;
                }
            }
        }
    }

    private createSubUnsubRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Zenith,
            Topic: ZenithProtocol.ZenithController.TopicName.Feeds,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(request.typeId),
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    private parseData(data: ZenithProtocol.ZenithController.Feeds.Payload) {
        const result = new Array<FeedsDataMessage.Feed>(data.length);
        let count = 0;
        for (let index = 0; index < data.length; index++) {
            const feed = ZenithConvert.Feed.toAdi(data[index]);
            if (feed !== undefined) {
                result[count++] = feed;
            }
        }
        result.length = count;
        return result;
    }
}
