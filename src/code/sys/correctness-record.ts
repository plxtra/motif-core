import { MultiEvent } from '@xilytix/sysutils';
import { CorrectnessId } from './correctness';

export interface CorrectnessRecord {
    readonly correctnessId: CorrectnessId;

    subscribeCorrectnessChangedEvent(handler: CorrectnessRecord.CorrectnessChangedEventHandler): MultiEvent.DefinedSubscriptionId;
    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void;
}

export namespace CorrectnessRecord {
    export type CorrectnessChangedEventHandler = (this: void) => void;
}
