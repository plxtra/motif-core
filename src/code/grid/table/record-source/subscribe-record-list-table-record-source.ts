import {
    CorrectnessState,
    Integer,
    LockOpenListItem,
    MultiEvent,
    RecordList,
    UnreachableCaseError,
    UsableListChangeTypeId
} from '@pbkware/js-utils';
import { RevSourcedFieldCustomHeadings } from 'revgrid';
import { TextFormatter } from '../../../services/internal-api';
import { Badness } from '../../../sys/internal-api';
import { TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory } from '../field-source/internal-api';
import { TableRecordSourceDefinition } from './definition/internal-api';
import { TableRecordSource } from './table-record-source';

/** @public */
export abstract class SubscribeRecordListTableRecordSource<T, TList extends RecordList<T>> extends TableRecordSource {
    private _recordList: TList;
    private _recordListListChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    // private _recordListBeforeRecordChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    // private _recordListAfterRecordChangedEventSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        definition: TableRecordSourceDefinition,
        allowedFieldSourceDefinitionTypeIds: readonly TableFieldSourceDefinition.TypeId[],
    ) {
        const nullCorrectnessState: CorrectnessState<Badness> = {
            badness: Badness.notBad,
            usable: true,
            setUsable: () => {/* */},
            setUnusable: () => {/* */},
            checkSetUnusable: () => {/* */},
            subscribeUsableChangedEvent: () => undefined,
            unsubscribeUsableChangedEvent: () => {/* */},
            subscribeBadnessChangedEvent: () => undefined,
            unsubscribeBadnessChangedEvent: () => {/* */},
        }
        super(textFormatter, customHeadings, tableFieldSourceDefinitionCachingFactory, nullCorrectnessState, definition, allowedFieldSourceDefinitionTypeIds);
    }

    get recordList() { return this._recordList; }

    // getDefinition(idx: Integer): TableRecordDefinition {
    //     return this._definitions[idx];
    // }

    override openLocked(opener: LockOpenListItem.Opener) {
        this._recordList = this.subscribeList(opener);
        this._recordListListChangeEventSubscriptionId = this._recordList.subscribeListChangeEvent(
            (listChangeTypeId, idx, count) => { this.processListListChange(listChangeTypeId, idx, count); }
        );
        // this._recordListBeforeRecordChangeEventSubscriptionId = this._recordList.subscribeBeforeRecordChangeEvent(
        //     (index) => this.handleRecordListBeforeRecordChangeEvent(index)
        // );
        // this._recordListAfterRecordChangedEventSubscriptionId = this._recordList.subscribeAfterRecordChangedEvent(
        //     (index) => this.handleRecordListAfterRecordChangedEvent(index)
        // );

        super.openLocked(opener);

        const newCount = this._recordList.count;
        if (newCount > 0) {
            this.processListListChange(UsableListChangeTypeId.PreUsableAdd, 0, newCount);
        }
        this.processListListChange(UsableListChangeTypeId.Usable, 0, 0);
    }

    override closeLocked(opener: LockOpenListItem.Opener) {
        // TableRecordDefinitionList can no longer be used after it is deactivated
        if (this.count > 0) {
            this.notifyListChange(UsableListChangeTypeId.Clear, 0, this.count);
        }

        this._recordList.unsubscribeListChangeEvent(this._recordListListChangeEventSubscriptionId);
        // this._recordList.unsubscribeBeforeRecordChangeEvent(this._recordListBeforeRecordChangeEventSubscriptionId);
        // this._recordList.unsubscribeAfterRecordChangedEvent(this._recordListAfterRecordChangedEventSubscriptionId);

        this.unsubscribeList(opener, this._recordList);
        super.closeLocked(opener);
    }

    protected override getCount() { return this._recordList.count; }
    // protected getCapacity() { return this._definitions.length; }
    // protected setCapacity(value: Integer) { /* no code */ }

    // private handleRecordListBeforeRecordChangeEvent(index: Integer) {
    //     const definition = this._definitions[index];
    //     definition.dispose();
    // }

    // private handleRecordListAfterRecordChangedEvent(index: Integer) {
    //     const record = this._recordList.records[index];
    //     const definition = this.createTableRecordDefinition(record);
    //     this._definitions[index] = definition;
    // }

    // private insertRecords(idx: Integer, count: Integer) {
    //     if (count === 1) {
    //         const record = this._recordList.records[idx];
    //         const definition = this.createTableRecordDefinition(record);
    //         if (idx === this._definitions.length) {
    //             this._definitions.push(definition);
    //         } else {
    //             this._definitions.splice(idx, 0, definition);
    //         }
    //     } else {
    //         const definitions = new Array<RecordTableRecordDefinition<Record>>(count);
    //         let insertArrayIdx = 0;
    //         for (let i = idx; i < idx + count; i++) {
    //             const record = this._recordList.records[i];
    //             definitions[insertArrayIdx++] = this.createTableRecordDefinition(record);
    //         }
    //         this._definitions.splice(idx, 0, ...definitions);
    //     }
    // }

    private processListListChange(listChangeTypeId: UsableListChangeTypeId, idx: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                break; // ignoer
            case UsableListChangeTypeId.PreUsableClear:
                break; // ignore
            case UsableListChangeTypeId.PreUsableAdd:
                break; // ignore
            case UsableListChangeTypeId.Usable:
                break; // ignore
            case UsableListChangeTypeId.Insert:
                // this.insertRecords(idx, count);
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Insert, idx, count);
                break;
            case UsableListChangeTypeId.BeforeReplace:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.BeforeReplace, idx, count);
                break;
            case UsableListChangeTypeId.AfterReplace:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.AfterReplace, idx, count);
                break;
            case UsableListChangeTypeId.BeforeMove:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.BeforeMove, idx, count);
                break;
            case UsableListChangeTypeId.AfterMove:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.AfterMove, idx, count);
                break;
            case UsableListChangeTypeId.Remove:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Remove, idx, count);
                // this._definitions.splice(idx, count);
                break;
            case UsableListChangeTypeId.Clear:
                this.notifyListChange(UsableListChangeTypeId.Clear, idx, count);
                // this._definitions.length = 0;
                break;
            default:
                throw new UnreachableCaseError('RTRSPLLC12487', listChangeTypeId);
        }
    }

    protected abstract subscribeList(opener: LockOpenListItem.Opener): TList;
    protected abstract unsubscribeList(opener: LockOpenListItem.Opener, list: TList): void;
}
