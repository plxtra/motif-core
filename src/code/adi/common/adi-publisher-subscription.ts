import { CommaText, Integer, MapKey, UnreachableCaseError } from '@pbkware/js-utils';
import { PublisherSubscriptionDataDefinition } from './data-definition';

export interface AdiPublisherSubscription {
    stateId: AdiPublisherSubscription.StateId;

    readonly dataItemId: number;
    readonly dataDefinition: PublisherSubscriptionDataDefinition;
    dataItemRequestNr: number;

    // Safeguard to ensure some subscriptions are only sent once
    readonly resendAllowed: boolean;

    activeMessageMapKey: MapKey | undefined;
    beenSentAtLeastOnce: boolean; // used in conjunction with resendAllowed Safeguard to prevent resend of some subscriptions
    unsubscribeRequired: boolean;
    errorWarningCount: Integer; // If errors received prior to final response in a publish request, then at least a partial error occurred.  (In most cases return an error to DataItem)
    errorsWarnings: string[] | undefined;
    delayRetryAllowedSpecified: boolean;
    limitedSpecified: boolean;
}

export namespace AdiPublisherSubscription {
    export const enum StateId {
        Inactive,
        HighPrioritySendQueued,
        NormalSendQueued,
        ResponseWaiting,
        Subscribed, // Response received. More responses might be received yet.
    }

    export namespace State {
        export function idIsSendQueued(id: StateId) {
            switch (id) {
                case StateId.HighPrioritySendQueued:
                case StateId.NormalSendQueued:
                    return true;
                case StateId.Inactive:
                case StateId.ResponseWaiting:
                case StateId.Subscribed:
                    return false;
                default:
                    throw new UnreachableCaseError('FSSSIISQ100048454', id);
            }
        }
        export function idIsRequestSent(id: StateId) {
            switch (id) {
                case StateId.Inactive:
                case StateId.HighPrioritySendQueued:
                case StateId.NormalSendQueued:
                    return false;
                case StateId.ResponseWaiting:
                case StateId.Subscribed:
                    return true;
                default:
                    throw new UnreachableCaseError('FSSSIISQ100048454', id);
            }
        }
    }

    export const enum AllowedRetryTypeId {
        Never,
        Delay,
        SubscribabilityIncrease,
    }

    export const enum ErrorTypeId {
        Internal,
        InvalidRequest,
        Offlined,
        RequestTimeout,
        UserNotAuthorised,
        SubscriptionError,
        PublishRequestError,
        SubscriptionWarning,
        DataError,
    }

    export function generatePublishErrorText(subscription: AdiPublisherSubscription) {
        const errorsWarnings = subscription.errorsWarnings;
        if (errorsWarnings !== undefined) {
            return CommaText.fromStringArray(errorsWarnings);
        } else {
            const errorCount = subscription.errorWarningCount;
            switch (errorCount) {
                case 0: return 'No server reported errors';
                case 1: return '1 server reported error';
                default: return `${errorCount} server reported errors`;
            }
        }
    }

    export function generateAllowedRetryTypeId(subscription: AdiPublisherSubscription) {
        return subscription.delayRetryAllowedSpecified ? AdiPublisherSubscription.AllowedRetryTypeId.Delay : AdiPublisherSubscription.AllowedRetryTypeId.Never;
    }
}
