import { RevRecordValueRecentChangeTypeId } from '@xilytix/revgrid';
import { RankedDataIvemIdListDirectoryItem } from '../../../services/internal-api';
import { Integer, MultiEvent, UnreachableCaseError } from '../../../sys/internal-api';
import { RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition } from '../field-source/internal-api';
import { CorrectnessTableValue, RankedDataIvemIdListDirectoryItemTypeIdCorrectnessTableValue, ReadonlyCorrectnessTableValue, StringCorrectnessTableValue, TableValue } from '../value/internal-api';
import { CorrectnessTableValueSource } from './correctness-table-value-source';
import { TableValueSource } from './table-value-source';

export class RankedDataIvemIdListDirectoryItemTableValueSource extends CorrectnessTableValueSource<RankedDataIvemIdListDirectoryItem> {
    private _directoryItemChangedSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        firstFieldIndexOffset: Integer,
        private readonly _directoryItem: RankedDataIvemIdListDirectoryItem,
    ) {
        super(firstFieldIndexOffset);
    }

    override activate(): TableValue[] {
        this._directoryItemChangedSubscriptionId = this._directoryItem.subscribeDirectoryItemChangedEvent(
            (changedFieldId) => { this.handleDirectoryItemChangedEvent(changedFieldId); }
        );

        return super.activate();
    }

    override deactivate() {
        this._directoryItem.unsubscribeDirectoryItemChangedEvent(this._directoryItemChangedSubscriptionId);
        this._directoryItemChangedSubscriptionId = undefined;

        super.deactivate();
    }

    getAllValues(): TableValue[] {
        const fieldCount = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getRecord() {
        return this._directoryItem;
    }

    protected getfieldCount(): Integer {
        return RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.count;
    }

    private handleDirectoryItemChangedEvent(changeValueFieldIds: RankedDataIvemIdListDirectoryItem.FieldId[]) {
        const changeValueFieldIdCount = changeValueFieldIds.length;
        const valueChanges = new Array<TableValueSource.ValueChange>(changeValueFieldIdCount);
        let foundCount = 0;
        for (let i = 0; i < changeValueFieldIdCount; i++) {
            const fieldId = changeValueFieldIds[i];
            const fieldIndex = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.indexOfId(fieldId);
            if (fieldIndex >= 0) {
                const newValue = this.createTableValue(fieldIndex);
                this.loadValue(fieldId, newValue);
                valueChanges[foundCount++] = { fieldIndex, newValue, recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update };
            }
        }
        if (foundCount < changeValueFieldIdCount) {
            valueChanges.length = foundCount;
        }
    }

    private createTableValue(fieldIndex: Integer) {
        const constructor = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIndex);
        return new constructor();
    }

    private loadValue(id: RankedDataIvemIdListDirectoryItem.FieldId, value: CorrectnessTableValue) {
        value.dataCorrectnessId = this._directoryItem.correctnessId;

        switch (id) {
            case RankedDataIvemIdListDirectoryItem.FieldId.TypeId:
                (value as RankedDataIvemIdListDirectoryItemTypeIdCorrectnessTableValue).data = this._directoryItem.directoryItemTypeId;
                break;
            case RankedDataIvemIdListDirectoryItem.FieldId.Id:
                (value as StringCorrectnessTableValue).data = this._directoryItem.id;
                break;
            case RankedDataIvemIdListDirectoryItem.FieldId.Readonly:
                (value as ReadonlyCorrectnessTableValue).data = this._directoryItem.readonly;
                break;
            case RankedDataIvemIdListDirectoryItem.FieldId.Name:
                (value as StringCorrectnessTableValue).data = this._directoryItem.name;
                break;
            case RankedDataIvemIdListDirectoryItem.FieldId.Description:
                (value as StringCorrectnessTableValue).data = this._directoryItem.description;
                break;
            default:
                throw new UnreachableCaseError('RLIILDITVSLV22272', id);
        }
    }
}
