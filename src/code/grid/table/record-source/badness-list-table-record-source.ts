import { LockOpenListItem } from '@pbkware/js-utils';
import { RevSourcedFieldCustomHeadings } from 'revgrid';
import { TextFormatter } from '../../../services/internal-api';
import { BadnessList, CorrectnessBadness } from '../../../sys/internal-api';
import { TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory } from '../field-source/internal-api';
import { BadnessListTableRecordSourceDefinition } from './definition/internal-api';
import { SubscribeBadnessListTableRecordSource } from './subscribe-badness-list-table-record-source';

export abstract class BadnessListTableRecordSource<T> extends SubscribeBadnessListTableRecordSource<T, BadnessList<T>> {
    readonly list: BadnessList<T>;

    constructor(
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: BadnessListTableRecordSourceDefinition<T>,
        allowedFieldSourceDefinitionTypeIds: readonly TableFieldSourceDefinition.TypeId[],
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
            allowedFieldSourceDefinitionTypeIds,
        );
        this.list = definition.list;
    }

    protected override subscribeList(opener: LockOpenListItem.Opener) {
        return this.list;
    }

    protected override unsubscribeList(opener: LockOpenListItem.Opener) {
        // noting to do
    }
}

