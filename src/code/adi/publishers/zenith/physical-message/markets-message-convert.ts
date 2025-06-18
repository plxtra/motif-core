import { AssertInternalError, Ok, Result, UnexpectedCaseError } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    MarketsDataDefinition,
    MarketsDataMessage,
    QueryMarketsDataDefinition,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class MarketsMessageConvert extends MessageConvert {
    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof MarketsDataDefinition) {
            return this.createSubUnsubRequestMessage(request);
        } else {
            if (definition instanceof QueryMarketsDataDefinition) {
                return this.createPublishMessage();
            } else {
                throw new AssertInternalError('MMCCRMA5558482000', definition.description);
            }
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id,
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.MMCPMT95883743, message.Controller);
        } else {
            const dataMessage = new MarketsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.MarketController.TopicName !== ZenithProtocol.MarketController.TopicName.QueryMarkets) {
                        throw new ZenithDataError(ErrorCode.MMCPMTP2998377, message.Topic);
                    } else {
                        const publishMsg = message as ZenithProtocol.MarketController.Markets.PublishSubPayloadMessageContainer;
                        dataMessage.markets = this.parseData(publishMsg.Data);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.MarketController.TopicName.Markets)) {
                        throw new ZenithDataError(ErrorCode.MMCPMTS2998377, message.Topic);
                    } else {
                        const subMsg = message as ZenithProtocol.MarketController.Markets.PublishSubPayloadMessageContainer;
                        dataMessage.markets = this.parseData(subMsg.Data);
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('MMCPMU4483969993', actionId.toString(10));
            }

            return dataMessage;
        }
    }

    private createPublishMessage(): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.MarketController.Markets.PublishSubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Market,
            Topic: ZenithProtocol.MarketController.TopicName.QueryMarkets,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    private createSubUnsubRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.MarketController.Markets.PublishSubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Market,
            Topic: ZenithProtocol.MarketController.TopicName.Markets,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(request.typeId),
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    private parseData(data: ZenithProtocol.MarketController.Markets.MarketState[]) {
        const result = new Array<MarketsDataMessage.Market>(data.length);
        let count = 0;
        for (let index = 0; index < data.length; index++) {
            const account = ZenithConvert.MarketState.toAdi(data[index]);
            result[count++] = account;
        }
        result.length = count;
        return result;
    }
}
