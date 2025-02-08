import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { LockOpenListItem, RecordList } from '@xilytix/sysutils';
import { TextFormatter } from '../../../services/internal-api';
import { TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory } from '../field-source/internal-api';
import { RecordListTableRecordSourceDefinition } from './definition/internal-api';
import { SubscribeRecordListTableRecordSource } from './subscribe-record-list-table-record-source';

export abstract class RecordListTableRecordSource<T> extends SubscribeRecordListTableRecordSource<T, RecordList<T>> {
    readonly list: RecordList<T>;

    constructor(
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        definition: RecordListTableRecordSourceDefinition<T>,
        allowedFieldSourceDefinitionTypeIds: readonly TableFieldSourceDefinition.TypeId[],
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            definition,
            allowedFieldSourceDefinitionTypeIds,
        );
        this.list = definition.list;
    }

    protected override subscribeList(_opener: LockOpenListItem.Opener) {
        return this.list;
    }

    protected override unsubscribeList(_opener: LockOpenListItem.Opener) {
        // noting to do
    }
}

