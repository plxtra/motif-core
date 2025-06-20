import { MultiEvent } from '@pbkware/js-utils';
import { Correctness, CorrectnessRecord } from '../../../sys';
import { TableValue } from '../value/internal-api';
import { TableValueSource } from './table-value-source';

// eslint-disable-next-line @typescript-eslint/no-unnecessary-type-parameters
export abstract class CorrectnessTableValueSource<Record extends CorrectnessRecord> extends TableValueSource {
    private _recordCorrectnessChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    activate() {
        const record = this.getRecord();
        this._recordCorrectnessChangedEventSubscriptionId = record.subscribeCorrectnessChangedEvent(
            () => { this.handleRecordCorrectnessChangedEvent(); }
        );

        const correctnessId = record.correctnessId;
        const incubated = Correctness.idIsIncubated(correctnessId);
        this.initialiseBeenIncubated(incubated);

        return this.getAllValues();
    }

    deactivate() {
        const record = this.getRecord();
        record.unsubscribeCorrectnessChangedEvent(this._recordCorrectnessChangedEventSubscriptionId);
        this._recordCorrectnessChangedEventSubscriptionId = undefined;
    }

    private handleRecordCorrectnessChangedEvent() {
        const allValues = this.getAllValues();
        const correctnessId = this.getRecord().correctnessId;
        const incubated = Correctness.idIsIncubated(correctnessId);
        this.processDataCorrectnessChanged(allValues, incubated);
    }

    abstract override getAllValues(): TableValue[];
    protected abstract getRecord(): Record;
}
