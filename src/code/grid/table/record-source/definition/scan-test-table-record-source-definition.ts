import { RevColumnLayoutDefinition, RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { DataIvemBaseDetail, RankedDataIvemId } from '../../../../adi/internal-api';
import { DataIvemIdExecuteScanRankedDataIvemIdListDefinition } from '../../../../ranked-lit-ivem-id-list/internal-api';
import {
    DataIvemBaseDetailTableFieldSourceDefinition,
    RankedDataIvemIdTableFieldSourceDefinition,
    TableFieldSourceDefinition,
    TableFieldSourceDefinitionCachingFactory,
} from '../../field-source/internal-api';
import { RankedDataIvemIdListTableRecordSourceDefinition } from './ranked-data-ivem-id-list-table-record-source-definition';

/** @public */
export class ScanTestTableRecordSourceDefinition extends RankedDataIvemIdListTableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        rankedDataIvemIdListDefinition: DataIvemIdExecuteScanRankedDataIvemIdListDefinition,
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            ScanTestTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
            rankedDataIvemIdListDefinition,
        );
    }

    override get defaultFieldSourceDefinitionTypeIds() { return ScanTestTableRecordSourceDefinition.defaultFieldSourceDefinitionTypeIds; }

    override createDefaultLayoutDefinition(): RevColumnLayoutDefinition {
        const rankedDataIvemIdFieldSourceDefinition = RankedDataIvemIdTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);
        const dataIvemBaseDetailFieldSourceDefinition = DataIvemBaseDetailTableFieldSourceDefinition.get(this.tableFieldSourceDefinitionCachingFactory);

        const fieldNames = new Array<string>();

        fieldNames.push(rankedDataIvemIdFieldSourceDefinition.getFieldNameById(RankedDataIvemId.FieldId.DataIvemId));
        fieldNames.push(dataIvemBaseDetailFieldSourceDefinition.getFieldNameById(DataIvemBaseDetail.Field.Id.Name));
        fieldNames.push(rankedDataIvemIdFieldSourceDefinition.getFieldNameById(RankedDataIvemId.FieldId.RankScore));
        fieldNames.push(rankedDataIvemIdFieldSourceDefinition.getFieldNameById(RankedDataIvemId.FieldId.Rank));

        return RevColumnLayoutDefinition.createFromFieldNames(fieldNames);
    }
}

/** @public */
export namespace ScanTestTableRecordSourceDefinition {
    export const allowedFieldSourceDefinitionTypeIds: RankedDataIvemIdListTableRecordSourceDefinition.FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail,
        TableFieldSourceDefinition.TypeId.RankedDataIvemId,
    ];

    export const defaultFieldSourceDefinitionTypeIds: RankedDataIvemIdListTableRecordSourceDefinition.FieldSourceDefinitionTypeId[] = [
        TableFieldSourceDefinition.TypeId.DataIvemBaseDetail,
        TableFieldSourceDefinition.TypeId.RankedDataIvemId,
    ];
}
