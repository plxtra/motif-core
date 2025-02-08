import { RankedDataIvemIdListDirectoryItem } from '../../../services/internal-api';
import { TableFieldSourceDefinition } from '../field-source/internal-api';
import { PayloadTableRecordDefinition } from './payload-table-record-definition';
import { TableRecordDefinition } from './table-record-definition';

export interface RankedDataIvemIdListDirectoryItemTableRecordDefinition extends PayloadTableRecordDefinition<RankedDataIvemIdListDirectoryItem> {
    readonly typeId: TableFieldSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem;
}

export namespace RankedDataIvemIdListDirectoryItemTableRecordDefinition {
    export function is(definition: TableRecordDefinition): definition is RankedDataIvemIdListDirectoryItemTableRecordDefinition {
        return definition.typeId === TableFieldSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem;
    }
}
