import { AssertInternalError, Ok, Result, } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    RequestErrorDataMessages,
    TradingStatesDataDefinition,
    TradingStatesDataMessage
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class TradingStatesMessageConvert extends MessageConvert {

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof TradingStatesDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('OSOMCCRM55583399', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id,
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Market) {
            throw new ZenithDataError(ErrorCode.TSMCPMA6744444883, message.Controller);
        } else {
            if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
                throw new ZenithDataError(ErrorCode.TSMCPMA333928660, JSON.stringify(message));
            } else {
                if (message.Topic as ZenithProtocol.MarketController.TopicName !== ZenithProtocol.MarketController.TopicName.QueryTradingStates) {
                    throw new ZenithDataError(ErrorCode.TSMCPMT1009199929, message.Topic);
                } else {
                    const responseMsg = message as ZenithProtocol.MarketController.TradingStates.PublishPayloadMessageContainer;

                    const dataMessage = new TradingStatesDataMessage();
                    dataMessage.dataItemId = subscription.dataItemId;
                    dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
                    if (responseMsg.Data !== undefined) {
                        try {
                            dataMessage.states = this.parseData(responseMsg.Data);
                        } catch (error) {
                            const updatedError = AssertInternalError.createIfNotError(
                                error,
                                'TSMCPMP8559847',
                                undefined,
                                AssertInternalError.ExtraFormatting.PrependWithColonSpace
                            );
                            throw updatedError;
                        }
                    }

                    return dataMessage;
                }
            }
        }
    }

    private createPublishMessage(definition: TradingStatesDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        // const market = ZenithConvert.EnvironmentedMarket.fromId(definition.marketId);

        const result: ZenithProtocol.MarketController.TradingStates.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Market,
            Topic: ZenithProtocol.MarketController.TopicName.QueryTradingStates,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Market: definition.marketZenithCode,
            }
        };

        return new Ok(result);
    }

    private parseData(value: ZenithProtocol.MarketController.TradingStates.TradeState[]) {
        return value.map((status) => ZenithConvert.TradingState.toAdi(status));
    }
}
