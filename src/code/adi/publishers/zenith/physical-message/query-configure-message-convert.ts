import { AssertInternalError, Ok, Result, SysTick } from '@pbkware/js-utils';
import { ErrorCode, ZenithDataError } from '../../../../sys';
import { AdiPublisherRequest, AdiPublisherSubscription, DataMessage, RequestErrorDataMessages } from '../../../common/internal-api';
import { ZenithQueryConfigureDataDefinition } from '../zenith-data-definitions';
import { ZenithQueryConfigureDataMessage } from '../zenith-data-messages';
import { MessageConvert } from './message-convert';
import { ZenithProtocol } from './protocol/zenith-protocol';
import { ZenithConvert } from './zenith-convert';

export class QueryConfigureMessageConvert extends MessageConvert {

    createRequestMessage(request: AdiPublisherRequest): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const definition = request.subscription.dataDefinition;
        if (definition instanceof ZenithQueryConfigureDataDefinition) {
            return this.createPublishMessage(definition);
        } else {
            throw new AssertInternalError('QCMCCRM338843593', definition.description);
        }
    }

    parseMessage(
        subscription: AdiPublisherSubscription,
        message: ZenithProtocol.MessageContainer,
        actionId: ZenithConvert.MessageContainer.Action.Id,
    ): DataMessage {
        if (actionId !== ZenithConvert.MessageContainer.Action.Id.Publish) {
            throw new ZenithDataError(ErrorCode.QCMCPMA788853223, JSON.stringify(message));
        } else {
            if (message.Topic as ZenithProtocol.ControllersCommon.TopicName !== ZenithProtocol.ControllersCommon.TopicName.QueryConfigure) {
                throw new ZenithDataError(ErrorCode.QCMCPMT10053584222, message.Topic);
            } else {
                const responseMsg = message as ZenithProtocol.ControllersCommon.QueryConfigure.PayloadMessageContainer;
                const {actionTimeout, subscriptionTimeout} = this.parseData(responseMsg.Data);

                const dataMessage = new ZenithQueryConfigureDataMessage(subscription.dataItemId, subscription.dataItemRequestNr,
                    actionTimeout, subscriptionTimeout);

                return dataMessage;
            }
        }
    }

    private createPublishMessage(definition: ZenithQueryConfigureDataDefinition): Result<ZenithProtocol.MessageContainer, RequestErrorDataMessages> {
        const result: ZenithProtocol.ControllersCommon.QueryConfigure.PublishMessageContainer = {
            Controller: definition.controller,
            Topic: ZenithProtocol.ControllersCommon.TopicName.QueryConfigure,
            Action: ZenithProtocol.MessageContainer.Action.Publish,
            TransactionID: AdiPublisherRequest.getNextTransactionId(),
        };

        return new Ok(result);
    }

    private parseData(payload: ZenithProtocol.ControllersCommon.QueryConfigure.Payload) {
        const payloadActionTimeout = payload.ActionTimeout;
        let actionTimeout: SysTick.Span;
        if (payloadActionTimeout === undefined) {
            actionTimeout = ZenithProtocol.ControllersCommon.QueryConfigure.defaultActionTimeout;
        } else {
            const parsedActionTimeout = ZenithConvert.Time.toTimeSpan(payloadActionTimeout);
            if (parsedActionTimeout === undefined) {
                throw new ZenithDataError(ErrorCode.ZCQCTAA7744510945348, payloadActionTimeout);
            } else {
                actionTimeout = parsedActionTimeout;
            }
        }

        const payloadSubscriptionTimeout = payload.SubscriptionTimeout;
        let subscriptionTimeout: SysTick.Span;
        if (payloadSubscriptionTimeout === undefined) {
            subscriptionTimeout = ZenithProtocol.ControllersCommon.QueryConfigure.defaultSubscriptionTimeout;
        } else {
            const parsedSubscriptionTimeout = ZenithConvert.Time.toTimeSpan(payloadSubscriptionTimeout);
            if (parsedSubscriptionTimeout === undefined) {
                throw new ZenithDataError(ErrorCode.ZCQCTAS7744510945348, payloadSubscriptionTimeout);
            } else {
                subscriptionTimeout = parsedSubscriptionTimeout;
            }
        }

        const parsedData: QueryConfigureMessageConvert.ParsedData = {
            actionTimeout,
            subscriptionTimeout,
        };

        return parsedData;
    }
}

export namespace QueryConfigureMessageConvert {
    export interface ParsedData {
        actionTimeout: SysTick.Span;
        subscriptionTimeout: SysTick.Span;
    }
}
