import { AssertInternalError, DecimalFactory, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    MoveOrderRequestDataDefinition,
    MoveOrderResponseDataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithOrderConvert } from './zenith-order-convert';

export class MoveOrderMessageConvert extends MessageConvert {
    constructor(private readonly _decimalFactory: DecimalFactory) {
        super();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof MoveOrderRequestDataDefinition) {
            return MoveOrderMessageConvert.createPublishMessage(request, definition);
        } else {
            throw new AssertInternalError('MOMCCRM55583399', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        const messageText = JSON.stringify(message);
        window.motifLogger.logInfo('Move Order Response', messageText);

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.MOMCPMA6744444883, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.MOMCPMA333928660, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.MoveOrder) {
                    throw new ZenithDataError(ErrorCode.MOMCPMT1009199929, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.TradingController.MoveOrder.PublishPayloadMessageContainer;
                    const response = responseMsg.Data;

                    const dataMessage = new MoveOrderResponseDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    dataMessage.result = ZenithConvert.OrderRequestResult.toId(response.Result);
                    const order = response.Order;
                    dataMessage.order = order === undefined ? undefined : ZenithOrderConvert.toAddUpdateChange(this._decimalFactory, order);
                    const errors = response.Errors;
                    dataMessage.errors = errors === undefined ? undefined : ZenithConvert.OrderRequestError.toErrorArray(errors);

                    return dataMessage;
                }
            }
        }
    }
}

export namespace MoveOrderMessageConvert {
    export function createPublishMessage(
        request: AdiPublisherRequest | undefined,
        definition: MoveOrderRequestDataDefinition
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.TradingController.MoveOrder.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.MoveOrder,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                // Account: ZenithConvert.EnvironmentedAccount.fromId(definition.accountId),
                Account: definition.accountZenithCode,
                OrderID: definition.orderId,
                Flags: definition.flags === undefined ? undefined : ZenithConvert.OrderRequestFlag.fromIdArray(definition.flags),
                Destination: definition.destinationAccountZenithCode,
            }
        };

        if (request !== undefined) {
            const messageText = JSON.stringify(result);
            window.motifLogger.logInfo('Move Order Request', messageText);
        }

        return new Ok(result);
    }
}
