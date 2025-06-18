import {
    AssertInternalError,
    EnumInfoOutOfOrderError,
    Guid,
    Integer,
    LockOpenListItem,
    LockOpenManager,
    MapKey,
    MultiEvent,
    Ok,
    Result,
    UnreachableCaseError,
    isUndefinableArrayEqualUniquely,
    isUndefinableDateEqual,
    isUndefinableStringNumberBooleanNestArrayEqual
} from '@pbkware/js-utils';
import { RevRecordValueRecentChangeTypeId } from 'revgrid';
import {
    ActiveFaultedStatusId,
    AdiService,
    DataItemIncubator,
    DataIvemId,
    DataMarket,
    QueryScanDetailDataDefinition,
    QueryScanDetailDataItem,
    ScanAttachedNotificationChannel,
    ScanDetail,
    ScanStatusedDescriptor,
    ScanStatusedDescriptorInterface,
    ScanTargetTypeId,
    ZenithEncodedScanFormula
} from '../adi';
import { StringId, Strings } from '../res';
import { EnumTextFormattableValue, RankedDataIvemIdListDirectoryItem, TextFormattableValue } from '../services';
import {
    Correctness,
    CorrectnessId,
    FieldDataTypeId,
} from "../sys";

/** @public */
export class Scan implements LockOpenListItem<RankedDataIvemIdListDirectoryItem>, RankedDataIvemIdListDirectoryItem {
    readonly directoryItemTypeId = RankedDataIvemIdListDirectoryItem.TypeId.Scan;
    readonly id: string;
    readonly mapKey: MapKey;

    existenceVerified = true;
    index: Integer; // within list of scans - used by LockOpenList

    private readonly _lockOpenManager: LockOpenManager<Scan>;
    private readonly _valueChanges = new Array<Scan.ValueChange>();

    private _detailCorrectnessId = CorrectnessId.Suspect;
    private _correctnessId = CorrectnessId.Suspect;
    private _errorText: string | undefined;

    // StatusedDescriptor
    private _name: string;
    private _upperCaseName: string;
    private _description: string | undefined;
    private _upperCaseDescription: string;
    private _readonly: boolean;
    private _statusId: ActiveFaultedStatusId;
    private _enabled: boolean;
    private _versionNumber: Integer | undefined;
    private _versionId: string | undefined;
    private _versioningInterrupted: boolean;
    private _lastSavedTime: Date | undefined;
    private _lastEditSessionId: Guid | undefined;
    private _symbolListEnabled: boolean | undefined;
    private _zenithCriteriaSource: string | undefined;
    private _zenithRankSource: string | undefined;

    // Parameters
    private _targetTypeId: ScanTargetTypeId | undefined;
    private _targetMarkets: readonly DataMarket[] | undefined;
    private _targetDataIvemIds: readonly DataIvemId[] | undefined;
    private _maxMatchCount: Integer | undefined;
    private _zenithCriteria: ZenithEncodedScanFormula.BooleanTupleNode | undefined;
    private _zenithRank: ZenithEncodedScanFormula.NumericTupleNode | undefined;
    private _attachedNotificationChannels: readonly ScanAttachedNotificationChannel[] | undefined;

    private _deleted = false;
    private _detailWanted = false;
    private _detailed = false;

    private _beginChangeCount = 0;

    private _queryScanDetailDataItemIncubator: DataItemIncubator<QueryScanDetailDataItem>;
    private _activeQueryScanDetailDataItem: QueryScanDetailDataItem | undefined;
    private _activeQueryScanDetailDataItemCorrectnessChangeSubscriptionId: MultiEvent.SubscriptionId;

    private _correctnessChangedMultiEvent = new MultiEvent<Scan.CorrectnessChangedEventHandler>();
    private _descriptorChangedSubscriptionId: MultiEvent.SubscriptionId;
    private _valuesChangedMultiEvent = new MultiEvent<Scan.ValuesChangedEventHandler>();
    private _directoryItemChangedMultiEvent = new MultiEvent<RankedDataIvemIdListDirectoryItem.ChangedEventHandler>();

    constructor(
        adiService: AdiService,
        private readonly _descriptor: ScanStatusedDescriptor,
        private _listCorrectnessId: CorrectnessId,
        private readonly _requireUnwantDetailOnLastCloseEventer: Scan.RequireUnwantDetailOnLastCloseEventer,
        private readonly _deletedAndUnlockedEventer: Scan.DeletedAndUnlockedEventer,
    ) {
        this._queryScanDetailDataItemIncubator = new DataItemIncubator<QueryScanDetailDataItem>(adiService);
        this._lockOpenManager = new LockOpenManager<Scan>(
            () => this.tryProcessFirstLock(),
            () => { this.processLastUnlock(); },
            () => { this.processFirstOpen(); },
            () => { this.processLastClose(); },
        );

        const id = this._descriptor.id;
        this.id = id;
        this.mapKey = id;
        const name = this._descriptor.name;
        this._name = name;
        this._upperCaseName = name.toUpperCase();
        const description = this._descriptor.description;
        this._description = description;
        this._upperCaseDescription = description === undefined ? '' : description.toUpperCase();
        this._readonly = this._descriptor.readonly;
        this._versionNumber = this._descriptor.versionNumber;
        this._versionId = this._descriptor.versionId;
        this._versioningInterrupted = this._descriptor.versioningInterrupted;
        this._lastSavedTime = this._descriptor.lastSavedTime;
        this._lastEditSessionId = this._descriptor.lastEditSessionId;
        this._zenithCriteriaSource = this._descriptor.zenithCriteriaSource;
        this._zenithRankSource = this._descriptor.zenithRankSource;

        this._descriptorChangedSubscriptionId = this._descriptor.subscribeUpdatedEvent(
            (changedFieldIds) => {
                if (this._detailWanted) {
                    this.wantDetail(true);
                } else {
                    this.applyDescriptorChanges(this._descriptor, changedFieldIds);
                }
            }
        );

        this.updateCorrectnessId();
    }

    get lockCount() { return this._lockOpenManager.lockCount; }
    get lockers(): readonly LockOpenListItem.Locker[] { return this._lockOpenManager.lockers; }
    get openCount() { return this._lockOpenManager.openCount; }
    get openers(): readonly LockOpenListItem.Opener[] { return this._lockOpenManager.openers; }

    get correctnessId() { return this._correctnessId; }
    get detailed() { return this._detailed; }

    get name() { return this._name; }
    get description() { return this._description; }
    get symbolListEnabled() { return this._symbolListEnabled; }

    get upperCaseName() { return this._upperCaseName; }
    get upperCaseDescription() { return this._upperCaseDescription; }
    get versionNumber() { return this._versionNumber; }
    get versionId() { return this._versionId; }
    get versioningInterrupted() { return this._versioningInterrupted; }
    get lastSavedTime() { return this._lastSavedTime; }
    get lastEditSessionId() { return this._lastEditSessionId; }
    get readonly() { return this._readonly; }
    get statusId() { return this._statusId; }
    get enabled() { return this._enabled; }
    get targetTypeId() { return this._targetTypeId; }
    get targetMarkets() { return this._targetMarkets; }
    get targetDataIvemIds() { return this._targetDataIvemIds; }
    get maxMatchCount() { return this._maxMatchCount; }
    get zenithCriteria() { return this._zenithCriteria; }
    get zenithRank() { return this._zenithRank; }
    get attachedNotificationChannels() { return this._attachedNotificationChannels; }
    get zenithCriteriaSource() { return this._zenithCriteriaSource; }
    get zenithRankSource() { return this._zenithRankSource; }

    get version() {
        const versionNumber = this._versionNumber;
        if (versionNumber === undefined) {
            return undefined;
        } else {
            let result = versionNumber.toString(10);
            if (this._versioningInterrupted) {
                result += '?';
            }
            const versionId = this._versionId;
            if (versionId !== undefined) {
                result += `.${versionId}`;
            }
            return result;
        }
    }

    finalise(): void {
        this._descriptor.unsubscribeUpdatedEvent(this._descriptorChangedSubscriptionId);
        this._descriptorChangedSubscriptionId = undefined;
    }

    setListCorrectness(value: CorrectnessId): void {
        if (value !== this._listCorrectnessId) {
            this._listCorrectnessId = value;
            this.updateCorrectnessId();
        }
    }

    unwantDetailIfClosed() {
        if (this._detailWanted && !this._lockOpenManager.isOpened()) {
            this.unwantDetail();
        }
    }
    // subscribeCorrectnessChangedEvent(handler: KeyedCorrectnessListItem.CorrectnessChangedEventHandler): number {
    //     throw new Error('Method not implemented.');
    // }
    // unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId): void {
    //     throw new Error('Method not implemented.');
    // }

    setTargetDataIvemIds(value: readonly DataIvemId[]) {
        this._targetDataIvemIds = value;
    }

    setTargetMarkets(value: readonly DataMarket[]) {
        this._targetMarkets = value;
    }

    tryLock(locker: LockOpenListItem.Locker): Promise<Result<void>> {
        return this._lockOpenManager.tryLock(locker);
    }

    unlock(locker: LockOpenListItem.Locker) {
        this._lockOpenManager.unlock(locker);
    }

    openLocked(opener: LockOpenListItem.Opener) {
        this._lockOpenManager.openLocked(opener);
    }

    closeLocked(opener: LockOpenListItem.Opener) {
        this._lockOpenManager.closeLocked(opener);
    }

    isLocked(ignoreOnlyLocker: LockOpenListItem.Locker | undefined) {
        return this._lockOpenManager.isLocked(ignoreOnlyLocker);
    }

    equals(scan: RankedDataIvemIdListDirectoryItem) {
        return scan.id === this.id;
    }

    subscribeCorrectnessChangedEvent(handler: Scan.CorrectnessChangedEventHandler) {
        return this._correctnessChangedMultiEvent.subscribe(handler);
    }

    unsubscribeCorrectnessChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._correctnessChangedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeValuesChangedEvent(handler: Scan.ValuesChangedEventHandler) {
        return this._valuesChangedMultiEvent.subscribe(handler);
    }

    unsubscribeValuesChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._valuesChangedMultiEvent.unsubscribe(subscriptionId);
    }

    subscribeDirectoryItemChangedEvent(handler: RankedDataIvemIdListDirectoryItem.ChangedEventHandler) {
        return this._directoryItemChangedMultiEvent.subscribe(handler);
    }

    unsubscribeDirectoryItemChangedEvent(subscriptionId: MultiEvent.SubscriptionId) {
        this._directoryItemChangedMultiEvent.unsubscribe(subscriptionId);
    }

    private applyDescriptorChanges(descriptor: ScanStatusedDescriptorInterface, changedFieldIds: readonly ScanStatusedDescriptor.FieldId[]) {
        this.beginChange();
        for (const fieldId of changedFieldIds) {
            switch (fieldId) {
                case ScanStatusedDescriptor.FieldId.Id:
                    if (descriptor.id !== this.id) {
                        throw new AssertInternalError('SHDCEI60153');
                    } else {
                        break
                    }
                case ScanStatusedDescriptor.FieldId.Name: {
                    const name = descriptor.name;
                    if (name !== this._name) {
                        this._name = name;
                        this._upperCaseName = name.toUpperCase();
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.Name,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.Description: {
                    const description = descriptor.description;
                    if (description !== this._description) {
                        this._description = description;
                        this._upperCaseDescription = description === undefined ? '' : description.toUpperCase();
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.Description,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.Readonly: {
                    const readonly = descriptor.readonly;
                    if (readonly !== this._readonly) {
                        this._readonly = readonly;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.Readonly,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.StatusId: {
                    const statusId = descriptor.statusId;
                    if (statusId !== this._statusId) {
                        this._statusId = statusId;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.StatusId,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.Enabled: {
                    const enabled = descriptor.enabled;
                    if (enabled !== this._enabled) {
                        this._enabled = enabled;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.Enabled,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.Version: {
                    const versionNumber = descriptor.versionNumber;
                    const versionId = descriptor.versionId;
                    const versioningInterrupted = descriptor.versioningInterrupted;
                    if (versionNumber !== this._versionNumber || versionId !== this._versionId || versioningInterrupted !== this._versioningInterrupted) {
                        this._versionNumber = versionNumber;
                        this._versionId = versionId;
                        this._versioningInterrupted = versioningInterrupted;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.Version,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.LastSavedTime: {
                    const lastSavedTime = descriptor.lastSavedTime;
                    if (isUndefinableDateEqual(lastSavedTime, this._lastSavedTime)) {
                        this._lastSavedTime = lastSavedTime;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.LastSavedTime,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.LastEditSessionId: {
                    const lastEditSessionId = descriptor.lastEditSessionId;
                    if (lastEditSessionId !== this._lastEditSessionId) {
                        this._lastEditSessionId = lastEditSessionId;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.LastEditSessionId,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.SymbolListEnabled: {
                    const symbolListEnabled = descriptor.symbolListEnabled;
                    if (symbolListEnabled !== this._symbolListEnabled) {
                        this._symbolListEnabled = symbolListEnabled;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.SymbolListEnabled,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.ZenithCriteriaSource: {
                    const zenithCriteriaSource = descriptor.zenithCriteriaSource;
                    if (zenithCriteriaSource !== this._zenithCriteriaSource) {
                        this._zenithCriteriaSource = zenithCriteriaSource;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.ZenithCriteriaSource,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                case ScanStatusedDescriptor.FieldId.ZenithRankSource: {
                    const zenithRankSource = descriptor.zenithRankSource;
                    if (zenithRankSource !== this._zenithRankSource) {
                        this._zenithRankSource = zenithRankSource;
                        const valueChange: Scan.ValueChange = {
                            fieldId: Scan.FieldId.ZenithRankSource,
                            recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                        };
                        this._valueChanges.push(valueChange);
                    }
                    break;
                }
                default:
                    throw new UnreachableCaseError('SHDCED60153', fieldId);
            }
        }
        this.endChange();
    }

    private notifyValuesChanged(valueChanges: Scan.ValueChange[]) {
        const valuesChangedHandlers = this._valuesChangedMultiEvent.copyHandlers();
        for (let index = 0; index < valuesChangedHandlers.length; index++) {
            valuesChangedHandlers[index](valueChanges);
        }

        const valueChangeCount = valueChanges.length;
        let directoryItemFieldIds: RankedDataIvemIdListDirectoryItem.FieldId[] | undefined;
        let directoryItemFieldIdCount = 0;
        for (let i = 0; i < valueChangeCount; i++) {
            const valueChange = valueChanges[i];
            const directoryItemFieldId = Scan.Field.idToDirectoryItemFieldId(valueChange.fieldId);
            if (directoryItemFieldId !== undefined) {
                directoryItemFieldIds ??= new Array<RankedDataIvemIdListDirectoryItem.FieldId>(valueChangeCount);
                directoryItemFieldIds[directoryItemFieldIdCount++] = directoryItemFieldId;
            }
        }

        if (directoryItemFieldIds !== undefined) {
            directoryItemFieldIds.length = directoryItemFieldIdCount;
            const directoryItemChangedHandlers = this._directoryItemChangedMultiEvent.copyHandlers();
            for (const handler of directoryItemChangedHandlers) {
                handler(directoryItemFieldIds);
            }
        }
    }

    private tryProcessFirstLock(): Promise<Result<void>> {
        return Promise.resolve(new Ok(undefined));
    }

    private processLastUnlock() {
        if (this._deleted) {
            this._deletedAndUnlockedEventer(this);
        }
    }

    private processFirstOpen(): void {
        this.wantDetail(false);
    }

    private processLastClose() {
        if (this._requireUnwantDetailOnLastCloseEventer()) {
            this.unwantDetail();
        }
    }

    private beginChange() {
        if (this._beginChangeCount++ === 0) {
            this._valueChanges.length = 0;
        }
    }

    private endChange() {
        if (--this._beginChangeCount === 0) {
            const changedFieldCount = this._valueChanges.length;
            if (changedFieldCount > 0) {
                const valueChanges = this._valueChanges.slice();
                this._valueChanges.length = 0;

                this.notifyValuesChanged(valueChanges);
            }
        }
    }

    private updateCorrectnessId() {
        let newCorrectnessId: CorrectnessId;
        if (!this._detailWanted || Correctness.idIsUnusable(this._listCorrectnessId)) {
            newCorrectnessId = this._listCorrectnessId;
        } else {
            newCorrectnessId = this._detailCorrectnessId;
        }

        if (newCorrectnessId !== this._correctnessId) {
            this._correctnessId = newCorrectnessId;

            const handlers = this._correctnessChangedMultiEvent.copyHandlers();
            for (const handler of handlers) {
                handler();
            }
        }
    }

    private wantDetail(forceUpdate: boolean) {
        this._detailWanted = true;
        if (!this._detailed || forceUpdate) {
            if (forceUpdate) {
                if (this._queryScanDetailDataItemIncubator.incubating) {
                    this._queryScanDetailDataItemIncubator.cancel();
                }
            }
            if (!this._queryScanDetailDataItemIncubator.incubating) {
                const dataDefinition = new QueryScanDetailDataDefinition();
                dataDefinition.scanId = this.id;
                const dataItemOrPromise = this._queryScanDetailDataItemIncubator.incubateSubcribe(dataDefinition);
                if (DataItemIncubator.isDataItem(dataItemOrPromise)) {
                    throw new AssertInternalError('SWDD40145'); // is query so cannot be cached
                } else {
                    dataItemOrPromise.then(
                        (dataItem) => {
                            if (dataItem !== undefined) { // ignore if undefined as cancelled
                                if (this._detailWanted) { // ignore if no longer want detail
                                    if (dataItem.error) {
                                        this._errorText = dataItem.errorText;
                                        this._detailCorrectnessId = dataItem.correctnessId;
                                        this.updateCorrectnessId();
                                    } else {
                                        this.beginChange();
                                        const descriptorAndDetail = dataItem.descriptorAndDetail;
                                        this.applyDescriptorChanges(descriptorAndDetail, ScanStatusedDescriptor.Field.allIds);
                                        this.applyDetail(descriptorAndDetail);
                                        this._detailed = true;
                                        this.endChange();
                                    }
                                }
                            }
                        },
                        (reason: unknown) => { throw AssertInternalError.createIfNotError(reason, 'SWDP40145', dataDefinition.scanId); }
                    )
                }
            }
        }
    }

    private unwantDetail() {
        if (this._detailWanted) {
            this._detailWanted = false;
            this._detailed = false;
            this.beginChange();
            this._detailCorrectnessId = CorrectnessId.Good;
            this.updateCorrectnessId();
            if (this._targetTypeId !== undefined) {
                this._targetTypeId = undefined;
                this._valueChanges.push({
                    fieldId: Scan.FieldId.TargetTypeId,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                });
            }
            if (this._targetMarkets !== undefined) {
                this._targetMarkets = undefined;
                this._valueChanges.push({
                    fieldId: Scan.FieldId.TargetMarkets,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                });
            }
            if (this._targetDataIvemIds !== undefined) {
                this._targetDataIvemIds = undefined;
                this._valueChanges.push({
                    fieldId: Scan.FieldId.TargetDataIvemIds,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                });
            }
            if (this._maxMatchCount !== undefined) {
                this._maxMatchCount = undefined;
                this._valueChanges.push({
                    fieldId: Scan.FieldId.MaxMatchCount,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                });
            }
            if (this._zenithCriteria !== undefined) {
                this._zenithCriteria = undefined;
                this._valueChanges.push({
                    fieldId: Scan.FieldId.ZenithCriteria,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                });
            }
            if (this._zenithRank !== undefined) {
                this._zenithRank = undefined;
                this._valueChanges.push({
                    fieldId: Scan.FieldId.ZenithRank,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                });
            }
            if (this._attachedNotificationChannels !== undefined) {
                this._attachedNotificationChannels = undefined;
                this._valueChanges.push({
                    fieldId: Scan.FieldId.AttachedNotificationChannels,
                    recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
                });
            }
            this.endChange();
        }
    }

    private applyDetail(detail: Partial<ScanDetail>) {
        this.beginChange();

        this._detailCorrectnessId = CorrectnessId.Good;
        this.updateCorrectnessId();

        const newTargetTypeId  = detail.targetTypeId;
        if (newTargetTypeId !== this._targetTypeId) {
            this._targetTypeId = newTargetTypeId;
            this._valueChanges.push({
                fieldId: Scan.FieldId.TargetTypeId,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
            });
        }
        const newTargetMarketIds = detail.targetMarkets;
        if (!isUndefinableArrayEqualUniquely(newTargetMarketIds, this._targetMarkets)) {
            this._targetMarkets = newTargetMarketIds;
            this._valueChanges.push({
                fieldId: Scan.FieldId.TargetMarkets,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
            });
        }
        const newTargetDataIvemIds = detail.targetDataIvemIds;
        if (!isUndefinableArrayEqualUniquely(newTargetDataIvemIds, this._targetDataIvemIds)) {
            this._targetDataIvemIds = newTargetDataIvemIds;
            this._valueChanges.push({
                fieldId: Scan.FieldId.TargetDataIvemIds,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
            });
        }
        const newMaxMatchCount = detail.maxMatchCount;
        if (newMaxMatchCount !== this._maxMatchCount) {
            this._maxMatchCount = newMaxMatchCount;
            this._valueChanges.push({
                fieldId: Scan.FieldId.MaxMatchCount,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
            });
        }
        const newZenithCriteria = detail.zenithCriteria;
        if (!isUndefinableStringNumberBooleanNestArrayEqual(newZenithCriteria, this._zenithCriteria)) {
            this._zenithCriteria = newZenithCriteria;
            this._valueChanges.push({
                fieldId: Scan.FieldId.ZenithCriteria,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
            });
        }
        const newZenithRank = detail.zenithRank;
        if (!isUndefinableStringNumberBooleanNestArrayEqual(newZenithRank, this._zenithRank)) {
            this._zenithRank = newZenithRank;
            this._valueChanges.push({
                fieldId: Scan.FieldId.ZenithRank,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
            });
        }
        const newAttachedNotificationChannels = detail.attachedNotificationChannels;
        if (!ScanAttachedNotificationChannel.isUndefinableArrayEqual(newAttachedNotificationChannels, this._attachedNotificationChannels)) {
            this._attachedNotificationChannels = newAttachedNotificationChannels;
            this._valueChanges.push({
                fieldId: Scan.FieldId.AttachedNotificationChannels,
                recentChangeTypeId: RevRecordValueRecentChangeTypeId.Update,
            });
        }

        this.endChange();
    }
}

export namespace Scan {
    export type CorrectnessChangedEventHandler = (this: void) => void;
    export type ValuesChangedEventHandler = (this: void, valueChanges: ValueChange[]) => void;
    export type OpenLockedEventHandler = (this: void, scan: Scan, opener: LockOpenListItem.Opener) => void;
    export type CloseLockedEventHandler = (this: void, scan: Scan, opener: LockOpenListItem.Opener) => void;
    export type GetListCorrectnessIdEventer = (this: void) => CorrectnessId;
    export type DeletedAndUnlockedEventer = (this: void, scan: Scan) => void;
    export type RequireUnwantDetailOnLastCloseEventer = (this: void) => boolean;

    export const enum CriterionId {
        PriceGreaterThanValue,
        PriceLessThanValue,
        TodayPriceIncreaseGreaterThanPercentage,
        TodayPriceDecreaseGreaterThanPercentage,
    }

    export namespace CriteriaType {
        export type Id = CriterionId;

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly displayId: StringId;
        }

        type InfosObject = { [id in keyof typeof CriterionId]: Info };

        const infosObject: InfosObject = {
            PriceGreaterThanValue: {
                id: CriterionId.PriceGreaterThanValue,
                name: 'PriceGreaterThanValue',
                displayId: StringId.ScanCriteriaTypeDisplay_PriceGreaterThanValue,
            },
            PriceLessThanValue: {
                id: CriterionId.PriceLessThanValue,
                name: 'PriceLessThanValue',
                displayId: StringId.ScanCriteriaTypeDisplay_PriceLessThanValue,
            },
            TodayPriceIncreaseGreaterThanPercentage: {
                id: CriterionId.TodayPriceIncreaseGreaterThanPercentage,
                name: 'TodayPriceIncreaseGreaterThanPercentage',
                displayId: StringId.ScanCriteriaTypeDisplay_TodayPriceIncreaseGreaterThanPercentage,
            },
            TodayPriceDecreaseGreaterThanPercentage: {
                id: CriterionId.TodayPriceDecreaseGreaterThanPercentage,
                name: 'TodayPriceDecreaseGreaterThanPercentage',
                displayId: StringId.ScanCriteriaTypeDisplay_TodayPriceDecreaseGreaterThanPercentage,
            },
        } as const;

        export const idCount = Object.keys(infosObject).length;
        const infos = Object.values(infosObject);

        export function initialise() {
            const outOfOrderIdx = infos.findIndex((info: Info, index: Integer) => info.id !== index as CriterionId);
            if (outOfOrderIdx >= 0) {
                throw new EnumInfoOutOfOrderError('Scan.CriterionId', outOfOrderIdx, infos[outOfOrderIdx].name);
            }
        }

        export function getAllIds() {
            return infos.map(info => info.id);
        }

        export function idToDisplayId(id: Id): StringId {
            return infos[id].displayId;
        }

        export function idToDisplay(id: Id): string {
            return Strings[idToDisplayId(id)];
        }
    }

    export const enum FieldId {
        Id,
        Readonly,
        Index,
        StatusId,
        Enabled,
        Name,
        Description,
        TargetTypeId,
        TargetMarkets,
        TargetDataIvemIds,
        MaxMatchCount,
        ZenithCriteria,
        ZenithRank,
        AttachedNotificationChannels,
        SymbolListEnabled,
        Version,
        LastSavedTime,
        LastEditSessionId,
        ZenithCriteriaSource,
        ZenithRankSource,
    }

    export namespace Field {
        export type Id = FieldId;

        export const allIds: readonly FieldId[] = [
            FieldId.Id,
            FieldId.Readonly,
            FieldId.Index,
            FieldId.StatusId,
            FieldId.Enabled,
            FieldId.Name,
            FieldId.Description,
            FieldId.TargetTypeId,
            FieldId.TargetMarkets,
            FieldId.TargetDataIvemIds,
            FieldId.MaxMatchCount,
            FieldId.ZenithCriteria,
            FieldId.ZenithRank,
            FieldId.AttachedNotificationChannels,
            FieldId.SymbolListEnabled,
            FieldId.Version,
            FieldId.LastSavedTime,
            FieldId.LastEditSessionId,
            FieldId.ZenithCriteriaSource,
            FieldId.ZenithRankSource,
        ];

        interface Info {
            readonly id: Id;
            readonly name: string;
            readonly dataTypeId: FieldDataTypeId;
            readonly headingId: StringId;
            readonly directoryItemFieldId: RankedDataIvemIdListDirectoryItem.FieldId | undefined;
        }

        type InfosObject = { [id in keyof typeof FieldId]: Info };

        const infosObject: InfosObject = {
            Id: {
                id: FieldId.Id,
                name: 'Id',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.ScanFieldHeading_Id,
                directoryItemFieldId: undefined,
            },
            Readonly: {
                id: FieldId.Readonly,
                name: 'Readonly',
                dataTypeId: FieldDataTypeId.Boolean,
                headingId: StringId.ScanFieldHeading_Readonly,
                directoryItemFieldId: RankedDataIvemIdListDirectoryItem.FieldId.Readonly,
            },
            Index: {
                id: FieldId.Index,
                name: 'Index',
                dataTypeId: FieldDataTypeId.Integer,
                headingId: StringId.ScanFieldHeading_Index,
                directoryItemFieldId: undefined,
            },
            StatusId: {
                id: FieldId.StatusId,
                name: 'StatusId',
                dataTypeId: FieldDataTypeId.Enumeration,
                headingId: StringId.ScanFieldHeading_StatusId,
                directoryItemFieldId: undefined,
            },
            Enabled: {
                id: FieldId.Enabled,
                name: 'Enabled',
                dataTypeId: FieldDataTypeId.Boolean,
                headingId: StringId.ScanFieldHeading_Enabled,
                directoryItemFieldId: undefined,
            },
            Name: {
                id: FieldId.Name,
                name: 'Name',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.ScanFieldHeading_Name,
                directoryItemFieldId: RankedDataIvemIdListDirectoryItem.FieldId.Name,
            },
            Description: {
                id: FieldId.Description,
                name: 'Description',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.ScanFieldHeading_Description,
                directoryItemFieldId: RankedDataIvemIdListDirectoryItem.FieldId.Description,
            },
            TargetTypeId: {
                id: FieldId.TargetTypeId,
                name: 'TargetTypeId',
                dataTypeId: FieldDataTypeId.Enumeration,
                headingId: StringId.ScanFieldHeading_TargetTypeId,
                directoryItemFieldId: undefined,
            },
            TargetMarkets: {
                id: FieldId.TargetMarkets,
                name: 'TargetMarkets',
                dataTypeId: FieldDataTypeId.EnumerationArray,
                headingId: StringId.ScanFieldHeading_TargetMarkets,
                directoryItemFieldId: undefined,
            },
            TargetDataIvemIds: {
                id: FieldId.TargetDataIvemIds,
                name: 'TargetDataIvemIds',
                dataTypeId: FieldDataTypeId.ObjectArray,
                headingId: StringId.ScanFieldHeading_TargetDataIvemIds,
                directoryItemFieldId: undefined,
            },
            MaxMatchCount: {
                id: FieldId.MaxMatchCount,
                name: 'MaxMatchCount',
                dataTypeId: FieldDataTypeId.Integer,
                headingId: StringId.ScanFieldHeading_MaxMatchCount,
                directoryItemFieldId: undefined,
            },
            ZenithCriteria: {
                id: FieldId.ZenithCriteria,
                name: 'ZenithCriteria',
                dataTypeId: FieldDataTypeId.Object,
                headingId: StringId.ScanFieldHeading_ZenithCriteria,
                directoryItemFieldId: undefined,
            },
            ZenithRank: {
                id: FieldId.ZenithRank,
                name: 'ZenithRank',
                dataTypeId: FieldDataTypeId.Object,
                headingId: StringId.ScanFieldHeading_ZenithRank,
                directoryItemFieldId: undefined,
            },
            AttachedNotificationChannels: {
                id: FieldId.AttachedNotificationChannels,
                name: 'AttachedNotificationChannels',
                dataTypeId: FieldDataTypeId.Object,
                headingId: StringId.ScanFieldHeading_AttachedNotificationChannels,
                directoryItemFieldId: undefined,
            },
            SymbolListEnabled: {
                id: FieldId.SymbolListEnabled,
                name: 'SymbolListEnabled',
                dataTypeId: FieldDataTypeId.Boolean,
                headingId: StringId.ScanFieldHeading_SymbolListEnabled,
                directoryItemFieldId: undefined,
            },
            Version: {
                id: FieldId.Version,
                name: 'Version',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.ScanFieldHeading_Version,
                directoryItemFieldId: undefined,
            },
            LastSavedTime: {
                id: FieldId.LastSavedTime,
                name: 'LastSavedTime',
                dataTypeId: FieldDataTypeId.DateTime,
                headingId: StringId.ScanFieldHeading_LastSavedTime,
                directoryItemFieldId: undefined,
            },
            LastEditSessionId: {
                id: FieldId.LastEditSessionId,
                name: 'LastEditSessionId',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.ScanFieldHeading_LastEditSessionId,
                directoryItemFieldId: undefined,
            },
            ZenithCriteriaSource: {
                id: FieldId.ZenithCriteriaSource,
                name: 'ZenithCriteriaSource',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.ScanFieldHeading_ZenithCriteriaSource,
                directoryItemFieldId: undefined,
            },
            ZenithRankSource: {
                id: FieldId.ZenithRankSource,
                name: 'ZenithRankSource',
                dataTypeId: FieldDataTypeId.String,
                headingId: StringId.ScanFieldHeading_ZenithRankSource,
                directoryItemFieldId: undefined,
            },
        } as const;

        const infos = Object.values(infosObject);
        export const idCount = infos.length;

        export function initialise() {
            for (let i = 0; i < idCount; i++) {
                const id = i as FieldId;
                if (allIds[i] !== id) {
                    throw new AssertInternalError('SFII43210', id.toString());
                } else {
                    const info = infos[i];
                    if (info.id !== id) {
                        throw new EnumInfoOutOfOrderError('Scan.FieldId', i, idToName(id));
                    }
                }
            }
        }

        export function idToName(id: Id) {
            return infos[id].name;
        }

        export function idToFieldDataTypeId(id: Id) {
            return infos[id].dataTypeId;
        }

        export function idToHeadingId(id: Id) {
            return infos[id].headingId;
        }

        export function idToHeading(id: Id) {
            return Strings[idToHeadingId(id)];
        }

        export function idToDirectoryItemFieldId(id: Id) {
            return infos[id].directoryItemFieldId;
        }
    }

    export class CriteriaTypeIdTextFormattableValue extends EnumTextFormattableValue {
        constructor(data: CriterionId | undefined) {
            super(data, TextFormattableValue.TypeId.ScanCriteriaTypeId);
        }
    }
    export class TargetTypeIdTextFormattableValue extends EnumTextFormattableValue {
        constructor(data: ScanTargetTypeId | undefined) {
            super(data, TextFormattableValue.TypeId.ScanTargetTypeId);
        }
    }

    export interface ValueChange {
        fieldId: FieldId;
        recentChangeTypeId: RevRecordValueRecentChangeTypeId;
    }

}

export namespace ScanModule {
    export function initialiseStatic() {
        Scan.Field.initialise();
        Scan.CriteriaType.initialise();
    }
}
