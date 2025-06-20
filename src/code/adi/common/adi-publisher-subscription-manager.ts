import {
    AssertInternalError,
    ComparableList,
    EnumInfoOutOfOrderError,
    getErrorMessage,
    Integer,
    Logger,
    MapKey,
    mSecsPerSec,
    secsPerMin,
    SysTick,
    UnreachableCaseError,
} from '@pbkware/js-utils';
import { StringId, Strings } from '../../res';
import {
    Badness,
} from '../../sys';
import { AdiPublisherRequest } from './adi-publisher-request';
import { AdiPublisherSubscription } from './adi-publisher-subscription';
import { AdiPublisherSubscriptionDelayRetryAlgorithmId } from './adi-publisher-subscription-delay-retry-algorithm';
import { PublisherSubscriptionDataDefinition } from './data-definition';
import {
    DataMessage,
    DataMessages,
    ErrorPublisherSubscriptionDataMessage_Internal,
    ErrorPublisherSubscriptionDataMessage_Offlined,
    ErrorPublisherSubscriptionDataMessage_RequestTimeout,
    OffliningPublisherSubscriptionDataMessage,
    OnlinedPublisherSubscriptionDataMessage,
    SynchronisedPublisherSubscriptionDataMessage
} from './data-messages';
import { DataItemId, invalidDataItemRequestNr } from './data-types';

export abstract class AdiPublisherSubscriptionManager {
    subscriptionErrorEvent: AdiPublisherSubscriptionManager.SubscriptionErrorEvent;
    serverWarningEvent: AdiPublisherSubscriptionManager.ServerWarningEvent;

    private _subscriptionByDataItemIdMap = new Map<DataItemId, AdiPublisherSubscription>();
    private _subscriptionByMessageMap = new Map<MapKey, AdiPublisherSubscription>();
    private _highPrioritySendQueue = new AdiPublisherSubscriptionManager.SendQueue(PublisherSubscriptionDataDefinition.RequestSendPriorityId.High);
    private _normalSendQueue = new AdiPublisherSubscriptionManager.SendQueue(PublisherSubscriptionDataDefinition.RequestSendPriorityId.Normal);
    private _responseWaitList = new AdiPublisherSubscriptionManager.WaitList(AdiPublisherRequest.compareResponseTimeoutTime);

    private _exerciseDataMessages: AdiPublisherSubscriptionManager.ExerciseDataMessageList;

    private _online = false;
    private _offlineDeactivating = false;
    private _finalised = false;

    constructor() {
        this._exerciseDataMessages = new AdiPublisherSubscriptionManager.ExerciseDataMessageList();
    }

    get subscriptionCount() { return this._subscriptionByDataItemIdMap.size; }

    protected get subscriptionByMessageMap() { return this._subscriptionByMessageMap; }

    finalise() {
        window.motifLogger.logInfo('PublisherRequestEngine finalising');

        this._highPrioritySendQueue.clear();
        this._normalSendQueue.clear();
        this._responseWaitList.clear();

        this._subscriptionByDataItemIdMap.clear();
        this._subscriptionByMessageMap.clear();

        this._finalised = this._subscriptionByDataItemIdMap.size === 0; // should always be true

        return this._finalised;
    }

    subscribeDataItemId(
        dataItemId: DataItemId,
        dataDefinition: PublisherSubscriptionDataDefinition,
    ) {
        let subscription = this._subscriptionByDataItemIdMap.get(dataItemId);
        if (subscription !== undefined) {
            throw new AssertInternalError('FSRES2000020020200', dataDefinition.description);
        } else {
            const resendAllowed = dataDefinition.subscribabilityIncreaseRetryAllowed ||
                dataDefinition.delayRetryAlgorithmId !== AdiPublisherSubscriptionDelayRetryAlgorithmId.Never;

            subscription = {
                dataItemId,
                dataItemRequestNr: invalidDataItemRequestNr,
                dataDefinition,
                resendAllowed,
                stateId: AdiPublisherSubscription.StateId.Inactive,
                unsubscribeRequired: false,
                beenSentAtLeastOnce: false,
                activeMessageMapKey: '',
                errorWarningCount: 0,
                errorsWarnings: undefined,
                delayRetryAllowedSpecified: false,
                limitedSpecified: false,
            };
            this._subscriptionByDataItemIdMap.set(subscription.dataItemId, subscription);

            return this._online;
        }
    }

    unsubscribeDataItemId(dataItemId: DataItemId) {
        const subscription = this._subscriptionByDataItemIdMap.get(dataItemId);
        if (subscription !== undefined) {
            this.deleteSubscription(subscription, true);
            // subscription is no longer registered.  Only used to send unsubscribe (if necessary) and then will become unreferenced
            this.deactivateSubscription(subscription);
        }
    }

    activateDataItem(dataItemId: DataItemId, dataItemRequestNr: Integer) {
        const subscription = this._subscriptionByDataItemIdMap.get(dataItemId);
        if (subscription === undefined) {
            throw new AssertInternalError('PSMA11118844239');
        } else {
            if (this._offlineDeactivating) {
                throw new AssertInternalError('PSMSDI1999964482', subscription.dataDefinition.description);
            } else {
                subscription.dataItemRequestNr = dataItemRequestNr;
                this.activateSubscription(subscription);
                this.tryCatchProcessSendQueues();
            }
        }
    }

    setBatchNormalRequests(value: boolean) {
        this._normalSendQueue.batchingActive = value;
    }

    exercise(nowTickTime: SysTick.Time): DataMessages | undefined {
        try {
            this.processResponseWaitList(nowTickTime);
            this.processSendQueues(nowTickTime);
        } catch (e) {
            this.purgeSubscriptionsWithInternalError(getErrorMessage(e));
            throw (e);
        }

        let result: DataMessages | undefined;
        if (this._exerciseDataMessages.count <= 0) {
            result = undefined;
        } else {
            result = this._exerciseDataMessages;
            this._exerciseDataMessages = new AdiPublisherSubscriptionManager.ExerciseDataMessageList();
        }
        return result;
    }

    addExerciseDataMessage(msg: DataMessage): void {
        this._exerciseDataMessages.add(msg);
    }

    getNextTransactionId() {
        // could be made static if necessary
        return AdiPublisherRequest.getNextTransactionId();
    }

    comeOnline() {
        this._online = true;
        this.sendOnlinedMessages();
    }

    goOffline(offlinedErrorText: string) {
        this._online = false;

        this._offlineDeactivating = true;
        try {
            if (!this._finalised) {
                this.sendOffliningMessages();
                this.offlineSubscriptions(offlinedErrorText);
            }
        } finally {
            this._offlineDeactivating = false;
        }
    }

    protected notifySubscriptionError(typeId: AdiPublisherSubscription.ErrorTypeId) {
        this.subscriptionErrorEvent(typeId);
    }

    protected notifyServerWarning() {
        this.serverWarningEvent();
    }

    protected deleteSubscription(subscription: AdiPublisherSubscription, fromStateQueueWaitList: boolean) {
        this._subscriptionByDataItemIdMap.delete(subscription.dataItemId);

        if (subscription.activeMessageMapKey !== undefined) {
            this._subscriptionByMessageMap.delete(subscription.activeMessageMapKey);
        }

        if (fromStateQueueWaitList) {
            switch (subscription.stateId) {
                case AdiPublisherSubscription.StateId.Inactive: {
                    // no list or queue to delete from
                    break;
                }
                case AdiPublisherSubscription.StateId.HighPrioritySendQueued: {
                    const highPriorityIndex = this._highPrioritySendQueue.indexOfSubscription(subscription);
                    if (highPriorityIndex >= 0) {
                        this._highPrioritySendQueue.removeAtIndex(highPriorityIndex);
                    } else {
                        throw new AssertInternalError('FSREDSH6021119444', subscription.dataDefinition.description);
                    }
                    break;
                }
                case AdiPublisherSubscription.StateId.NormalSendQueued: {
                    const normalIndex = this._normalSendQueue.indexOfSubscription(subscription);
                    if (normalIndex >= 0) {
                        this._normalSendQueue.removeAtIndex(normalIndex);
                    } else {
                        throw new AssertInternalError('FSREDSN6021119444', subscription.dataDefinition.description);
                    }
                    break;
                }
                case AdiPublisherSubscription.StateId.ResponseWaiting: {
                    const reponseIndex = this._responseWaitList.indexOfSubscription(subscription);
                    if (reponseIndex >= 0) {
                        this._responseWaitList.removeAtIndex(reponseIndex);
                    } else {
                        throw new AssertInternalError('FSREDSP6021119441', subscription.dataDefinition.description);
                    }
                    break;
                }
                case AdiPublisherSubscription.StateId.Subscribed: {
                    // no specific list for Subscribed
                    break;
                }
                default:
                    throw new UnreachableCaseError('FSREDS0773891052999', subscription.stateId);
            }
        }
    }

    protected createRequest(subscription: AdiPublisherSubscription, requestTypeId: AdiPublisherRequest.TypeId) {
        const request: AdiPublisherRequest = {
            typeId: requestTypeId,
            subscription,
            responseTimeoutSpan: 0,
            responseTimeoutTime: 0,
        };
        return request;
    }

    protected queueRequestForSending(request: AdiPublisherRequest) {
        const subscription = request.subscription;
        // requests for a subscription (including unsubscribe) must always be made from same queue so they remain serialised
        const priorityId = subscription.dataDefinition.publisherRequestSendPriorityId;
        switch (priorityId) {
            case PublisherSubscriptionDataDefinition.RequestSendPriorityId.High:
                this._highPrioritySendQueue.add(request);
                subscription.stateId = AdiPublisherSubscription.StateId.HighPrioritySendQueued;
                break;
            case PublisherSubscriptionDataDefinition.RequestSendPriorityId.Normal:
                this._normalSendQueue.add(request);
                subscription.stateId = AdiPublisherSubscription.StateId.NormalSendQueued;
                break;
            default:
                throw new UnreachableCaseError('FSREQR55495728', priorityId);
        }
    }

    protected waitResponse(nowTickTime: SysTick.Time, request: AdiPublisherRequest, messageMapKey: MapKey,
        responseTimeoutTickSpan: SysTick.Span
    ) {
        const subscription = request.subscription;
        if (!AdiPublisherSubscription.State.idIsSendQueued(subscription.stateId)) {
            throw new AssertInternalError('FSREWR44493949444', subscription.stateId.toString(10));
        } else {
            // need to store message MapKey in subscription to handle unsubscribe
            request.subscription.activeMessageMapKey = messageMapKey;
            this.subscriptionByMessageMap.set(messageMapKey, request.subscription);
            request.responseTimeoutSpan = responseTimeoutTickSpan;
            request.responseTimeoutTime = nowTickTime + responseTimeoutTickSpan;
            request.subscription.stateId = AdiPublisherSubscription.StateId.ResponseWaiting;
            this._responseWaitList.add(request);
        }
    }

    protected moveSubscriptionFromResponseWaitingToSubscribed(subscription: AdiPublisherSubscription) {
        this._responseWaitList.removeSubscription(subscription);
        subscription.stateId = AdiPublisherSubscription.StateId.Subscribed;
    }

    protected moveSubscriptionFromResponseWaitingToInactive(subscription: AdiPublisherSubscription) {
        this._responseWaitList.removeSubscription(subscription);
        subscription.stateId = AdiPublisherSubscription.StateId.Inactive;
    }

    protected createSynchronisedDataMessage(subscription: AdiPublisherSubscription, unsubscribed: boolean) {
        return new SynchronisedPublisherSubscriptionDataMessage(subscription.dataItemId, subscription.dataItemRequestNr, unsubscribed);
    }

    private offlineSubscribedSubscriptions(errorText: string) {
        // All subscribed subscriptions will be in MessageMap
        for (const [keyIgnored, subscription] of this._subscriptionByMessageMap) {
            if (subscription.stateId === AdiPublisherSubscription.StateId.Subscribed) {
                subscription.stateId = AdiPublisherSubscription.StateId.Inactive;
                this._exerciseDataMessages.addOfflinedDataMessage(subscription, errorText);
                this.notifySubscriptionError(AdiPublisherSubscription.ErrorTypeId.Offlined);
            }
        }
        this._subscriptionByMessageMap.clear();
    }

    private offlineSendQueuedSubscriptions(queue: AdiPublisherSubscriptionManager.SendQueue, errorText: string) {
        const count = queue.count;
        for (let i = count - 1; i >= 0; i--) {
            const request = queue.getAt(i);
            const subscription = request.subscription;
            if (request.typeId === AdiPublisherRequest.TypeId.Unsubscribe) {
                this._subscriptionByDataItemIdMap.delete(subscription.dataItemId);
            } else {
                subscription.stateId = AdiPublisherSubscription.StateId.Inactive;
                this._exerciseDataMessages.addOfflinedDataMessage(subscription, errorText);
                this.notifySubscriptionError(AdiPublisherSubscription.ErrorTypeId.Offlined);
            }
        }
        queue.clear();
    }

    private offlineResponseWaitingSubscriptions(errorText: string) {
        const count = this._responseWaitList.count;
        for (let i = 0; i < count; i++) {
            const request = this._responseWaitList.getAt(i);
            const subscription = request.subscription;
            if (request.typeId === AdiPublisherRequest.TypeId.Unsubscribe) {
                this._subscriptionByDataItemIdMap.delete(subscription.dataItemId);
            } else {
                subscription.stateId = AdiPublisherSubscription.StateId.Inactive;
                this._exerciseDataMessages.addOfflinedDataMessage(subscription, errorText);
                this.notifySubscriptionError(AdiPublisherSubscription.ErrorTypeId.Offlined);
            }
        }
        this._responseWaitList.clear();
    }

    private offlineInactiveSubscriptions(subscriptions: AdiPublisherSubscription[], errorText: string) {
        // Even though these are not active, their DataItem state may still depend on whether publisher is online.
        // So an OfflinedDataMessage is sent
        const count = subscriptions.length;
        for (let i = count - 1; i >= 0; i--) {
            const subscription = subscriptions[i];
            this._exerciseDataMessages.addOfflinedDataMessage(subscription, errorText);
        }
    }

    private offlineSubscriptions(errorText: string) {
        // make room for offlining messages
        const subscriptionCount = this._subscriptionByDataItemIdMap.size;
        this._exerciseDataMessages.checkGrowCapacity(subscriptionCount);

        // save a list of all inactive subscriptions
        const inactiveSubscriptions = new Array<AdiPublisherSubscription>(subscriptionCount);
        let inactiveCount = 0;
        for (const [keyIgnored, subscription] of this._subscriptionByDataItemIdMap) {
            if (subscription.stateId === AdiPublisherSubscription.StateId.Inactive) {
                inactiveSubscriptions[inactiveCount++] = subscription;
            }
        }
        inactiveSubscriptions.length = inactiveCount;

        // Offline active subscriptions
        this.offlineSubscribedSubscriptions(errorText);
        this.offlineResponseWaitingSubscriptions(errorText);
        this.offlineSendQueuedSubscriptions(this._highPrioritySendQueue, errorText);
        this.offlineSendQueuedSubscriptions(this._normalSendQueue, errorText);

        // Offline inactive subscriptions
        this.offlineInactiveSubscriptions(inactiveSubscriptions, errorText);

        // subscriptions are now only included in this._subscriptionByDataItemIdMap and all have state Inactive
    }

    private sendOffliningMessages() {
        for (const [keyIgnored, subscription] of this._subscriptionByDataItemIdMap) {
            this._exerciseDataMessages.addOffliningDataMessage(subscription);
        }
    }

    private sendOnlinedMessages() {
        for (const [keyIgnored, subscription] of this._subscriptionByDataItemIdMap) {
            this._exerciseDataMessages.addOnlinedDataMessage(subscription);
        }
    }

    private processResponseWaitList(nowTickTime: SysTick.Time) {
        interface SubscriptionAndTimeout {
            subscription: AdiPublisherSubscription;
            timeoutSpan: number;
        }

        const waitListCount = this._responseWaitList.count;
        if (waitListCount > 0) {
            let count = waitListCount;
            for (let I = 0; I < waitListCount; I++) {
                const timeoutTime = this._responseWaitList.getAt(I).responseTimeoutTime;
                if (nowTickTime <= timeoutTime) {
                    count = I;
                    break;
                }
            }

            if (count > 0) {
                const deactivateAndMessageSubscriptions = new Array<SubscriptionAndTimeout>(count);
                let deactivateAndMessageCount = 0;
                for (let i = 0; i < count; i++) {
                    const request = this._responseWaitList.getAt(i);
                    const subscription = request.subscription;

                    const exists = this._subscriptionByDataItemIdMap.has(subscription.dataItemId);
                    if (!exists) {
                        window.motifLogger.log(Logger.LevelId.Warning, 'TPariSessSvc.ProcessResponseWaitList - Could not find subscription: '
                            + subscription.dataDefinition.description);
                    } else {
                        // assume Unsubscribe worked. Do not notify as error
                        if (request.typeId === AdiPublisherRequest.TypeId.Unsubscribe) {
                            throw new AssertInternalError('PSMPRWL1904687', subscription.dataDefinition.description);
                        } else {
                            const deactivateAndMessageSubscription: SubscriptionAndTimeout = {
                                subscription,
                                timeoutSpan: request.responseTimeoutSpan,
                            };
                            deactivateAndMessageSubscriptions[deactivateAndMessageCount++] = deactivateAndMessageSubscription;
                        }
                    }
                }

                deactivateAndMessageSubscriptions.length = deactivateAndMessageCount;

                this._responseWaitList.removeRange(0, count);

                // send unsubscribe (if sub) just in case request got through to server but no response
                for (let i = 0; i < deactivateAndMessageCount; i++) {
                    const deactivateAndMessageSubscription = deactivateAndMessageSubscriptions[i];
                    this.deactivateSubscription(deactivateAndMessageSubscription.subscription);
                }

                // Unsub requests for sub subscriptions are now in send queue.  Need to send these immediately so that subscription
                // can be put into Inactive state so that DataItem can re-activate it.

                this.tryCatchProcessSendQueues();

                // Subscriptions are now not in any list or queue
                // Mark them as inactive and sent timeout error message to DataItem
                for (let i = 0; i < deactivateAndMessageCount; i++) {
                    const deactivateAndMessageSubscription = deactivateAndMessageSubscriptions[i];
                    const subscription = deactivateAndMessageSubscription.subscription;
                    subscription.stateId = AdiPublisherSubscription.StateId.Inactive;
                    const timeoutSeconds = deactivateAndMessageSubscription.timeoutSpan / mSecsPerSec;
                    const errorText = `${timeoutSeconds.toFixed()} ${Strings[StringId.Seconds]}`;
                    this._exerciseDataMessages.addRequestTimeoutErrorDataMessage(subscription, errorText);
                    this.notifySubscriptionError(AdiPublisherSubscription.ErrorTypeId.RequestTimeout);
                }
            }
        }
    }

    private tryCatchProcessSendQueues() {
        const nowTickTime = SysTick.now();
        try {
            this.processSendQueues(nowTickTime);
        } catch (e) {
            this.purgeSubscriptionsWithInternalError(getErrorMessage(e));
            throw (e);
        }
    }

    private processSendQueues(nowTickTime: SysTick.Time) {
        if (this._online) {
            this.processSendQueue(nowTickTime, this._highPrioritySendQueue);
            this.processSendQueue(nowTickTime, this._normalSendQueue);
        }
    }

    private processSendQueue(nowTickTime: SysTick.Time, sendQueue: AdiPublisherSubscriptionManager.SendQueue) {
        const sendCount = sendQueue.getReadyCount(nowTickTime);
        if (sendCount > 0) {
            try {
                this.sendMessages(nowTickTime, sendQueue, sendCount);
            } catch (e) {
                sendQueue.clear();
                throw e;
            }
        }
    }

    private sendMessages(nowTickTime: SysTick.Time, sendQueue: AdiPublisherSubscriptionManager.SendQueue, count: number) {
        const newMinResponseWaitListCapacity = this._responseWaitList.count + count;
        if (this._responseWaitList.capacity < newMinResponseWaitListCapacity) {
            this._responseWaitList.capacity = newMinResponseWaitListCapacity;
        }

        try {
            this.sendPackets(nowTickTime, sendQueue, count);
        } finally {
            sendQueue.removeRange(0, count);
        }
    }

    private purgeSubscriptionsWithInternalError(errorText: string) {
        this._highPrioritySendQueue.clear();
        this._normalSendQueue.clear();
        this._responseWaitList.clear();
        this._subscriptionByMessageMap.clear();

        const count = this._subscriptionByDataItemIdMap.size;
        const subscriptions = new Array<AdiPublisherSubscription>(count);
        let idx = 0;
        for (const [dataItemIdIgnored, subscription] of this._subscriptionByDataItemIdMap) {
            subscriptions[idx++] = subscription;
        }

        // clear subscriptions before sending messages in case an(other) exception occurs
        this._subscriptionByDataItemIdMap.clear();

        for (const subscription of subscriptions) {
            this._exerciseDataMessages.addInternalErrorDataMessage(subscription, errorText);
            this.notifySubscriptionError(AdiPublisherSubscription.ErrorTypeId.Internal);
        }
    }

    protected abstract activateSubscription(subscription: AdiPublisherSubscription): void;
    protected abstract deactivateSubscription(subscription: AdiPublisherSubscription): void;

    protected abstract sendPackets(nowTickTime: SysTick.Time, SendQueue: AdiPublisherSubscriptionManager.SendQueue, Count: number): void;
}

export namespace AdiPublisherSubscriptionManager {
    const NeverRetryDelayIgnored = 200;
    const MinimumImmediateRetryBecameOnlineIntervalTimeSpanIgnored = 2 * secsPerMin * mSecsPerSec;

    export const enum NormalSendStateId {
        Blocked,
        Throttled,
        Ready
    }

    export type SubscriptionErrorEvent = (this: void, typeId: AdiPublisherSubscription.ErrorTypeId) => void;
    export type ServerWarningEvent = (this: void) => void;

    export namespace ErrorType {
        interface Info {
            readonly id: AdiPublisherSubscription.ErrorTypeId;
            readonly suspectBadnessReasonId: Badness.ReasonId;
            readonly errorBadnessReasonId: Badness.ReasonId;
        }

        type InfosObject = {[id in keyof typeof AdiPublisherSubscription.ErrorTypeId]: Info};
        const infosObject: InfosObject = {
            Internal: { id: AdiPublisherSubscription.ErrorTypeId.Internal,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_Internal_Error,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_Internal_Error,
            },
            InvalidRequest: { id: AdiPublisherSubscription.ErrorTypeId.InvalidRequest,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_InvalidRequest_Error,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_InvalidRequest_Error,
            },
            Offlined: { id: AdiPublisherSubscription.ErrorTypeId.Offlined,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_Offlined_Suspect,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_Offlined_Error,
            },
            RequestTimeout: { id: AdiPublisherSubscription.ErrorTypeId.RequestTimeout,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_RequestTimeout_Suspect,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_RequestTimeout_Error,
            },
            SubscriptionError: { id: AdiPublisherSubscription.ErrorTypeId.SubscriptionError,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_SubscriptionError_Error,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_SubscriptionError_Error,
            },
            PublishRequestError: { id: AdiPublisherSubscription.ErrorTypeId.PublishRequestError,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_PublishRequestError_Suspect,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_PublishRequestError_Error,
            },
            SubscriptionWarning: { id: AdiPublisherSubscription.ErrorTypeId.SubscriptionWarning,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_SubscriptionWarning_Suspect,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_SubscriptionWarning_Suspect,
            },
            DataNotAvailable: { id: AdiPublisherSubscription.ErrorTypeId.DataNotAvailable,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_DataNotAvailable_Error,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_DataNotAvailable_Error,
            },
            DataError: { id: AdiPublisherSubscription.ErrorTypeId.DataError,
                suspectBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_DataError_Suspect,
                errorBadnessReasonId: Badness.ReasonId.PublisherSubscriptionError_DataError_Error,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info, idx) => info.id !== idx as AdiPublisherSubscription.ErrorTypeId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('PublisherSubscription.ErrorTypeId', outOfOrderIdx, outOfOrderIdx.toString());
            }
        }

        export function idToSuspectBadnessReasonId(id: AdiPublisherSubscription.ErrorTypeId) {
            return infos[id].suspectBadnessReasonId;
        }

        export function idToErrorBadnessReasonId(id: AdiPublisherSubscription.ErrorTypeId) {
            return infos[id].errorBadnessReasonId;
        }
    }

    export class ExerciseDataMessageList extends DataMessages {
        checkGrowCapacity(growSize: Integer) {
            const minCapacity = this.count + growSize;
            if (this.capacity < minCapacity) {
                this.capacity = minCapacity;
            }
        }

        addOnlinedDataMessage(subscription: AdiPublisherSubscription) {
            const msg = new OnlinedPublisherSubscriptionDataMessage(subscription.dataItemId);
            this.add(msg);
        }

        addOfflinedDataMessage(subscription: AdiPublisherSubscription, errorText: string) {
            const msg = new ErrorPublisherSubscriptionDataMessage_Offlined(subscription.dataItemId, errorText,
                subscription.beenSentAtLeastOnce);
            this.add(msg);
        }

        addOffliningDataMessage(subscription: AdiPublisherSubscription) {
            const msg = new OffliningPublisherSubscriptionDataMessage(subscription.dataItemId);
            this.add(msg);
        }

        addRequestTimeoutErrorDataMessage(subscription: AdiPublisherSubscription, errorText: string) {
            const msg = new ErrorPublisherSubscriptionDataMessage_RequestTimeout(subscription.dataItemId, subscription.dataItemRequestNr,
                errorText);
            this.add(msg);
        }

        addInternalErrorDataMessage(subscription: AdiPublisherSubscription, errorText: string) {
            const msg = new ErrorPublisherSubscriptionDataMessage_Internal(subscription.dataItemId, errorText);
            this.add(msg);
        }
    }

    export class SendQueue extends ComparableList<AdiPublisherRequest> {
        batchingActive = false;

        private _throttleTypeId = SendQueue.ThrottleTypeId.Normal;
        private _normalThrottleSendTickSpan: SysTick.Span = 500; // milliseconds
        private _normalThrottleSendCount = 100;
        private _normalThrottleEarliestNextSendTime: SysTick.Time = 0;

        constructor(private _priority: PublisherSubscriptionDataDefinition.RequestSendPriorityId) {
            super();

            switch (this.priority) {
                case PublisherSubscriptionDataDefinition.RequestSendPriorityId.High:
                    this._throttleTypeId = SendQueue.ThrottleTypeId.None;
                    break;
                case PublisherSubscriptionDataDefinition.RequestSendPriorityId.Normal:
                    this._throttleTypeId = SendQueue.ThrottleTypeId.Normal;
                    break;
                default:
                    throw new UnreachableCaseError('FSRESQCP292929555', this.priority);
            }
        }

        get priority() { return this._priority; }

        getReadyCount(nowTickTime: SysTick.Time) {
            if (this.batchingActive) {
                return 0;
            } else {
                switch (this._throttleTypeId) {
                    case SendQueue.ThrottleTypeId.None:
                        return this.count;
                    case SendQueue.ThrottleTypeId.Normal:
                        if (nowTickTime < this._normalThrottleEarliestNextSendTime) {
                            return 0;
                        } else {
                            const count = this.count;
                            if (count <= this._normalThrottleSendCount) {
                                return count;
                            } else {
                                this._normalThrottleEarliestNextSendTime = this.calculateNormalThrottleEarliestNextSendTime();
                                return this._normalThrottleSendCount;
                            }
                        }
                    default:
                        throw new UnreachableCaseError('FSRESQGRCU987233688', this._throttleTypeId);
                }
            }
        }

        indexOfSubscription(subscription: AdiPublisherSubscription) {
            for (let i = 0; i < this.count; i++) {
                if (this.getAt(i).subscription === subscription) {
                    return i;
                }
            }
            return -1;
        }

        removeSubscription(subscription: AdiPublisherSubscription) {
            const idx = this.indexOfSubscription(subscription);
            if (idx >= 0) {
                this.removeAtIndex(idx);
            } else {
                throw new AssertInternalError('FSRESQRS199953338', subscription.dataDefinition.description);
            }
        }

        private calculateNormalThrottleEarliestNextSendTime() {
            return SysTick.now() + this._normalThrottleSendTickSpan;
        }
    }

    export namespace SendQueue {
        export const enum ThrottleTypeId {
            None,
            Normal,
        }
    }

    export class WaitList extends ComparableList<AdiPublisherRequest> {

        indexOfSubscription(subscription: AdiPublisherSubscription) {
            for (let i = 0; i < this.count; i++) {
                if (this.getAt(i).subscription === subscription) {
                    return i;
                }
            }
            return -1;
        }

        removeSubscription(subscription: AdiPublisherSubscription) {
            const idx = this.indexOfSubscription(subscription);
            if (idx >= 0) {
                this.removeAtIndex(idx);
            } else {
                throw new AssertInternalError('FSREWLRS999482222', subscription.dataDefinition.description);
            }
        }

        override add(request: AdiPublisherRequest): number {
            if (this.count === 0) {
                return super.add(request);
            } else {
                const lastResponseTimeoutTime = this.getAt(this.count - 1).responseTimeoutTime;
                if (request.responseTimeoutTime >= lastResponseTimeoutTime) {
                    super.insert(this.count, request);
                    return this.count;
                } else {
                    const searchResult = super.binarySearchEarliest(request);
                    let index = searchResult.index;
                    if (searchResult.found) {
                        index++;
                        while ((index < this.count) && (this.getAt(index).responseTimeoutTime === request.responseTimeoutTime)) {
                            index++;
                        }
                    }
                    super.insert(index, request);
                    return index;
                }
            }
        }
    }
}

export namespace AdiPublisherSubscriptionManagerModule {
    export function initialiseStatic() {
        AdiPublisherSubscriptionManager.ErrorType.initialise();
    }
}
