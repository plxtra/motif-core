import { RecordList } from '@pbkware/js-utils';
import { RevSourcedFieldCustomHeadings } from 'revgrid';
import { TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory } from '../../field-source/internal-api';
import { TableRecordSourceDefinition } from './table-record-source-definition';

/** @public */
export abstract class RecordListTableRecordSourceDefinition<T> extends TableRecordSourceDefinition {
    constructor(
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        typeId: TableRecordSourceDefinition.TypeId,
        allowedFieldSourceDefinitionTypeIds: TableFieldSourceDefinition.TypeId[],
        readonly list: RecordList<T>,
    ) {
        super(
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            typeId,
            allowedFieldSourceDefinitionTypeIds,
        );
    }

    // no override for saveToJson()

}
