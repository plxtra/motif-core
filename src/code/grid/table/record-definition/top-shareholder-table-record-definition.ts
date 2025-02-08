import { TopShareholder } from '../../../adi/internal-api';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { TableRecordDefinition } from './table-record-definition';

export interface TopShareholderTableRecordDefinition extends TableRecordDefinition {
    readonly typeId: TableFieldSourceDefinition.TypeId.TopShareholder;
    readonly record: TopShareholder;
}

export namespace TopShareholderTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is TopShareholderTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.TopShareholder;
    }
}
