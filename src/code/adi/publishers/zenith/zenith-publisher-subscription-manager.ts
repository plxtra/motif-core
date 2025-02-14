import {
    AssertInternalError,
    DecimalFactory,
    Integer,
    MapKey,
    newNowDate,
    SysTick,
    UnexpectedCaseError,
    UnreachableCaseError,
} from '@xilytix/sysutils';
import { StringId, Strings } from '../../../res/internal-api';
import {
    ErrorCode,
    ZenithDataError
} from "../../../sys/internal-api";
import { AdiPublisherSubscriptionManager } from '../../common/adi-publisher-subscription-manager';
import {
    AdiPublisherRequest,
    AdiPublisherSubscription,
    DataMessage,
    DataMessages,
    ErrorPublisherSubscriptionDataMessage,
    ErrorPublisherSubscriptionDataMessage_PublishRequestError,
    ErrorPublisherSubscriptionDataMessage_SubRequestError,
    ErrorPublisherSubscriptionDataMessage_UserNotAuthorised,
    WarningPublisherSubscriptionDataMessage
} from "../../common/internal-api";
import { ZenithProtocol } from './physical-message/protocol/zenith-protocol';
import { ZenithConvert } from './physical-message/zenith-convert';
import { ZenithMessageConvert } from './physical-message/zenith-message-convert';

export class ZenithPublisherSubscriptionManager extends AdiPublisherSubscriptionManager {
    sendPhysicalMessageEvent: ZenithPublisherSubscriptionManager.SendPhysicalMessageEvent;
    authMessageReceivedEvent: ZenithPublisherSubscriptionManager.AuthMessageReceivedEvent;

    private readonly _zenithMessageConvert: ZenithMessageConvert;
    // TODO:MED Replace array with a list so that memory is not being constantly requested and released.
    private readonly _physicalMessages: ZenithProtocol.PhysicalMessage[] = [];

    constructor(decimalFactory: DecimalFactory) {
        super();
        this._zenithMessageConvert = new ZenithMessageConvert(decimalFactory);
    }

    addPhysicalMessage(message: unknown): void {
        if (typeof message === 'string') {
            this._physicalMessages.push(message);
            this.checkLogMessage(message, true);
        } else {
            // Unexpected message type.
            throw new AssertInternalError('FSREZAPM28883');
        }
    }

    override exercise(nowTickTime: SysTick.Time): DataMessages | undefined {
        let dataMessages = super.exercise(nowTickTime);

        if (this._physicalMessages.length > 0) {
            if (dataMessages === undefined) {
                dataMessages = new DataMessages();
            }
            try {
                for (let c1 = 0; c1 < this._physicalMessages.length; c1++) {
                    const msg = this._physicalMessages[c1];
                    const dm: DataMessage[] = this.processPhysicalMessage(msg);
                    for (let c2 = 0; c2 < dm.length; c2++) {
                        dataMessages.add(dm[c2]);
                    }
                }
            } finally {
                // delete messages even if an exception has occurred.  Otherwise loops forever
                this._physicalMessages.length = 0;
            }
        }
        return dataMessages;
    }

    protected activateSubscription(subscription: AdiPublisherSubscription) {
        const request = this.createRequest(subscription, AdiPublisherRequest.TypeId.SubscribeQuery);
        this.queueRequestForSending(request);
    }

    protected deactivateSubscription(subscription: AdiPublisherSubscription) {
        // Note that if unsubscribing, then subscription has already been deregistered with PublisherSubscriptionManager
        if (subscription.unsubscribeRequired) { // do not unsubscribe Publisher requests
            const request = this.createRequest(subscription, AdiPublisherRequest.TypeId.Unsubscribe);
            this.queueRequestForSending(request);
            subscription.unsubscribeRequired = false;
        }
    }

    // Count: Process `Count` number of subscriptions in the `SendQueue`. Remaining subscriptions in list will be processed in
    // subsequent calls. This allows the request engine to throttle the outgoing packets if required.
    protected sendPackets(nowTickTime: SysTick.Time, sendQueue: AdiPublisherSubscriptionManager.SendQueue, count: number) {
        for (let index = 0; index < count; index++) {
            const request = sendQueue.getAt(index);
            const subscription = request.subscription;

            if (!subscription.resendAllowed && subscription.beenSentAtLeastOnce) {
                throw new AssertInternalError('ZPSMSP8787323910', subscription.dataDefinition.description);
            } else {
                const requestMsgResult = this._zenithMessageConvert.createRequestMessage(request);
                if (requestMsgResult.isErr()) {
                    const requestErrorDataMessages = requestMsgResult.error;
                    const dataMessages = requestErrorDataMessages.dataMessages;
                    dataMessages.forEach((dataMessage) => this.addExerciseDataMessage(dataMessage));
                    if (requestErrorDataMessages.subscribed) {
                        const syncDataMessage = this.createSynchronisedDataMessage(subscription, true);
                        this.addExerciseDataMessage(syncDataMessage);
                    }
                    this.deleteSubscription(subscription, false); // Do not remove from queue as queue entries will be deleted in batch later on
                } else {
                    const requestMsg = requestMsgResult.value;
                    let actionId = ZenithConvert.MessageContainer.Action.tryActionToId(requestMsg.Action);
                    if (actionId === undefined) {
                        actionId = ZenithConvert.MessageContainer.Action.Id.Publish; // as per spec
                    }
                    let messageMapKey: MapKey | undefined;
                    switch (actionId) {
                        case ZenithConvert.MessageContainer.Action.Id.Publish:
                            messageMapKey = this.calculatePublishMessageMapKey(requestMsg);
                            break;
                        case ZenithConvert.MessageContainer.Action.Id.Sub:
                            requestMsg.Confirm = true;
                            messageMapKey = this.calculateSubMessageMapKey(requestMsg);
                            subscription.unsubscribeRequired = true;
                            break;
                        case ZenithConvert.MessageContainer.Action.Id.Unsub:
                            // not expecting a reply
                            requestMsg.Confirm = false;
                            messageMapKey = undefined;
                            // Unsub subscriptions are either:
                            // 1) no longer registered in PublisherRequestEngine and can be ignored, or
                            // 2) timed out and will have their state managed as part of timed out process
                            break;
                        default:
                            throw new UnexpectedCaseError('ZPSMSPA69482228', actionId.toString(10));
                    }
                    subscription.beenSentAtLeastOnce = true;

                    const physicalMessage = JSON.stringify(requestMsg);

                    const responseTimeoutTickSpan = this.sendPhysicalMessageEvent(physicalMessage);

                    if (messageMapKey !== undefined) {
                        this.waitResponse(nowTickTime, request, messageMapKey, responseTimeoutTickSpan);
                    }

                    this.checkLogMessage(physicalMessage, false);
                }
            }
        }
    }

    private calculatePublishMessageMapKey(msg: ZenithProtocol.MessageContainer) {
        const transactionId = msg.TransactionID;
        if (transactionId === undefined) {
            throw new AssertInternalError('ZPSMSPT1199948243', JSON.stringify(msg));
        } else {
            return transactionId.toString(10);
        }
    }

    private calculateSubMessageMapKey(msg: ZenithProtocol.MessageContainer) {
        return msg.Controller + '+' + msg.Topic;
    }

    private calculateErrorSubscription(msg: ZenithProtocol.ResponseUpdateMessageContainer): ZenithPublisherSubscriptionManager.ErrorSubscription | undefined {
        const transactionId = msg.TransactionID;
        if (transactionId === undefined) {
            // must be sub
            const subMsgMapKey = this.calculateSubMessageMapKey(msg);
            const subscription = this.subscriptionByMessageMap.get(subMsgMapKey);
            if (subscription !== undefined) {
                return {
                    subscription,
                    errorTypeId: AdiPublisherSubscription.ErrorTypeId.SubRequestError,
                };
            }
        } else {
            // assume publish
            const publishMsgMapKey = this.calculatePublishMessageMapKey(msg);
            let subscription = this.subscriptionByMessageMap.get(publishMsgMapKey);
            if (subscription !== undefined) {
                return {
                    subscription,
                    errorTypeId: AdiPublisherSubscription.ErrorTypeId.PublishRequestError,
                };
            } else {
                // try sub
                const subMsgMapKey = this.calculateSubMessageMapKey(msg);
                subscription = this.subscriptionByMessageMap.get(subMsgMapKey);

                if (subscription !== undefined) {
                    return {
                        subscription,
                        errorTypeId: AdiPublisherSubscription.ErrorTypeId.SubRequestError,
                    };
                }
            }
        }

        return undefined;
    }

    private processPhysicalMessage(message: ZenithProtocol.PhysicalMessage): DataMessage[] {
        const parsedMessage = JSON.parse(message) as ZenithProtocol.ResponseUpdateMessageContainer;

        if (parsedMessage.Controller === ZenithProtocol.MessageContainer.Controller.Auth) {
            this.authMessageReceivedEvent(parsedMessage);
            return [];
        } else {
            let actionId = ZenithConvert.MessageContainer.Action.tryActionToId(parsedMessage.Action);

            if (actionId === undefined) {
                if (parsedMessage.TransactionID !== undefined) {
                    actionId = ZenithConvert.MessageContainer.Action.Id.Publish;
                } else {
                    actionId = ZenithConvert.MessageContainer.Action.Id.Sub;
                }
            }

            switch (actionId) {
                case ZenithConvert.MessageContainer.Action.Id.Publish: {
                    const msgMapKey = this.calculatePublishMessageMapKey(parsedMessage);
                    const subscription = this.subscriptionByMessageMap.get(msgMapKey);
                    if (subscription === undefined) {
                        return []; // was previously unsubscribed with unsubscribeDataItem()
                    } else {
                        const dataMessage = this._zenithMessageConvert.createDataMessage(subscription, parsedMessage, actionId);
                        if (DataMessage.isErrorPublisherSubscriptionDataMessage(dataMessage)) {
                            // probably data error
                            this.processErrorMessage(dataMessage, subscription);
                            return [dataMessage];
                        } else {
                            this.deleteSubscription(subscription, true); // remove from manager as will not need after this
                            const syncDataMessage = this.createSynchronisedDataMessage(subscription, true);
                            return [dataMessage, syncDataMessage];
                        }
                    }
                }

                case ZenithConvert.MessageContainer.Action.Id.Sub: {
                    const msgMapKey = this.calculateSubMessageMapKey(parsedMessage);
                    const subscription = this.subscriptionByMessageMap.get(msgMapKey);
                    if (subscription === undefined) {
                        return []; // was previously unsubscribed with unsubscribeDataItem()
                    } else {
                        if (parsedMessage.Confirm === true) {
                            // is confirmation
                            if (subscription.stateId !== AdiPublisherSubscription.StateId.ResponseWaiting) {
                                return []; // must have received a server initiated unsub
                            } else {
                                this.moveSubscriptionFromResponseWaitingToSubscribed(subscription);
                                const syncDataMessage = this.createSynchronisedDataMessage(subscription, false);
                                return [syncDataMessage];
                            }
                        } else {
                            const data = parsedMessage.Data;
                            const error = this.checkUserNotAuthorisedError(data);
                            if (error !== undefined) {
                                // Is error message
                                const errorDataMessage = this.createSubscriptionErrorDataMessage(subscription, parsedMessage, error);
                                this.processErrorMessage(errorDataMessage, subscription);
                                return [errorDataMessage];
                            } else {
                                // Has data. Do not change change subscription state unless data message is error
                                const dataMessage = this._zenithMessageConvert.createDataMessage(subscription, parsedMessage, actionId);

                                if (DataMessage.isErrorPublisherSubscriptionDataMessage(dataMessage)) {
                                    // probably data error
                                    this.processErrorMessage(dataMessage, subscription);
                                }

                                return [dataMessage];
                            }
                        }
                    }
                }

                case ZenithConvert.MessageContainer.Action.Id.Unsub: {
                    const unsubMsgMapKey = this.calculateSubMessageMapKey(parsedMessage);
                    const unsubSubscription = this.subscriptionByMessageMap.get(unsubMsgMapKey);
                    if (unsubSubscription === undefined) {
                        return []; // has already been unsubscribed
                    } else {
                        if (parsedMessage.Confirm === true) {
                            // we never ask for confirmations of unsubscribes so this is an error
                            throw new ZenithDataError(ErrorCode.ZPSMPPM2994344434, JSON.stringify(parsedMessage));
                        } else {
                            // data does not in exist (eg. the symbol was deleted) or you don't have access, or similar

                            let error = this.checkUserNotAuthorisedError(parsedMessage.Data);
                            if (error === undefined) {
                                // Unexpected. Use default UserNotAuthorised error
                                error = {
                                    texts: [],
                                    errorTypeId: AdiPublisherSubscription.ErrorTypeId.UserNotAuthorised,
                                    delayRetryAllowedSpecified: false,
                                    limitedSpecified: false,
                                };
                            }
                            this.notifySubscriptionError(error.errorTypeId);
                            const errorDataMessage = this.createSubscriptionErrorDataMessage(unsubSubscription, parsedMessage, error);

                            if (errorDataMessage.allowedRetryTypeId === AdiPublisherSubscription.AllowedRetryTypeId.Never) {
                                this.deleteSubscription(unsubSubscription, true);
                            } else {
                                this.moveSubscriptionFromResponseWaitingToInactive(unsubSubscription);
                            }
                            return [errorDataMessage];
                        }
                    }
                }

                case ZenithConvert.MessageContainer.Action.Id.Error: {
                    const errorSubscription = this.calculateErrorSubscription(parsedMessage);
                    if (errorSubscription === undefined) {
                        // already unsubscribed
                        return [];
                    } else {
                        switch (errorSubscription.errorTypeId) {
                            case AdiPublisherSubscription.ErrorTypeId.PublishRequestError: {
                                const subscription = errorSubscription.subscription;

                                let delayRetryAllowedSpecified = false;
                                let limitedSpecified = false;

                                const texts = this.checkGetResponseUpdateMessageErrorTexts(parsedMessage.Data);
                                if (texts !== undefined) {
                                    for (let i = 0; i < texts.length; i++) {
                                        const text = texts[i];
                                        switch (text as ZenithProtocol.ResponseUpdateMessageContainer.Error.Code) {
                                            case ZenithProtocol.ResponseUpdateMessageContainer.Error.Code.Retry:
                                                delayRetryAllowedSpecified = true;
                                                break;
                                            case ZenithProtocol.ResponseUpdateMessageContainer.Error.Code.Limited:
                                                limitedSpecified = true;
                                                break;
                                        }
                                    }

                                    if (subscription.errorsWarnings === undefined) {
                                        subscription.errorsWarnings = texts;
                                    } else {
                                        subscription.errorsWarnings.push(...texts);
                                    }
                                }

                                subscription.errorWarningCount++;
                                if (delayRetryAllowedSpecified) {
                                    subscription.delayRetryAllowedSpecified = true;
                                }
                                if (limitedSpecified) {
                                    subscription.limitedSpecified = true;
                                }

                                return [];
                            }

                            case AdiPublisherSubscription.ErrorTypeId.SubRequestError: {
                                this.notifyServerWarning();

                                let texts = this.checkGetResponseUpdateMessageErrorTexts(parsedMessage.Data);

                                if (texts === undefined) {
                                    texts = [Strings[StringId.BadnessReasonId_PublisherServerWarning]];
                                }

                                const subscription = errorSubscription.subscription;
                                subscription.errorWarningCount++;

                                const errorDataMessage = this.createSubscriptionWarningDataMessage(
                                    subscription,
                                    parsedMessage,
                                    texts,
                                );
                                return [errorDataMessage];
                            }
                            default:
                                throw new UnreachableCaseError('ZPSMPPME45455', errorSubscription.errorTypeId);
                        }
                    }
                }

                case ZenithConvert.MessageContainer.Action.Id.Cancel:
                    throw new ZenithDataError(ErrorCode.ZPSMPPM23230917111, JSON.stringify(parsedMessage));

                default:
                    throw new UnreachableCaseError('ZFRESPD77830922', actionId);
            }
        }
    }

    private processErrorMessage(dataMessage: ErrorPublisherSubscriptionDataMessage, subscription: AdiPublisherSubscription) {
        this.notifySubscriptionError(dataMessage.errorTypeId);

        if (dataMessage.allowedRetryTypeId === AdiPublisherSubscription.AllowedRetryTypeId.Never) {
            this.deleteSubscription(subscription, true);
        } else {
            this.moveSubscriptionFromResponseWaitingToInactive(subscription);
        }
    }

    private checkUserNotAuthorisedError(data: ZenithProtocol.ResponseUpdateMessageContainer.Data) {
        if (data === undefined || data === null) {
            const error: ZenithPublisherSubscriptionManager.ResponseUpdateMessageError = {
                texts: [],
                errorTypeId: AdiPublisherSubscription.ErrorTypeId.UserNotAuthorised,
                delayRetryAllowedSpecified: false,
                limitedSpecified: false,
            };
            return error;
        } else {
            return undefined;
        }
    }

    private createResponseUpdateMessageError(data: ZenithProtocol.ResponseUpdateMessageContainer.Data, actionErrorTypeId: AdiPublisherSubscription.ErrorTypeId) {
        let texts = this.checkGetResponseUpdateMessageErrorTexts(data);

        if (texts === undefined) {
            texts = [Strings[StringId.BadnessReasonId_PublisherServerWarning]];
        }

        let delayRetryAllowedSpecified = false;
        let limitedSpecified = false;
        for (let i = 0; i < texts.length; i++) {
            const text = texts[i];
            switch (text as ZenithProtocol.ResponseUpdateMessageContainer.Error.Code) {
                case ZenithProtocol.ResponseUpdateMessageContainer.Error.Code.Retry:
                    delayRetryAllowedSpecified = true;
                    break;
                case ZenithProtocol.ResponseUpdateMessageContainer.Error.Code.Limited:
                    limitedSpecified = true;
                    break;
            }
        }

        const error: ZenithPublisherSubscriptionManager.ResponseUpdateMessageError = {
            texts,
            errorTypeId: actionErrorTypeId,
            delayRetryAllowedSpecified,
            limitedSpecified,
        };

        return error;
    }

    private checkGetResponseUpdateMessageErrorTexts(data: ZenithProtocol.ResponseUpdateMessageContainer.Data) {
        if (typeof data === 'string') {
            return [data];
        } else {
            if (data instanceof Array && data.length > 0 && typeof data[0] === 'string') {
                return data;
            } else {
                return undefined;
            }
        }
    }

    private createSubscriptionErrorDataMessage(subscription: AdiPublisherSubscription, zenithMsg: ZenithProtocol.ResponseUpdateMessageContainer,
        error: ZenithPublisherSubscriptionManager.ResponseUpdateMessageError
    ) {
        const errorTypeId = error.errorTypeId;

        const dataItemId = subscription.dataItemId;
        const dataItemRequestNr = subscription.dataItemRequestNr;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const controller = zenithMsg.Controller ?? '';
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const topic = zenithMsg.Topic ?? '';

        const controllerTopic = controller + '/' + topic;
        const joinedErrorTexts = error.texts.join();
        const errorText = `${joinedErrorTexts} (${controllerTopic})`;

        let allowedRetryTypeId: AdiPublisherSubscription.AllowedRetryTypeId;
        if (errorTypeId === AdiPublisherSubscription.ErrorTypeId.UserNotAuthorised) {
            allowedRetryTypeId = AdiPublisherSubscription.AllowedRetryTypeId.Never;
        } else {
            if (error.delayRetryAllowedSpecified) {
                allowedRetryTypeId = AdiPublisherSubscription.AllowedRetryTypeId.Delay;
            } else {
                allowedRetryTypeId = AdiPublisherSubscription.AllowedRetryTypeId.SubscribabilityIncrease;
            }
        }

        let msg: ErrorPublisherSubscriptionDataMessage;

        switch (errorTypeId) {
            case AdiPublisherSubscription.ErrorTypeId.PublishRequestError:
                msg = new ErrorPublisherSubscriptionDataMessage_PublishRequestError(dataItemId, dataItemRequestNr,
                    errorText, allowedRetryTypeId);
                break;
            case AdiPublisherSubscription.ErrorTypeId.InvalidRequest:
                throw new AssertInternalError('ZPSMCSEDMIR45334', errorTypeId.toString());
            case AdiPublisherSubscription.ErrorTypeId.SubRequestError:
                msg = new ErrorPublisherSubscriptionDataMessage_SubRequestError(dataItemId, dataItemRequestNr,
                    errorText, allowedRetryTypeId);
                break;
            case AdiPublisherSubscription.ErrorTypeId.UserNotAuthorised:
                msg = new ErrorPublisherSubscriptionDataMessage_UserNotAuthorised(dataItemId, dataItemRequestNr, errorText);
                break;

            case AdiPublisherSubscription.ErrorTypeId.DataError:
            case AdiPublisherSubscription.ErrorTypeId.Internal:
            case AdiPublisherSubscription.ErrorTypeId.RequestTimeout:
            case AdiPublisherSubscription.ErrorTypeId.Offlined:
                throw new AssertInternalError('ZPSMCSEDMO45334', errorTypeId.toString());
            default:
                throw new UnreachableCaseError('ZPSMCSEDMD45334', errorTypeId);
        }
        return msg;
    }

    private createSubscriptionWarningDataMessage(subscription: AdiPublisherSubscription, zenithMsg: ZenithProtocol.ResponseUpdateMessageContainer,
        errorArray: string[]
    ) {
        const dataItemId = subscription.dataItemId;
        const dataItemRequestNr = subscription.dataItemRequestNr;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const controller = zenithMsg.Controller ?? '';
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        const topic = zenithMsg.Topic ?? '';

        const controllerTopic = controller + '/' + topic;
        const errorText = errorArray.join();
        const fullErrorText = `${errorText} (${controllerTopic})`;

        const msg = new WarningPublisherSubscriptionDataMessage(dataItemId, dataItemRequestNr, fullErrorText);
        return msg;
    }

    private checkLogMessage(message: string, incoming: boolean) {
        switch (ZenithPublisherSubscriptionManager.logLevelId) {
            case ZenithPublisherSubscriptionManager.LogLevelId.Off:
                return;
            case ZenithPublisherSubscriptionManager.LogLevelId.Partial: {
                const nowTime = newNowDate();
                const nowTimeStr = ZenithPublisherSubscriptionManager.logTimeFormat.format(nowTime);
                const directionStr = incoming ? '<-- ' : '--> ';
                window.motifLogger.logDebug(`${nowTimeStr} Zenith ${directionStr}${message}`, 120);
                return;
            }
            case ZenithPublisherSubscriptionManager.LogLevelId.Full: {
                const nowTime = newNowDate();
                const nowTimeStr = ZenithPublisherSubscriptionManager.logTimeFormat.format(nowTime);
                const directionStr = incoming ? '<-- ' : '--> ';
                window.motifLogger.logDebug(`${nowTimeStr} Zenith ${directionStr}${message}`);
                return;
            }
            default:
                throw new UnreachableCaseError('ZPSMCLM6994822778', ZenithPublisherSubscriptionManager.logLevelId);
        }
    }
}

export namespace ZenithPublisherSubscriptionManager {
    export type AuthMessageReceivedEvent = (this: void, message: ZenithProtocol.MessageContainer) => void;
    export type SendPhysicalMessageEvent = (this: void, message: string) => Integer; // returns response timeout TickSpan

    export const enum LogLevelId {
        Off,      // No messages are logged.
        Partial,  // All outgoing messages are logged. The first incoming message for each request is logged.
        Full,     // Add outgoing and incoming messages are logged.
    }

    export const defaultLogLevelId = LogLevelId.Off;
    // eslint-disable-next-line prefer-const
    export let logLevelId: LogLevelId = defaultLogLevelId;

    export const logTimeOptions: Intl.DateTimeFormatOptions = {
        hour: 'numeric', minute: 'numeric', second: 'numeric',
        hour12: false
    };

    export const logTimeFormat = new Intl.DateTimeFormat(undefined, logTimeOptions);

    export interface ResponseUpdateMessageError {
        readonly texts: string[];
        readonly errorTypeId: AdiPublisherSubscription.ErrorTypeId;
        readonly delayRetryAllowedSpecified: boolean;
        readonly limitedSpecified: boolean;
    }

    export interface ErrorSubscription {
        readonly errorTypeId: AdiPublisherSubscription.ErrorTypeId.PublishRequestError | AdiPublisherSubscription.ErrorTypeId.SubRequestError;
        readonly subscription: AdiPublisherSubscription;
    }
}
