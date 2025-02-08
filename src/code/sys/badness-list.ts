import { MultiEvent } from '@xilytix/sysutils';
import { Badness } from './badness';
import { UsableList } from './usable-list';

export interface BadnessList<Record> extends UsableList<Record> {
    readonly badness: Badness;

    subscribeBadnessChangedEvent(handler: BadnessList.badnessChangedEventHandler): MultiEvent.DefinedSubscriptionId;
    unsubscribeBadnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void;
}

export namespace BadnessList {
    export type badnessChangedEventHandler = (this: void) => void;
}
