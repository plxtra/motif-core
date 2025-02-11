import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { PickEnum } from '@xilytix/sysutils';
import { RankedDataIvemId } from '../../../../adi/internal-api';
import { UsableList } from '../../../../sys/internal-api';
import { TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory } from '../../field-source/internal-api';
import { TableRecordSourceDefinition } from './table-record-source-definition';
import { UsableListTableRecordSourceDefinition } from './usable-list-table-record-source-definition';

/** @public */
export abstract class RankedDataIvemIdUsableListTableRecordSourceDefinition extends UsableListTableRecordSourceDefinition<RankedDataIvemId> {
    // eslint-disable-next-line @typescript-eslint/no-useless-constructor
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        typeId: TableRecordSourceDefinition.TypeId,
        allowedFieldSourceDefinitionTypeIds: RankedDataIvemIdUsableListTableRecordSourceDefinition.FieldSourceDefinitionTypeId[],
        list: UsableList<RankedDataIvemId>,
    ) {
        super(customHeadings, tableFieldSourceDefinitionCachingFactory, typeId, allowedFieldSourceDefinitionTypeIds, list);
    }

    abstract get defaultFieldSourceDefinitionTypeIds(): RankedDataIvemIdUsableListTableRecordSourceDefinition.FieldSourceDefinitionTypeId[];
}


/** @public */
export namespace RankedDataIvemIdUsableListTableRecordSourceDefinition {
    export type FieldSourceDefinitionTypeId = PickEnum<TableFieldSourceDefinition.TypeId,
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail |
        TableFieldSourceDefinition.TypeId.RankedDataIvemId |
        TableFieldSourceDefinition.TypeId.SecurityDataItem
    >;

    export const allowedFieldSourceDefinitionTypeIds: FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail,
        TableFieldSourceDefinition.TypeId.RankedDataIvemId,
        TableFieldSourceDefinition.TypeId.SecurityDataItem
    ];
}
