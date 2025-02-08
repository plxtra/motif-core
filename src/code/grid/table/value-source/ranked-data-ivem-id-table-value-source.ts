import { RankedDataIvemId } from '../../../adi/internal-api';
import { Integer, MultiEvent, UnreachableCaseError } from '../../../sys/internal-api';
import { RankedDataIvemIdTableFieldSourceDefinition } from '../field-source/definition/internal-api';
import { CorrectnessTableValue, DataIvemIdCorrectnessTableValue, IntegerCorrectnessTableValue, NumberCorrectnessTableValue, TableValue } from '../value/internal-api';
import { CorrectnessTableValueSource } from './correctness-table-value-source';
import { TableValueSource } from './table-value-source';

export class RankedDataIvemIdTableValueSource extends CorrectnessTableValueSource<RankedDataIvemId> {
    private _rankedDataIvemIdChangedSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        firstFieldIndexOffset: Integer,
        private readonly _rankedDataIvemId: RankedDataIvemId,
    ) {
        super(firstFieldIndexOffset);
    }

    override activate(): TableValue[] {
        this._rankedDataIvemIdChangedSubscriptionId = this._rankedDataIvemId.subscribeChangedEvent(
            (valueChanges) => { this.handleRankedDataIvemIdChangedEvent(valueChanges); }
        );

        return super.activate();
    }

    override deactivate() {
        this._rankedDataIvemId.unsubscribeChangedEvent(this._rankedDataIvemIdChangedSubscriptionId);
        this._rankedDataIvemIdChangedSubscriptionId = undefined;

        super.deactivate();
    }

    getAllValues(): TableValue[] {
        const fieldCount = RankedDataIvemIdTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = RankedDataIvemIdTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getRecord() {
        return this._rankedDataIvemId;
    }

    protected getfieldCount(): Integer {
        return RankedDataIvemIdTableFieldSourceDefinition.Field.count;
    }

    private handleRankedDataIvemIdChangedEvent(rankedDataIvemIdValueChanges: RankedDataIvemId.ValueChange[]) {
        const changedFieldCount = rankedDataIvemIdValueChanges.length;
        const valueChanges = new Array<TableValueSource.ValueChange>(changedFieldCount);
        let foundCount = 0;
        for (let i = 0; i < rankedDataIvemIdValueChanges.length; i++) {
            const { fieldId, recentChangeTypeId } = rankedDataIvemIdValueChanges[i];
            const fieldIndex = RankedDataIvemIdTableFieldSourceDefinition.Field.indexOfId(fieldId);
            if (fieldIndex >= 0) {
                const newValue = this.createTableValue(fieldIndex);
                this.loadValue(fieldId, newValue);
                valueChanges[foundCount++] = { fieldIndex, newValue, recentChangeTypeId };
            }
        }
        if (foundCount < changedFieldCount) {
            valueChanges.length = foundCount;
        }
        this.notifyValueChangesEvent(valueChanges);
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = RankedDataIvemIdTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: RankedDataIvemId.FieldId, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this._rankedDataIvemId.correctnessId;

        switch (id) {
            case RankedDataIvemId.FieldId.DataIvemId:
                (value as DataIvemIdCorrectnessTableValue).data = this._rankedDataIvemId.dataIvemId;
                break;
            case RankedDataIvemId.FieldId.Rank:
                (value as IntegerCorrectnessTableValue).data = this._rankedDataIvemId.rank;
                break;
            case RankedDataIvemId.FieldId.RankScore:
                (value as NumberCorrectnessTableValue).data = this._rankedDataIvemId.rankScore;
                break;
            default:
                throw new UnreachableCaseError('RLIITVSLV12473', id);
        }
    }
}
