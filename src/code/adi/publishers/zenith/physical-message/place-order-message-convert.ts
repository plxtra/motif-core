import { AssertInternalError, DecimalFactory, Err, Ok, Result } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    ErrorPublisherSubscriptionDataMessage_InvalidRequest,
    PlaceOrderRequestDataDefinition,
    PlaceOrderResponseDataMessage,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithOrderConvert } from './zenith-order-convert';

export class PlaceOrderMessageConvert extends MessageConvert {
    constructor(private readonly _decimalFactory: DecimalFactory) {
        super();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof PlaceOrderRequestDataDefinition) {
            return PlaceOrderMessageConvert.createPublishMessage(request, definition);
        } else {
            throw new AssertInternalError('POMCCRM4999938838', definition.description);
        }
    }

    parseMessage(subscription: AdiPublisherSubscription, message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id) {

        const messageText = JSON.stringify(message);
        window.motifLogger.logInfo('Place Order Response', messageText);

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.POMCPMC4444838484, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.POMCPMA883771277577, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.PlaceOrder) {
                    throw new ZenithDataError(ErrorCode.POMCPMT2323992323, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.TradingController.PlaceOrder.PublishPayloadMessageContainer;
                    const response = responseMsg.Data;
                    const dataMessage = new PlaceOrderResponseDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    dataMessage.result = ZenithConvert.OrderRequestResult.toId(response.Result);
                    const order = response.Order;
                    dataMessage.order = order === undefined ? undefined : ZenithOrderConvert.toAddUpdateChange(this._decimalFactory, order);
                    const errors = response.Errors;
                    dataMessage.errors = errors === undefined ? undefined : ZenithConvert.OrderRequestError.toErrorArray(errors);

                    const estimatedFees = response.EstimatedFees;
                    if (estimatedFees === undefined) {
                        dataMessage.estimatedBrokerage = undefined;
                        dataMessage.estimatedTax = undefined;
                    } else {
                        const estimatedFeesAsDecimal = ZenithConvert.OrderFees.toDecimal(this._decimalFactory, estimatedFees);
                        dataMessage.estimatedBrokerage = estimatedFeesAsDecimal.brokerage;
                        dataMessage.estimatedTax = estimatedFeesAsDecimal.tax;
                    }
                    dataMessage.estimatedValue = this._decimalFactory.newUndefinableDecimal(response.EstimatedValue);
                    return dataMessage;
                }
            }
        }
    }
}

export namespace PlaceOrderMessageConvert {
    export function createPublishMessage(
        request: AdiPublisherRequest | undefined,
        definition: PlaceOrderRequestDataDefinition
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const detailsResult = ZenithConvert.PlaceOrderDetails.tryFrom(definition.details);
        if (detailsResult.isErr()) {
            let errorMessage: ErrorPublisherSubscriptionDataMessage_InvalidRequest;
            if (request === undefined) {
                errorMessage = ErrorPublisherSubscriptionDataMessage_InvalidRequest.createNull();
            } else {
                const subscription = request.subscription;
                errorMessage = new ErrorPublisherSubscriptionDataMessage_InvalidRequest(subscription.dataItemId, subscription.dataItemRequestNr, detailsResult.error);
            }
            return new Err({ dataMessages: [errorMessage], subscribed: false });
        } else {
            const flags = definition.flags === undefined || definition.flags.length === 0 ? undefined :
                ZenithConvert.OrderRequestFlag.fromIdArray(definition.flags);

            const result: ZenithProtocol.TradingController.PlaceOrder.PublishMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Trading,
                Topic: ZenithProtocol.TradingController.TopicName.PlaceOrder,
                Action: ZenithProtocol.MessageContainer.Action.Publish,
                TransactionID: AdiPublisherRequest.getNextTransactionId(),
                Data: {
                    // Account: ZenithConvert.EnvironmentedAccount.fromId(definition.accountId),
                    Account: definition.accountZenithCode,
                    Details: detailsResult.value,
                    Flags: flags,
                    Route: ZenithConvert.ZenithOrderRoute.from(definition.route),
                    Condition: definition.trigger === undefined ? undefined : ZenithConvert.OrderCondition.from(definition.trigger),
                }
            }

            if (request !== undefined) {
                const messageText = JSON.stringify(result);
                window.motifLogger.logInfo('Place Order Request', messageText);
            }

            return new Ok(result);
        }
    }
}
