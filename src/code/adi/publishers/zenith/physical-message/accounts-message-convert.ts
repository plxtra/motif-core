import { AssertInternalError, Ok, Result, UnexpectedCaseError } from '@xilytix/sysutils';
import { ErrorCode, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    BrokerageAccountsDataDefinition,
    BrokerageAccountsDataMessage,
    DataMessage,
    QueryBrokerageAccountsDataDefinition,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

/** @internal */
export namespace AccountsMessageConvert {
    export function createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof BrokerageAccountsDataDefinition) {
            return createSubUnsubRequestMessage(request.typeId);
        } else {
            if (definition instanceof QueryBrokerageAccountsDataDefinition) {
                return createPublishMessage();
            } else {
                throw new AssertInternalError('TCACM5488388388', definition.description);
            }
        }
    }

    function createPublishMessage(): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.TradingController.Accounts.PublishSubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.QueryAccounts,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    function createSubUnsubRequestMessage(requestTypeId: AdiPublisherRequest.TypeId): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.TradingController.Accounts.PublishSubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.Accounts,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    export function parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.TCAPMT95883743, message.Controller);
        } else {
            const dataMessage = new BrokerageAccountsDataMessage();
            dataMessage.dataItemId = subscription.dataItemId;
            dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.QueryAccounts) {
                        throw new ZenithDataError(ErrorCode.TCAPMTP2998377, message.Topic);
                    } else {
                        const publishMsg = message as ZenithProtocol.TradingController.Accounts.PublishSubPayloadMessageContainer;
                        dataMessage.accounts = parseData(publishMsg.Data);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.TradingController.TopicName.Accounts)) {
                        throw new ZenithDataError(ErrorCode.TCAPMTS2998377, message.Topic);
                    } else {
                        const subMsg = message as ZenithProtocol.TradingController.Accounts.PublishSubPayloadMessageContainer;
                        dataMessage.accounts = parseData(subMsg.Data);
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('TCAPMU4483969993', actionId.toString(10));
            }

            return dataMessage;
        }
    }

    function parseData(data: ZenithProtocol.TradingController.Accounts.AccountState[]) {
        const result = new Array<BrokerageAccountsDataMessage.Account>(data.length);
        let count = 0;
        for (let index = 0; index < data.length; index++) {
            const account = ZenithConvert.Accounts.toDataMessageAccount(data[index]);
            result[count++] = account;
        }
        result.length = count;
        return result;
    }
}
