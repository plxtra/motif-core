// import { MultiEvent } from './multi-event';
import { RecordList } from '@pbkware/js-utils';

export interface UsableList<Record> extends RecordList<Record> {
    readonly usable: boolean;

    // subscribeUsableChangedEvent(handler: UsableList.UsableChangedEventHandler): MultiEvent.DefinedSubscriptionId;
    // unsubscribeUsableChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void;
}

// export namespace UsableList {
//     export type UsableChangedEventHandler = (this: void) => void;
// }
