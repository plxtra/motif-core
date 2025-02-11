import { Integer, UnreachableCaseError } from '@xilytix/sysutils';
import { DataIvemId, MarketIvemId } from '../../../adi/internal-api';
import { DataIvemIdTableFieldSourceDefinition } from '../field-source/definition/internal-api';
import { DataIvemIdTableValue, StringTableValue, TableValue } from '../value/internal-api';
import { TableValueSource } from './table-value-source';

export class DataIvemIdTableValueSource extends TableValueSource {
    constructor(
        firstFieldIndexOffset: Integer,
        private readonly _dataIvemId: DataIvemId,
    ) {
        super(firstFieldIndexOffset);
    }

    override activate(): TableValue[] {
        this.initialiseBeenIncubated(true);
        return this.getAllValues();
    }

    override deactivate() {
        // nothing to do
    }

    getAllValues(): TableValue[] {
        const fieldCount = DataIvemIdTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = DataIvemIdTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getRecord() {
        return this._dataIvemId;
    }

    protected getfieldCount(): Integer {
        return DataIvemIdTableFieldSourceDefinition.Field.count;
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = DataIvemIdTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: MarketIvemId.FieldId, value: TableValue) {
        switch (id) {
            case MarketIvemId.FieldId.DataIvemId:
                (value as DataIvemIdTableValue).data = this._dataIvemId;
                break;
            case MarketIvemId.FieldId.Code:
                (value as StringTableValue).data = this._dataIvemId.code;
                break;
            case MarketIvemId.FieldId.Market:
                (value as StringTableValue).data = this._dataIvemId.market.display;
                break;
            case MarketIvemId.FieldId.Environment:
                (value as StringTableValue).data = this._dataIvemId.market.exchangeEnvironment.display;
                break;
            default:
                throw new UnreachableCaseError('LIITVSLV12473', id);
        }
    }
}
