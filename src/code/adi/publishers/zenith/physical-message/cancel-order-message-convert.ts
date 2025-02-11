import { AssertInternalError, Ok, Result } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest, AdiPublisherSubscription, CancelOrderRequestDataDefinition,
    CancelOrderResponseDataMessage,
    DataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithOrderConvert } from './zenith-order-convert';

export namespace CancelOrderMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof CancelOrderRequestDataDefinition) {
            return createPublishMessage(request, definition);
        } else {
            throw new AssertInternalError('COMCCRM55583399', definition.description);
        }
    }

    export function createPublishMessage(
        request: AdiPublisherRequest | undefined,
        definition: CancelOrderRequestDataDefinition
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.TradingController.CancelOrder.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.CancelOrder,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                // Account: ZenithConvert.EnvironmentedAccount.fromId(definition.accountId),
                Account: definition.accountZenithCode,
                OrderID: definition.orderId,
                Flags: definition.flags === undefined ? undefined : ZenithConvert.OrderRequestFlag.fromIdArray(definition.flags),
            }
        };

        if (request !== undefined) {
            const messageText = JSON.stringify(result);
            window.motifLogger.logInfo('Cancel Order Request', messageText);
        }

        return new Ok(result);
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        const messageText = JSON.stringify(message);
        window.motifLogger.logInfo('Cancel Order Response', messageText);

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.COMCPMA6744444883, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.COMCPMA333928660, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.CancelOrder) {
                    throw new ZenithDataError(ErrorCode.COMCPMT1009199929, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.TradingController.CancelOrder.PublishPayloadMessageContainer;
                    const response = responseMsg.Data;

                    const dataMessage = new CancelOrderResponseDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    dataMessage.result = ZenithConvert.OrderRequestResult.toId(response.Result);
                    const order = response.Order;
                    dataMessage.order = order === undefined ? undefined : ZenithOrderConvert.toAddUpdateChange(order);
                    const errors = response.Errors;
                    dataMessage.errors = errors === undefined ? undefined : ZenithConvert.OrderRequestError.toErrorArray(errors);

                    return dataMessage;
                }
            }
        }
    }
}
