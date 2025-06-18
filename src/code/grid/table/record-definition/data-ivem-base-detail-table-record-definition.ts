import { DataIvemBaseDetail } from '../../../adi';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { TableRecordDefinition } from './table-record-definition';

export interface DataIvemBaseDetailTableRecordDefinition extends TableRecordDefinition {
    readonly typeId: TableFieldSourceDefinition.TypeId.DataIvemBaseDetail;
    dataIvemBaseDetail: DataIvemBaseDetail;
}

export namespace DataIvemBaseDetailTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is DataIvemBaseDetailTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.DataIvemBaseDetail;
    }
}
