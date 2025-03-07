import { AssertInternalError, DecimalFactory, Ok, Result, UnexpectedCaseError } from '@pbkware/js-utils';
import { ErrorCode, ErrorCodeLogger, ZenithDataError } from '../../../../sys/internal-api';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    BalancesDataMessage,
    BrokerageAccountBalancesDataDefinition,
    DataMessage,
    ErrorPublisherSubscriptionDataMessage_DataError,
    QueryBrokerageAccountBalancesDataDefinition,
    RequestErrorDataMessages
} from "../../../common/internal-api";
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

/** @internal */
export class BalancesMessageConvert extends MessageConvert {
    constructor(private readonly _decimalFactory: DecimalFactory) {
        super();
    }

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof BrokerageAccountBalancesDataDefinition) {
            return this.createSubUnsubMessage(definition, request.typeId);
        } else {
            if (definition instanceof QueryBrokerageAccountBalancesDataDefinition) {
                return this.createPublishMessage(definition);
            } else {
                throw new AssertInternalError('TCBCM548192875', definition.description);
            }
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id
    ): DataMessage {
        if (message.Controller !== ZenithProtocol.MessageContainer.Controller.Trading) {
            throw new ZenithDataError(ErrorCode.BMCPMC393833421, message.Controller);
        } else {
            let changesOrErrorText: BalancesDataMessage.Change[] | string;
            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish:
                    if (message.Topic as ZenithProtocol.TradingController.TopicName !== ZenithProtocol.TradingController.TopicName.QueryBalances) {
                        throw new ZenithDataError(ErrorCode.BMCPMP9833333828, message.Topic);
                    } else {
                        const publishMsg = message as ZenithProtocol.TradingController.Balances.PublishSubPayloadMessageContainer;
                        changesOrErrorText = this.parseData(publishMsg.Data);
                    }
                    break;
                case ZenithConvert.MessageContainer.Action.Id.Sub:
                    if (!message.Topic.startsWith(ZenithProtocol.TradingController.TopicName.Balances)) {
                        throw new ZenithDataError(ErrorCode.BMCPMS7744777737277, message.Topic);
                    } else {
                        const subMsg = message as ZenithProtocol.TradingController.Balances.PublishSubPayloadMessageContainer;
                        changesOrErrorText = this.parseData(subMsg.Data);
                    }
                    break;
                default:
                    throw new UnexpectedCaseError('BMCPMD43888432888448', actionId.toString(10));
            }

            if (typeof changesOrErrorText === 'string') {
                const errorText = 'Balances: ' + changesOrErrorText;
                ErrorCodeLogger.logDataError('BMCPME989822220', errorText);
                const errorMessage = new ErrorPublisherSubscriptionDataMessage_DataError(subscription.dataItemId,
                    subscription.dataItemRequestNr,
                    errorText,
                    AdiPublisherSubscription.AllowedRetryTypeId.Never
                );
                return errorMessage;
            } else {
                const dataMessage = new BalancesDataMessage();
                dataMessage.dataItemId = subscription.dataItemId;
                dataMessage.dataItemRequestNr = subscription.dataItemRequestNr;
                dataMessage.changes = changesOrErrorText;
                return dataMessage;
            }
        }
    }

    private createPublishMessage(definition: QueryBrokerageAccountBalancesDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        // const account = ZenithConvert.EnvironmentedAccount.fromId(definition.accountId);
        const result: ZenithProtocol.TradingController.Balances.PublishMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: ZenithProtocol.TradingController.TopicName.QueryBalances,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
            Data: {
                Account: definition.accountZenithCode,
            }
        };

        return new Ok(result);
    }

    private createSubUnsubMessage(
        definition: BrokerageAccountBalancesDataDefinition,
        requestTypeId: AdiPublisherRequest.TypeId
    ): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const topicName = ZenithProtocol.TradingController.TopicName.Balances;
        // const enviromentedAccount = ZenithConvert.EnvironmentedAccount.fromId(definition.accountId);

        const result: ZenithProtocol.SubUnsubMessageContainer = {
            Controller: ZenithProtocol.MessageContainer.Controller.Trading,
            Topic: topicName + ZenithProtocol.topicArgumentsAnnouncer + definition.accountZenithCode,
            Action: ZenithConvert.MessageContainer.Action.fromRequestTypeId(requestTypeId),
        };

        return new Ok(result);
    }

    private parseData(balances: ZenithProtocol.TradingController.Balances.Balance[]) {
        const result = new Array<BalancesDataMessage.Change>(balances.length);
        let count = 0;
        for (let index = 0; index < balances.length; index++) {
            const balance = balances[index];
            const change = ZenithConvert.Balances.toChange(this._decimalFactory, balance);
            if (typeof change !== 'string') {
                result[count++] = change;
            } else {
                return change; // Error Text string;
            }
        }
        result.length = count;
        return result;
    }
}
