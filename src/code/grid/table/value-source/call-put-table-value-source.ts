import { Integer, UnreachableCaseError } from '@xilytix/sysutils';
import { CallPut } from '../../../services/internal-api';
import { CallPutTableFieldSourceDefinition } from '../field-source/definition/internal-api';
import {
    BooleanTableValue,
    DataIvemIdTableValue,
    DateTableValue,
    DecimalTableValue,
    EnumTableValue,
    IvemIdTableValue,
    PriceTableValue,
    StringTableValue,
    TableValue
} from '../value/internal-api';
import { TableValueSource } from './table-value-source';

export class CallPutTableValueSource extends TableValueSource {
    constructor(firstFieldIndexOffset: Integer, private _callPut: CallPut) {
        super(firstFieldIndexOffset);
    }

    activate(): TableValue[] {
        return this.getAllValues();
    }

    deactivate() {
        // nothing to do
    }

    getAllValues(): TableValue[] {
        const fieldCount = CallPutTableFieldSourceDefinition.Field.count;
        const result = new Array<TableValue>(fieldCount);

        for (let fieldIdx = 0; fieldIdx < fieldCount; fieldIdx++) {
            const value = this.createTableValue(fieldIdx);
            const fieldId = CallPutTableFieldSourceDefinition.Field.getId(fieldIdx);
            this.loadValue(fieldId, value);
            result[fieldIdx] = value;
        }

        return result;
    }

    protected getfieldCount(): Integer {
        return CallPutTableFieldSourceDefinition.Field.count;
    }

    private createTableValue(fieldIdx: Integer) {
        const valueConstructor = CallPutTableFieldSourceDefinition.Field.getTableValueConstructor(fieldIdx);
        return new valueConstructor();
    }

    private loadValue(id: CallPut.FieldId, value: TableValue) {
        switch (id) {
            case CallPut.FieldId.ExercisePrice:
                (value as PriceTableValue).data = this._callPut.exercisePrice;
                break;
            case CallPut.FieldId.ExpiryDate:
                (value as DateTableValue).data = this._callPut.expiryDate.utcMidnight;
                break;
            case CallPut.FieldId.Market:
                (value as StringTableValue).data = this._callPut.market.display;
                break;
            case CallPut.FieldId.CallDataIvemId:
                (value as DataIvemIdTableValue).data = this._callPut.callDataIvemId;
                break;
            case CallPut.FieldId.PutDataIvemId:
                (value as DataIvemIdTableValue).data = this._callPut.putDataIvemId;
                break;
            case CallPut.FieldId.ContractMultiplier:
                (value as DecimalTableValue).data = this._callPut.contractMultiplier;
                break;
            case CallPut.FieldId.ExerciseTypeId:
                (value as EnumTableValue).data = this._callPut.exerciseTypeId;
                break;
            case CallPut.FieldId.UnderlyingIvemId:
                (value as IvemIdTableValue).data = this._callPut.underlyingIvemId;
                break;
            case CallPut.FieldId.UnderlyingIsIndex:
                (value as BooleanTableValue).data = this._callPut.underlyingIsIndex;
                break;
            default:
                throw new UnreachableCaseError('HTVSTVSLV8851', id);
        }
    }
}
