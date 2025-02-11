import { AssertInternalError, InternalError, Ok, Result, UnexpectedCaseError, } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    AuiChangeTypeId,
    BrokerageAccountTransactionsDataDefinition,
    DataMessage,
    QueryTransactionsDataDefinition,
    RequestErrorDataMessages,
    TransactionsDataMessage
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export namespace TransactionsMessageConvert {

    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof BrokerageAccountTransactionsDataDefinition) {
            return createSubUnsubMessage(definition, request.typeId);
        } else {
            if (definition instanceof QueryTransactionsDataDefinition) {
                return createPublishMessage(definition);
            } else {
                throw new AssertInternalError('TMCCRM1111999428', definition.description);
            }
        }
    }

    function createPublishMessage(definition: QueryTransactionsDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        // const account = ZenithConvert.EnvironmentedAccount.fromId(definition.accountId);
        const fromDate = definition.fromDate === undefined ? undefined : ZenithConvert.Date.DateTimeIso8601.fromDate(definition.fromDate);
        const toDate = definition.toDate === undefined ? undefined : ZenithConvert.Date.DateTimeIso8601.fromDate(definition.toDate);
        // const tradingMarket = definition.zenithTradingMarketCode === undefined ? undefined :
        //     ZenithConvert.EnvironmentedMarket.tradingFromId(definition.zenithTradingMarketCode);
        // const exchange = definition.zenithExchangeCode === undefined ? undefined :
        //     ZenithConvert.EnvironmentedExchange.fromId(definition.zenithExchangeCode);

        const result: ZenithProtocol.TradingController.Transactions.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.QueryTransactions,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Account: definition.accountZenithCode,
                FromDate: fromDate,
                ToDate: toDate,
                Count: definition.count,
                TradingMarket: definition.zenithTradingMarketCode,
                Exchange: definition.zenithExchangeCode,
                Code: definition.code,
                OrderID: definition.orderId,
            }
        };

        return new Ok(result);
    }

    function createSubUnsubMessage(
        definition: BrokerageAccountTransactionsDataDefinition,
        requestTypeId: AdiPublisherRequest.TypeId
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const topicName = ZenithProtocol.TradingController.TopicName.Transactions;
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
            throw new ZenithDataError(ErrorCode.TMCPMC588329999199, message.Controller);
        } else {
            const dataMessage = new TransactionsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.QueryTransactions) {
                        throw new ZenithDataError(ErrorCode.TMCPMP5885239991, message.Topic);
                    } else {
                        const publishMsg = message as ZenithProtocol.TradingController.Transactions.PublishPayloadMessageContainer;
                        dataMessage.changes = parsePublishMessageData(publishMsg.Data);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.TradingController.TopicName.Transactions)) {
                        throw new ZenithDataError(ErrorCode.TMCPMS6969222311, message.Topic);
                    } else {
                        const subMsg = message as ZenithProtocol.TradingController.Transactions.SubPayloadMessageContainer;
                        dataMessage.changes = parseSubMessageData(subMsg.Data);
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('TMCPMD558382000', actionId.toString(10));
            }

            return dataMessage;
        }
    }

    function parsePublishMessageData(data: ZenithProtocol.TradingController.Transactions.PublishPayload) {
        const result = new Array<TransactionsDataMessage.Change>(data.length);
        for (let index = 0; index < data.length; index++) {
            const detail = data[index];
            try {
                const change: TransactionsDataMessage.AddChange = {
                    typeId: AuiChangeTypeId.Add,
                    transaction: ZenithConvert.Transactions.toAdiTransaction(detail)
                };
                result[index] = change;
            } catch (e) {
                throw InternalError.appendToErrorMessage(e, ` Index: ${index}`);
            }
        }
        return result;
    }

    function parseSubMessageData(data: ZenithProtocol.TradingController.Transactions.SubPayload) {
        const result = new Array<TransactionsDataMessage.Change>(data.length);
        for (let index = 0; index < data.length; index++) {
            const zenithChange = data[index];
            try {
                const change = ZenithConvert.Transactions.toDataMessageChange(zenithChange);
                result[index] = change;
            } catch (e) {
                throw InternalError.appendToErrorMessage(e, ` Index: ${index}`);
            }
        }
        return result;
    }
}
