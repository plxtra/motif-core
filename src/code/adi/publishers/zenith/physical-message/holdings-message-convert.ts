import { AssertInternalError, ErrorCode, InternalError, Ok, Result, UnexpectedCaseError, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    AurcChangeTypeId,
    BrokerageAccountHoldingsDataDefinition,
    DataMessage,
    HoldingsDataMessage,
    QueryBrokerageAccountHoldingsDataDefinition,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace HoldingsMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof BrokerageAccountHoldingsDataDefinition) {
            return createSubUnsubMessage(definition, request.typeId);
        } else {
            if (definition instanceof QueryBrokerageAccountHoldingsDataDefinition) {
                return createPublishMessage(definition);
            } else {
                throw new AssertInternalError('TCHCM6730002932', definition.description);
            }
        }
    }

    function createPublishMessage(definition: QueryBrokerageAccountHoldingsDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        // const account = ZenithConvert.EnvironmentedAccount.fromId(definition.accountId);
        let exchange: string | undefined;
        let code: string | undefined;
        const zenithIvemId = definition.zenithIvemId;
        if (zenithIvemId === undefined) {
            exchange = undefined;
            code = undefined;
        } else {
            exchange = zenithIvemId.zenithExchangeCode;
            code = zenithIvemId.code;
        }
        const result: ZenithProtocol.TradingController.Holdings.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.QueryHoldings,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Account: definition.accountZenithCode,
                Exchange: exchange,
                Code: code
            }
        };

        return new Ok(result);
    }

    function createSubUnsubMessage(
        definition: BrokerageAccountHoldingsDataDefinition,
        requestTypeId: AdiPublisherRequest.TypeId
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const topicName = ZenithProtocol.TradingController.TopicName.Holdings;
        // const enviromentedAccount = ZenithConvert.EnvironmentedAccount.fromId(definition.accountId);

        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: topicName + ZenithProtocol.topicArgumentsAnnouncer + definition.accountZenithCode,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
        };

        return new Ok(result);
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.TCHPMC5838323333, message.Controller);
        } else {
            const dataMessage = new HoldingsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.QueryHoldings) {
                        throw new ZenithDataError(ErrorCode.TCHPMP68392967122, message.Topic);
                    } else {
                        const publishMsg = message as ZenithProtocol.TradingController.Holdings.PublishPayloadMessageContainer;
                        dataMessage.holdingChangeRecords = parsePublishMessageData(publishMsg.Data);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.TradingController.TopicName.Holdings)) {
                        throw new ZenithDataError(ErrorCode.TCHPMS884352993242, message.Topic);
                    } else {
                        const subMsg = message as ZenithProtocol.TradingController.Holdings.SubPayloadMessageContainer;
                        dataMessage.holdingChangeRecords = parseSubMessageData(subMsg.Data);
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('TCHPMU12122209553', actionId.toString(10));
            }

            return dataMessage;
        }
    }

    function parsePublishMessageData(data: ZenithProtocol.TradingController.Holdings.PublishPayload) {
        const result = new Array<HoldingsDataMessage.ChangeRecord>(data.length);
        for (let index = 0; index < data.length; index++) {
            const detail = data[index];
            try {
                const changeData = ZenithConvert.Holdings.toDataMessageAddUpdateChangeData(detail);
                const changeRecord: HoldingsDataMessage.ChangeRecord = {
                    typeId: AurcChangeTypeId.Add,
                    data: changeData
                };
                result[index] = changeRecord;
            } catch (e) {
                throw InternalError.appendToErrorMessage(e, ` Index: ${index}`);
            }
        }
        return result;
    }

    function parseSubMessageData(data: ZenithProtocol.TradingController.Holdings.SubPayload) {
        const result = new Array<HoldingsDataMessage.ChangeRecord>(data.length);
        for (let index = 0; index < data.length; index++) {
            const zenithChangeRecord = data[index];
            try {
                const changeRecord = ZenithConvert.Holdings.toDataMessageChangeRecord(zenithChangeRecord);
                result[index] = changeRecord;
            } catch (e) {
                throw InternalError.appendToErrorMessage(e, ` Index: ${index}`);
            }
        }
        return result;
    }
}
