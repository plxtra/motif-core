import { CallPut } from '../../../services';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { TableRecordDefinition } from './table-record-definition';

export interface CallPutTableRecordDefinition extends TableRecordDefinition {
    readonly typeId: TableFieldSourceDefinition.TypeId.CallPut;
    readonly record: CallPut;
}

export namespace CallPutTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is CallPutTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.CallPut;
    }
}

