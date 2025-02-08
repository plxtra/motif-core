import { GridField } from '../../field/internal-api';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { PayloadTableRecordDefinition } from './payload-table-record-definition';
import { TableRecordDefinition } from './table-record-definition';

export interface GridFieldTableRecordDefinition extends PayloadTableRecordDefinition<GridField> {
    readonly typeId: TableFieldSourceDefinition.TypeId.GridField;
}

export namespace GridFieldTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is GridFieldTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.GridField;
    }
}
