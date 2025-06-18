import { PickEnum } from '@pbkware/js-utils';
import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from 'revgrid';
import { RankedDataIvemIdListDirectory } from '../../../../ranked-lit-ivem-id-list';
import { RankedDataIvemIdListDirectoryItem } from '../../../../services';
import {
    RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactory,
} from '../../field-source/internal-api';
import { TableRecordSourceDefinition } from './table-record-source-definition';

/** @public */
export class RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition extends TableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        readonly listDirectory: RankedDataIvemIdListDirectory,
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            TableRecordSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem,
            RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );
    }

    override createDefaultLayoutDefinition() {
        const rankedDataIvemIdListDirectoryItemFieldSourceDefinition = RankedDataIvemIdListDirectoryItemTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        const fieldNames = new Array<string>();

        fieldNames.push(rankedDataIvemIdListDirectoryItemFieldSourceDefinition.getSupportedFieldNameById(RankedDataIvemIdListDirectoryItem.FieldId.Name));
        fieldNames.push(rankedDataIvemIdListDirectoryItemFieldSourceDefinition.getSupportedFieldNameById(RankedDataIvemIdListDirectoryItem.FieldId.TypeId));

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }
}

/** @public */
export namespace RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem,
    ];

    export const defaultFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem,
    ];
}
