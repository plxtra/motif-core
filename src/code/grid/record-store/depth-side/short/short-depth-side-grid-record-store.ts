import { DecimalFactory, Integer, MultiEvent, UnreachableCaseError } from '@pbkware/js-utils';
import { RevRecordIndex, RevRecordStore } from 'revgrid';
import { DepthLevelsDataItem, DepthStyleId, MarketsService, OrderSideId } from '../../../../adi';
import { CorrectnessId } from '../../../../sys';
import { DepthSideGridRecordStore } from '../depth-side-grid-record-store';
import { ShortDepthRecord } from './short-depth-record';

export class ShortDepthSideGridRecordStore extends DepthSideGridRecordStore implements RevRecordStore {
    private _records: ShortDepthRecord[] = [];
    private _dataItem: DepthLevelsDataItem;
    private _levels: DepthLevelsDataItem.Level[];
    private _dataItemFinalised = true;

    private _statusDataCorrectnessSubscriptionId: MultiEvent.SubscriptionId;
    private _afterLevelAddSubscriptionId: MultiEvent.SubscriptionId;
    private _beforeLevelRemoveSubscriptionId: MultiEvent.SubscriptionId;
    private _levelChangeSubscriptionId: MultiEvent.SubscriptionId;
    private _levelsClearSubscriptionId: MultiEvent.SubscriptionId;

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        marketsService: MarketsService,
        styleId: DepthStyleId,
        sideId: OrderSideId
    ) {
        super(marketsService, styleId, sideId);
    }

    get recordCount(): number { return this.getRecordCount(); }

    finalise() {
        this.finaliseDataItem();
    }

    open(value: DepthLevelsDataItem) {
        this._dataItem = value;
        this._levels = this._dataItem.getLevels(this.sideId);

        this._statusDataCorrectnessSubscriptionId = this._dataItem.subscribeCorrectnessChangedEvent(
            () => { this.processDataCorrectnessChanged(); }
        );

        this._afterLevelAddSubscriptionId = this._dataItem.subscribeAfterLevelInsertEvent(
            this.sideId, (index) => { this.handleAfterLevelInsertEvent(index); }
        );
        this._beforeLevelRemoveSubscriptionId = this._dataItem.subscribeBeforeLevelRemoveEvent(
            this.sideId, (index) => { this.handleBeforeLevelRemoveEvent(index); }
        );
        this._levelChangeSubscriptionId = this._dataItem.subscribeLevelChangeEvent(
            this.sideId,
            (index, valueChanges) => { this.handleLevelChangeEvent(index, valueChanges); }
        );
        this._levelsClearSubscriptionId = this._dataItem.subscribeBeforeLevelsClearEvent(() => { this.handleLevelsClearEvent(); });

        this._dataItemFinalised = false;

        this.processDataCorrectnessChanged();
    }

    // abstract overloads
    close() {
        this.clearRecords();
        this.finaliseDataItem();
        this.resetOpenPopulated();
    }

    toggleRecordOrderPriceLevel(idx: Integer) {
        // ignore
    }

    setAllRecordsToOrder() {
        // ignore
    }

    setAllRecordsToPriceLevel() {
        // ignore
    }

    setNewPriceLevelAsOrder(value: boolean) {
        // ignore
    }

    // GridDataStore properties/methods
    getRecord(recordIndex: RevRecordIndex) {
        return this._records[recordIndex];
    }

    getRecords() {
        return this._records;
    }

    protected getRecordCount() {
        return this._records.length;
    }

    private processDataCorrectnessChanged() {
        switch (this._dataItem.correctnessId) {
            case CorrectnessId.Error:
                this.checkResolveOpenPopulated(false);
                break;
            case CorrectnessId.Usable:
            case CorrectnessId.Good:
                this.populateRecords();
                break;
            case CorrectnessId.Suspect:
                break;
            default:
                throw new UnreachableCaseError('SDSGDS88843', this._dataItem.correctnessId);
        }
    }

    private handleAfterLevelInsertEvent(index: Integer) {
        if (this._dataItem.usable) {
            this.insertRecord(index);
        }
    }

    private handleBeforeLevelRemoveEvent(index: Integer) {
        if (this._dataItem.usable) {
            this.deleteRecord(index);
        }
    }

    private handleLevelChangeEvent(index: Integer, valueChanges: DepthLevelsDataItem.Level.ValueChange[]) {
        if (this._dataItem.usable) {
            this.changeRecord(index, valueChanges);
        }
    }

    private handleLevelsClearEvent() {
        if (this._dataItem.usable) {
            this.clearRecords();
        }
    }

    private reindexRecords(fromIndex: Integer) {
        for (let i = fromIndex; i < this._records.length; i++) {
            this._records[i].index = i;
        }
    }

    private insertRecord(index: Integer) {
        let volumeAhead: Integer | undefined;
        if (index === 0) {
            volumeAhead = 0;
        } else {
            const prevRecord = this._records[index - 1];
            volumeAhead = prevRecord.cumulativeQuantity;
        }
        const level = this._levels[index];
        const record = new ShortDepthRecord(this._decimalFactory, this._marketsService, index, level, volumeAhead, this._auctionVolume);
        this._records.splice(index, 0, record);
        this.reindexRecords(index + 1);
        const lastAffectedFollowingRecordIndex = this.processAuctionAndVolumeAhead(index, false);
        this.eventifyRecordInserted(index, lastAffectedFollowingRecordIndex);
    }

    private deleteRecord(index: Integer) {
        this._records.splice(index, 1);
        let lastAffectedFollowingRecordIndex: Integer | undefined;
        if (index >= this._records.length) {
            lastAffectedFollowingRecordIndex = undefined;
        } else {
            this.reindexRecords(index);
            lastAffectedFollowingRecordIndex = this.processAuctionAndVolumeAhead(index, false);
        }
        this.eventifyRecordDeleted(index, lastAffectedFollowingRecordIndex);
    }

    private changeRecord(index: Integer, valueChanges: DepthLevelsDataItem.Level.ValueChange[]) {
        const record = this._records[index];

        const lastAffectedFollowingRecordIndex = this.processAuctionAndVolumeAhead(record.index, false);
        const invalidatedValues = record.processValueChanges(valueChanges);
        this.eventifyInvalidateRecordAndValuesAndFollowingRecords(record.index, invalidatedValues, lastAffectedFollowingRecordIndex);
    }

    private clearRecords() {
        this._records.length = 0;
        this.eventifyAllRecordsDeleted();
    }

    private populateRecords() {
        // const oldLength = this._records.length;

        const list = this._dataItem.getLevels(this.sideId);
        if (list.length > 0) {
            this._records.length = list.length;
            for (let i = 0; i < list.length; i++) {
                const level = this._levels[i];
                this._records[i] = new ShortDepthRecord(this._decimalFactory, this._marketsService, i, level, 0, this._auctionVolume);
            }
            this.processAuctionAndVolumeAhead(0, true);
        }

        this.eventifyRecordsLoaded();

        super.checkResolveOpenPopulated(true);
    }

    private finaliseDataItem() {
        if (!this._dataItemFinalised) {
            this._dataItem.unsubscribeCorrectnessChangedEvent(this._statusDataCorrectnessSubscriptionId);
            this._dataItem.unsubscribeAfterLevelInsertEvent(this.sideId, this._afterLevelAddSubscriptionId);
            this._dataItem.unsubscribeBeforeLevelRemoveEvent(this.sideId, this._beforeLevelRemoveSubscriptionId);
            this._dataItem.unsubscribeLevelChangeEvent(this.sideId, this._levelChangeSubscriptionId);
            this._dataItem.unsubscribeBeforeLevelsClearEvent(this._levelsClearSubscriptionId);

            this._dataItemFinalised = true;
        }
    }
}
