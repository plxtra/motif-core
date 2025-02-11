import {
    AssertInternalError,
    Integer,
    LockOpenListItem,
    MultiEvent,
    Ok,
    RecordList,
    Result,
    UnreachableCaseError,
    UsableListChangeType,
    UsableListChangeTypeId,
    anyBinarySearch,
    compareNumber,
    moveElementsInArray,
    rangedAnyBinarySearch
} from '@xilytix/sysutils';
import { DataIvemId, RankScoredDataIvemIdList } from '../adi/internal-api';
import { RankedDataIvemId } from '../adi/scan/ranked-data-ivem-id';
import {
    Badness,
    BadnessList,
    CorrectnessId,
} from "../sys/internal-api";
import { RankedDataIvemIdListDefinition } from './definition/internal-api';
import { RankedDataIvemIdList } from './ranked-data-ivem-id-list';

/** @public */
export abstract class BaseRankedDataIvemIdList implements RankedDataIvemIdList {
    // Only used by Json to mark referential as dirty and needing to be saved
    referentialTargettedModifiedEventer: BaseRankedDataIvemIdList.ModifiedEventer | undefined;

    protected _lockedScoredList: RankScoredDataIvemIdList;

    private _records = new Array<RankedDataIvemId>();
    private _rankSortedRecords = new Array<RankedDataIvemId>();

    private _scoredListbadnessChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _scoredListCorrectnessChangeSubscriptionId: MultiEvent.SubscriptionId;
    private _scoredListListChangeSubscriptionId: MultiEvent.SubscriptionId;

    private _listChangeMultiEvent = new MultiEvent<RecordList.ListChangeEventHandler>();
    private _badnessChangedMultiEvent = new MultiEvent<BadnessList.badnessChangedEventHandler>();

    constructor(
        readonly typeId: RankedDataIvemIdListDefinition.TypeId,
        readonly userCanAdd: boolean,
        readonly userCanReplace: boolean,
        readonly userCanRemove: boolean,
        readonly userCanMove: boolean,
    ) {
    }

    get usable() { return this._lockedScoredList.usable; }
    get badness(): Badness { return this._lockedScoredList.badness; }
    get correctnessId(): CorrectnessId { return this._lockedScoredList.correctnessId; }

    get count() { return this._records.length; }

    abstract get name(): string;
    abstract get description(): string;
    abstract get category(): string;

    tryLock(_locker: LockOpenListItem.Locker): Promise<Result<void>> {
        // descendants can override
        return Ok.createResolvedPromise(undefined);
    }

    unlock(_locker: LockOpenListItem.Locker) {
        // descendants can override
    }

    openLocked(_opener: LockOpenListItem.Opener): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList !== undefined) {
            // cannot open more than once
            throw new AssertInternalError('RLIILIO31313');
        } else {
            this._lockedScoredList = this.subscribeRankScoredDataIvemIdList();

            const existingCount = this._lockedScoredList.count;
            if (existingCount > 0) {
                this.insertRecords(0, existingCount);
            }

            this._scoredListbadnessChangedSubscriptionId = this._lockedScoredList.subscribeBadnessChangedEvent(
                () => { this.processScoredListBadnessChanged() }
            );
            this._scoredListCorrectnessChangeSubscriptionId = this._lockedScoredList.subscribeCorrectnessChangedEvent(
                () => { this.processScoredListCorrectnessChanged() }
            );
            this._scoredListListChangeSubscriptionId = this._lockedScoredList.subscribeListChangeEvent(
                (listChangeTypeId, index, count) => { this.processScoredListListChange(listChangeTypeId, index, count) }
            );
        }
    }

    closeLocked(_opener: LockOpenListItem.Opener): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('RLIILIC31313');
        } else {
            this._lockedScoredList.unsubscribeListChangeEvent(this._scoredListListChangeSubscriptionId);
            this._scoredListListChangeSubscriptionId = undefined;
            this._lockedScoredList.unsubscribeCorrectnessChangedEvent(this._scoredListCorrectnessChangeSubscriptionId);
            this._scoredListCorrectnessChangeSubscriptionId = undefined;
            this._lockedScoredList.unsubscribeBadnessChangedEvent(this._scoredListbadnessChangedSubscriptionId);
            this._scoredListbadnessChangedSubscriptionId = undefined;
            this.unsubscribeRankScoredDataIvemIdList();
        }
    }

    indexOf(record: RankedDataIvemId) {
        const count = this.count;
        for (let index = 0; index < count; index++) {
            if (this._records[index] === record) {
                return index;
            }
        }
        return -1;
    }

    getAt(index: number): RankedDataIvemId {
        return this._records[index];
    }

    toArray(): readonly RankedDataIvemId[] {
        return this._records;
    }

    userAdd(_dataIvemId: DataIvemId): Integer {
        throw new AssertInternalError('RLIILIUA31313');
    }

    userAddArray(_dataIvemIds: DataIvemId[]): void {
        throw new AssertInternalError('RLIILIUAA31313');
    }

    userReplaceAt(_index: number, _dataIvemIds: DataIvemId[]): void {
        throw new AssertInternalError('RLIILIURPA31313');
    }

    userRemoveAt(_index: number, _count: number): void {
        throw new AssertInternalError('RLIILIURMA31313');
    }

    userMoveAt(_fromIndex: number, _count: number, _toIndex: number): void {
        throw new AssertInternalError('RLIILIUMA31313');
    }

    subscribeBadnessChangedEvent(handler: BadnessList.badnessChangedEventHandler) {
        return this._badnessChangedMultiEvent.subscribe(handler);
    }

    unsubscribeBadnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void {
        this._badnessChangedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeListChangeEvent(handler: RecordList.ListChangeEventHandler) {
        return this._listChangeMultiEvent.subscribe(handler);
    }

    unsubscribeListChangeEvent(subscriptionId: MultiEvent.SubscriptionId): void {
        this._listChangeMultiEvent.unsubscribe(subscriptionId);
    }

    private processScoredListBadnessChanged() {
        const handlers = this._badnessChangedMultiEvent.copyHandlers();
        for (const handler of handlers) {
            handler();
        }
    }

    private processScoredListCorrectnessChanged() {
        const correctnessId = this._lockedScoredList.correctnessId;
        for (const rankedDataIvemId of this._records) {
            rankedDataIvemId.setCorrectnessId(correctnessId);
        }
    }

    private processScoredListListChange(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                this.notifyListChange(UsableListChangeTypeId.Unusable, 0, 0);
                break;
            case UsableListChangeTypeId.PreUsableClear: {
                const oldCount = this.count;
                if (oldCount !== 0) {
                    this._records.length = 0;
                }
                break;
            }
            case UsableListChangeTypeId.PreUsableAdd:
                if (count > 0) {
                    this.insertRecords(index, count);
                }
                break;
            case UsableListChangeTypeId.Usable: {
                this.notifyListChange(UsableListChangeTypeId.PreUsableClear, 0, 0);
                const recordCount = this.count;
                if (count > 0) {
                    this.notifyListChange(UsableListChangeTypeId.PreUsableAdd, 0, recordCount);
                }
                this.notifyListChange(UsableListChangeTypeId.Usable, 0, 0);
                    // handled through badness change
                break;
            }
            case UsableListChangeTypeId.Insert:
                this.insertRecords(index, count);
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Insert, index, count);
                break;
            case UsableListChangeTypeId.BeforeReplace:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.BeforeReplace, index, count);
                break;
            case UsableListChangeTypeId.AfterReplace:
                this.replaceRecords(index, count);
                this.checkUsableNotifyListChange(UsableListChangeTypeId.AfterReplace, index, count);
                break;
            case UsableListChangeTypeId.BeforeMove:
                this.checkUsableNotifyListChange(UsableListChangeTypeId.BeforeMove, index, count);
                break;
            case UsableListChangeTypeId.AfterMove: {
                const { fromIndex, toIndex, count: moveCount } = UsableListChangeType.getMoveParameters(index); // index is actually move parameters registration index
                this.moveRecords(fromIndex, toIndex, moveCount);
                this.checkUsableNotifyListChange(UsableListChangeTypeId.AfterMove, index, count);
                break;
            }
            case UsableListChangeTypeId.Remove:
                this.removeRecords(index, count);
                this.checkUsableNotifyListChange(UsableListChangeTypeId.Remove, index, count);
                break;
            case UsableListChangeTypeId.Clear:
                this.notifyListChange(listChangeTypeId, index, count);
                this.clearRecords();
                break;
            default:
                throw new UnreachableCaseError('RLIILIPDILCD54483', listChangeTypeId);
        }
    }

    private insertRecords(index: Integer, insertCount: Integer) {
        if (insertCount > 0) {
            const toBeInsertedRecords = new Array<RankedDataIvemId>(insertCount);
            const scoredRecordList = this._lockedScoredList;
            const correctnessId = this._lockedScoredList.correctnessId;
            for (let i = 0; i < insertCount; i++) {
                const matchRecord = scoredRecordList.getAt(index + i);
                toBeInsertedRecords[i] = new RankedDataIvemId(matchRecord.value, correctnessId, -1, matchRecord.rankScore);
            }

            this._records.splice(index, 0, ...toBeInsertedRecords);
            this.insertIntoSorting(toBeInsertedRecords);
        }
    }

    private insertIntoSorting(insertRecords: RankedDataIvemId[]) {
        const insertCount = insertRecords.length;
        const existingCount = this.count;
        if (insertCount === 1) {
            this.insertOneIntoSorting(insertRecords[0]);
        } else {
            if (existingCount === 0 || insertCount >= 0.3 * existingCount) {
                this.insertIntoSortingWithResortAll(insertRecords);
            } else {
                this.insertIntoSortingIndividually(insertRecords);
            }
        }
    }

    private insertOneIntoSorting(record: RankedDataIvemId) {
        const sortedRecords = this._rankSortedRecords;
        const searchResult = anyBinarySearch(
            sortedRecords,
            record,
            (left, right) => compareNumber(left.rankScore, right.rankScore),
        );
        const insertIndex = searchResult.index;
        sortedRecords.splice(insertIndex, 0, record);
        this.reRank(insertIndex);
    }

    private insertIntoSortingWithResortAll(insertRecords: RankedDataIvemId[]) {
        const sortedRecords = this._rankSortedRecords;
        const oldCount = sortedRecords.length;
        const oldSortedRecords = sortedRecords.slice();
        sortedRecords.splice(oldCount, 0, ...insertRecords);
        sortedRecords.sort((left, right) => compareNumber(left.rankScore, right.rankScore));
        let firstReindexedIndex = oldCount;
        for (let i = 0; i < oldCount; i++) {
            const oldRankedDataIvemId = oldSortedRecords[i];
            const newRankedDataIvemId = sortedRecords[i];
            if (oldRankedDataIvemId !== newRankedDataIvemId) {
                firstReindexedIndex = i;
                break;
            }
        }

        const sortRecordsCount = sortedRecords.length;
        for (let i = firstReindexedIndex; i < sortRecordsCount; i++) {
            const record = sortedRecords[i];
            record.setRank(i + 1);
        }
    }

    private insertIntoSortingIndividually(insertRecords: RankedDataIvemId[]) {
        const sortedRecords = this._rankSortedRecords;
        let sortedRecordsCount = sortedRecords.length;
        let minSortInsertIndex = Number.MAX_SAFE_INTEGER;
        for (const record of insertRecords) {
            const searchResult = rangedAnyBinarySearch(
                sortedRecords,
                record,
                (left, right) => compareNumber(left.rankScore, right.rankScore),
                0,
                sortedRecordsCount
            );
            const insertIndex = searchResult.index;
            sortedRecords.splice(insertIndex, 0, record);
            if (insertIndex < minSortInsertIndex) {
                minSortInsertIndex = insertIndex;
            }
            sortedRecordsCount += 1;
        }

        this.reRank(minSortInsertIndex);
    }

    private removeRecords(index: Integer, removeCount: Integer) {
        if (removeCount > 0) {
            const sortedRecords = this._rankSortedRecords;
            const sortedRecordsCount = sortedRecords.length;
            if (removeCount === sortedRecordsCount) {
                this.clearRecords();
            } else {
                this.removeRecordsFromSorting(index, removeCount);
                this._records.splice(index, removeCount);
            }
        }
    }

    private removeRecordsFromSorting(index: Integer, removeCount: Integer) {
        const sortedRecords = this._rankSortedRecords;
        if (removeCount === 1) {
            const removeRecord = this._records[index];
            const removeRank = removeRecord.rank;
            const removeRankSortedIndex = removeRank - 1;
            sortedRecords.splice(removeRankSortedIndex, 1);
            this.reRank(removeRankSortedIndex);
        } else {
            const nextRangeIndex = index + removeCount;
            for (let i = index; i < nextRangeIndex; i++) {
                const rankedDataIvemId = this._records[i];
                rankedDataIvemId.setInvalidRank();
            }

            sortedRecords.sort((left, right) => compareNumber(left.rank, right.rank));

            const sortedRecordsCount = sortedRecords.length;
            for (let i = 0; i < sortedRecordsCount; i++) {
                const rankedDataIvemId = sortedRecords[i];
                if (!rankedDataIvemId.isRankInvalid()) {
                    sortedRecords.splice(0, i);
                    break;
                }
            }
            this.reRank(0);
        }
    }

    private replaceRecords(index: Integer, replaceCount: Integer) {
        if (replaceCount > 0) {
            this.removeRecordsFromSorting(index, replaceCount);

            const newRecords = new Array<RankedDataIvemId>(replaceCount);
            const scoredRecordList = this._lockedScoredList;
            const correctnessId = this._lockedScoredList.correctnessId;
            for (let i = 0; i < replaceCount; i++) {
                const scoredRecord = scoredRecordList.getAt(index + i);
                const newRecord = new RankedDataIvemId(scoredRecord.value, correctnessId, -1, scoredRecord.rankScore);
                this._records[index + i] = newRecord;
                newRecords[i] = newRecord;
            }

            this.insertIntoSorting(newRecords);
        }
    }

    private moveRecords(fromIndex: Integer, toIndex: Integer, moveCount: Integer) {
        if (moveCount > 0) {
            moveElementsInArray(this._records, fromIndex, toIndex, moveCount);
        }
        // Since none of the record's values have changed, the sorting is not affected
    }

    private clearRecords() {
        this._records.length = 0;
        this._rankSortedRecords.length = 0;
    }

    private reRank(startIndex: Integer) {
        const sortedRecords = this._rankSortedRecords;
        const sortedRecordsCount = sortedRecords.length;
        for (let i = startIndex; i < sortedRecordsCount; i++) {
            const record = sortedRecords[i];
            record.setRank(i + 1);
        }
    }

    private notifyListChange(listChangeTypeId: UsableListChangeTypeId, recIdx: Integer, recCount: Integer) {
        const handlers = this._listChangeMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](listChangeTypeId, recIdx, recCount);
        }
    }

    private checkUsableNotifyListChange(listChangeTypeId: UsableListChangeTypeId, recIdx: Integer, recCount: Integer) {
        if (this.usable) {
            this.notifyListChange(listChangeTypeId, recIdx, recCount);
        }
    }

    abstract createDefinition(): RankedDataIvemIdListDefinition;
    abstract subscribeRankScoredDataIvemIdList(): RankScoredDataIvemIdList;
    abstract unsubscribeRankScoredDataIvemIdList(): void;
}

export namespace BaseRankedDataIvemIdList {
    export type ModifiedEventer = (this: void) => void;
}
