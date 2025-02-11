import { Integer, MultiEvent, RecordList, UsableListChangeTypeId } from '@xilytix/sysutils';
import { DataIvemId, RankScoredDataIvemId, RankScoredDataIvemIdList } from '../adi/internal-api';
import { Badness } from '../sys/badness';
import { BadnessList } from '../sys/badness-list';
import { CorrectnessId } from '../sys/correctness';
import { CorrectnessRecord } from '../sys/internal-api';

export class IndexRankScoredDataIvemIdList implements RankScoredDataIvemIdList {
    readonly userCanAdd = true;
    readonly userCanRemove = true;
    readonly userCanMove = true;
    readonly badness = Badness.notBad;
    readonly correctnessId = CorrectnessId.Good;
    readonly usable = true;

    private readonly _dataIvemIds = new Array<DataIvemId>();

    private _listChangeMultiEvent = new MultiEvent<RecordList.ListChangeEventHandler>();

    constructor(
        initialDataIvemIds: readonly DataIvemId[],
        private readonly _modifiedEventHandler: IndexRankScoredDataIvemIdList.ModifiedEventHandler | undefined,
    ) {
        const count = initialDataIvemIds.length;
        const dataIvemIds = new Array<DataIvemId>(count);
        for (let i = 0; i < count; i++) {
            const definitionDataIvemId = initialDataIvemIds[i];
            const dataIvemId = definitionDataIvemId.createCopy();
            dataIvemIds[i] = dataIvemId;
        }
        this._dataIvemIds = dataIvemIds;
    }

    get dataIvemIds(): readonly DataIvemId[] { return this._dataIvemIds; }
    get count() { return this._dataIvemIds.length; }

    indexOf(record: RankScoredDataIvemId) {
        return record.rankScore; // assumes in same list
    }

    getAt(index: number): RankScoredDataIvemId {
        return {
            value: this._dataIvemIds[index],
            rankScore: index,
        };
    }

    toArray(): readonly RankScoredDataIvemId[] {
        return this._dataIvemIds.map<RankScoredDataIvemId>(
            (dataIvemId, index) => ({
                value: dataIvemId,
                rankScore: index,
            })
        );
    }

    set(value: DataIvemId[]) {
        const existingCount = this._dataIvemIds.length;
        if (existingCount > 0) {
            this.notifyListChange(UsableListChangeTypeId.Clear, 0, existingCount);
            this._dataIvemIds.length = 0;
        }
        this.addArray(value);
    }

    add(value: DataIvemId) {
        const newCount = this._dataIvemIds.push(value);
        const index = newCount - 1;
        this.notifyListChange(UsableListChangeTypeId.Insert, index, 1);
        this.notifyModified();
        return index;
    }

    addArray(value: DataIvemId[]) {
        const index = this._dataIvemIds.length;
        this._dataIvemIds.splice(index, 0, ...value);
        this.notifyListChange(UsableListChangeTypeId.Insert, index, value.length);
        this.notifyModified();
    }

    replaceAt(index: number, dataIvemIds: DataIvemId[]) {
        const count = this._dataIvemIds.length;
        this.notifyListChange(UsableListChangeTypeId.BeforeReplace, index, count);
        this._dataIvemIds.splice(index, count, ...dataIvemIds);
        this.notifyListChange(UsableListChangeTypeId.AfterReplace, index, count);
        this.notifyModified();
    }

    removeAt(index: number, count: number): void {
        this._dataIvemIds.splice(index, count);
        this.notifyListChange(UsableListChangeTypeId.Remove, index, count);
        this.notifyModified();
    }

    subscribeBadnessChangedEvent(_handler: BadnessList.badnessChangedEventHandler) {
        return MultiEvent.nullDefinedSubscriptionId;
    }

    unsubscribeBadnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void {
        // nothing to do
    }

    subscribeCorrectnessChangedEvent(handler: CorrectnessRecord.CorrectnessChangedEventHandler): number {
        return MultiEvent.nullDefinedSubscriptionId;
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void {
        // nothing to do
    }

    subscribeListChangeEvent(handler: RecordList.ListChangeEventHandler): number {
        return this._listChangeMultiEvent.subscribe(handler);
    }

    unsubscribeListChangeEvent(subscriptionId: MultiEvent.SubscriptionId): void {
        this._listChangeMultiEvent.unsubscribe(subscriptionId);
    }

    private notifyListChange(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        const handlers = this._listChangeMultiEvent.copyHandlers();
        for (let i = 0; i < handlers.length; i++) {
            handlers[i](listChangeTypeId, index, count);
        }
    }

    private notifyModified() {
        if (this._modifiedEventHandler !== undefined) {
            this._modifiedEventHandler();
        }
    }
}

export namespace IndexRankScoredDataIvemIdList {
    export type ModifiedEventHandler = (this: void) => void;
}
