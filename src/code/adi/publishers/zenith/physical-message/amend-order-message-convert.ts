import { AssertInternalError, DecimalFactory, Err, Ok, Result } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    AmendOrderRequestDataDefinition,
    AmendOrderResponseDataMessage,
    ErrorPublisherSubscriptionDataMessage_InvalidRequest,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';
import { ZenithOrderConvert } from './zenith-order-convert';

export class AmendOrderMessageConvert extends MessageConvert {
    constructor(private readonly _decimalFactory: DecimalFactory) {
        super();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof AmendOrderRequestDataDefinition) {
            return AmendOrderMessageConvert.createPublishMessage(request, definition);
        } else {
            throw new AssertInternalError('AOMCCRM993117333', definition.description);
        }
    }

    parseMessage(subscription: AdiPublisherSubscription, message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id) {

        const messageText = JSON.stringify(message);
        window.motifLogger.logInfo('Amend Order Response', messageText);

        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.AOMCPMC585822200, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.AOMCPMA333928660, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.AmendOrder) {
                    throw new ZenithDataError(ErrorCode.AOMCPMT1009199929, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.TradingController.AmendOrder.PublishPayloadMessageContainer;
                    const response = responseMsg.Data;
                    const dataMessage = new AmendOrderResponseDataMessage();
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

export namespace AmendOrderMessageConvert {
    export function createPublishMessage(
        request: AdiPublisherRequest | undefined,
        definition: AmendOrderRequestDataDefinition,
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
            const result: ZenithProtocol.TradingController.AmendOrder.PublishMessageContainer = {
                Controller: ZenithProtocol.MessageContainer.Controller.Trading,
                Topic: ZenithProtocol.TradingController.TopicName.AmendOrder,
                Action: ZenithProtocol.MessageContainer.Action.Publish,
                TransactionID: AdiPublisherRequest.getNextTransactionId(),
                Data: {
                    // Account: ZenithConvert.EnvironmentedAccount.fromId(definition.accountId),
                    Account: definition.accountZenithCode,
                    Details: detailsResult.value,
                    OrderID: definition.orderId,
                    Flags: definition.flags === undefined ? undefined : ZenithConvert.OrderRequestFlag.fromIdArray(definition.flags),
                    Route: definition.route === undefined ? undefined : ZenithConvert.ZenithOrderRoute.from(definition.route),
                    Condition: definition.trigger === undefined ? undefined : ZenithConvert.OrderCondition.from(definition.trigger),
                }
            };

            if (request !== undefined) {
                const messageText = JSON.stringify(result);
                window.motifLogger.logInfo('Amend Order Request', messageText);
            }

            return new Ok(result);
        }
    }
}
