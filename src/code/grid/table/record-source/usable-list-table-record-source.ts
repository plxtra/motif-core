import { Integer, LockOpenListItem, MultiEvent, UsableListChangeTypeId } from '@pbkware/js-utils';
import { RevSourcedFieldCustomHeadings } from 'revgrid';
import { TextFormatter } from '../../../services';
import { CorrectnessBadness, UsableList } from '../../../sys';
import { TableFieldSourceDefinitionCachingFactory } from '../field-source/internal-api';
import { UsableListTableRecordSourceDefinition } from './definition/internal-api';
import { TableRecordSource } from './table-record-source';

export abstract class UsableListTableRecordSource<Record> extends TableRecordSource {
    readonly list: UsableList<Record>;

    private _listChangeEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: UsableListTableRecordSourceDefinition<Record>,
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
            definition.allowedFieldSourceDefinitionTypeIds,
        );

        this.list = definition.list;
    }

    override openLocked(opener: LockOpenListItem.Opener) {
        this._listChangeEventSubscriptionId = this.list.subscribeListChangeEvent(
            (listChangeTypeId, idx, count) => { this.processListChange(listChangeTypeId, idx, count); }
        );

        super.openLocked(opener);

        if (this.list.usable) {
            const newCount = this.list.count;
            if (newCount > 0) {
                this.processListChange(UsableListChangeTypeId.PreUsableAdd, 0, newCount);
            }
            this.processListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.processListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    override closeLocked(opener: LockOpenListItem.Opener) {
        // TableRecordDefinitionList can no longer be used after it is deactivated
        if (this.count > 0) {
            this.processListChange(UsableListChangeTypeId.Clear, 0, this.count);
        }

        this.list.unsubscribeListChangeEvent(this._listChangeEventSubscriptionId);
        super.closeLocked(opener);
    }

    protected abstract processListChange(listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer): void;
}
