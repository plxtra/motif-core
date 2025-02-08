import { DataIvemId, MarketIvemId } from '../../../adi/internal-api';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { TableRecordDefinition } from './table-record-definition';

export interface DataIvemIdTableRecordDefinition extends TableRecordDefinition {
    readonly typeId: TableFieldSourceDefinition.TypeId.DataIvemId;
    readonly dataIvemId: DataIvemId;
}

export namespace DataIvemIdTableRecordDefinition {
    export function createMapKey(dataIvemId: DataIvemId) {
        return MarketIvemId.createMapKey(dataIvemId);
    }
}
