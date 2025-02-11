import { SysTick } from '@xilytix/sysutils';
import { AdiPublisherSubscription } from './adi-publisher-subscription';

export interface AdiPublisherRequest {
    readonly typeId: AdiPublisherRequest.TypeId;
    readonly subscription: AdiPublisherSubscription;
    responseTimeoutSpan: SysTick.Span;
    responseTimeoutTime: SysTick.Time;
}

export namespace AdiPublisherRequest {
    export const enum TypeId {
        SubscribeQuery,
        Unsubscribe
    }

    const invalidTransactionId = 0;
    let nextTransactionId = invalidTransactionId + 1;

    export function getNextTransactionId() {
        return nextTransactionId++;
    }

    export function compareResponseTimeoutTime(left: AdiPublisherRequest, right: AdiPublisherRequest) {
        return SysTick.compare(left.responseTimeoutTime, right.responseTimeoutTime);
    }
}
