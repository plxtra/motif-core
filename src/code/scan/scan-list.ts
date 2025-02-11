import { AssertInternalError, Integer, MultiEvent, UnreachableCaseError, UsableListChangeTypeId } from '@xilytix/sysutils';
import { AdiService, ScanDescriptorsDataDefinition, ScanStatusedDescriptor, ScanStatusedDescriptorsDataItem } from '../adi/internal-api';
import { RankedDataIvemIdListDirectoryItem } from '../services/ranked-data-ivem-id-list-directory-item';
import { Badness, ErrorCode, LockOpenList, ZenithDataError } from '../sys/internal-api';
import { Scan } from './scan';

export class ScanList extends LockOpenList<Scan, RankedDataIvemIdListDirectoryItem> {
    private _scanDescriptorsDataItem: ScanStatusedDescriptorsDataItem;
    private _scanDescriptorsDataItemListChangeEventSubscriptionId: MultiEvent.SubscriptionId;
    private _scanDescriptorsDataItemCorrectnessChangedSubscriptionId: MultiEvent.SubscriptionId;

    private _scanChangeMultiEvent = new MultiEvent<ScanList.RecordChangeEventHandler>();
    private _suspendUnwantDetailOnScanLastCloseCount = 0;

    constructor(private readonly _adiService: AdiService) {
        super();
    }

    initialise() {
        const scansDefinition = new ScanDescriptorsDataDefinition();
        this._scanDescriptorsDataItem = this._adiService.subscribe(scansDefinition) as ScanStatusedDescriptorsDataItem;
        this._scanDescriptorsDataItemListChangeEventSubscriptionId = this._scanDescriptorsDataItem.subscribeListChangeEvent(
            (listChangeTypeId, index, count) => { this.processScansListChange(listChangeTypeId, index, count) }
        );
        this._scanDescriptorsDataItemCorrectnessChangedSubscriptionId = this._scanDescriptorsDataItem.subscribeCorrectnessChangedEvent(
            () => { this.processDescriptorsDataItemCorrectnessChangedEvent(); }
        );

        this.processDescriptorsDataItemCorrectnessChangedEvent();

        if (this._scanDescriptorsDataItem.usable) {
            const count = this._scanDescriptorsDataItem.count;
            if (count > 0) {
                this.processScansListChange(UsableListChangeTypeId.PreUsableAdd, 0, count);
            }
            this.processScansListChange(UsableListChangeTypeId.Usable, 0, 0);
        } else {
            this.processScansListChange(UsableListChangeTypeId.Unusable, 0, 0);
        }
    }

    override finalise() {
        this._scanDescriptorsDataItem.unsubscribeCorrectnessChangedEvent(this._scanDescriptorsDataItemCorrectnessChangedSubscriptionId);
        this._scanDescriptorsDataItemCorrectnessChangedSubscriptionId = undefined;
        this._scanDescriptorsDataItem.unsubscribeListChangeEvent(this._scanDescriptorsDataItemListChangeEventSubscriptionId);
        this._scanDescriptorsDataItemListChangeEventSubscriptionId = undefined;
        this._adiService.unsubscribe(this._scanDescriptorsDataItem);
        this._scanDescriptorsDataItem = undefined as unknown as ScanStatusedDescriptorsDataItem;

        super.finalise();
    }

    override clone(): ScanList {
        const result = new ScanList(this._adiService);
        result.assign(this);
        return result;
    }

    suspendUnwantDetailOnScanLastClose() {
        this._suspendUnwantDetailOnScanLastCloseCount++;
    }

    unsuspendUnwantDetailOnScanLastClose() {
        if (--this._suspendUnwantDetailOnScanLastCloseCount === 0) {
            this.unwantDetailOnClosedScans();
        }
    }

    protected override assign(other: LockOpenList<Scan, RankedDataIvemIdListDirectoryItem>) {
        super.assign(other);
    }

    private processDescriptorsDataItemCorrectnessChangedEvent() {
        const correctnessId = this._scanDescriptorsDataItem.correctnessId;
        const count = this.count;
        for (let i = 0; i < count; i++) {
            const scan = this.getAt(i);
            scan.setListCorrectness(correctnessId);
        }
    }

    private processScansListChange(listChangeTypeId: UsableListChangeTypeId, index: Integer, count: Integer) {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                break;
            case UsableListChangeTypeId.PreUsableClear: {
                const listCount = this.count;
                for (let i = 0; i < listCount; i++) {
                    const scan = this.getAt(i);
                    scan.existenceVerified = false;
                }
                break;
            }
            case UsableListChangeTypeId.PreUsableAdd: {
                const addedScans = new Array<Scan>(count);
                let addedCount = 0;
                // Merge with existing.  If a scan already exists, update and mark existenceVerified
                const afterRangeIndex = index + count;
                for (let i = index; i < afterRangeIndex; i++) {
                    const descriptor = this._scanDescriptorsDataItem.getAt(i);
                    const scanId = descriptor.id;
                    let scan = this.getItemByKey(scanId);
                    if (scan !== undefined) {
                        scan.existenceVerified = true;
                    } else {
                        scan = this.createScan(descriptor);
                        addedScans[addedCount++] = scan;
                    }
                }
                if (addedCount > 0) {
                    this.addSubRange(addedScans, 0, addedCount);
                }
                break;
            }
            case UsableListChangeTypeId.Usable: {
                for (let i = this.count - 1; i >= 0; i--) {
                    const scan = this.getAt(i);
                    if (!scan.existenceVerified) {
                        this.removeAtIndex(i);
                    }
                }
                this.setUsable(Badness.notBad);
                break;
            }
            case UsableListChangeTypeId.Insert: {
                const insertScans = new Array<Scan>(count);
                let insertCount = 0;
                const afterRangeIndex = index + count;
                for (let i = index; i < afterRangeIndex; i++) {
                    const descriptor = this._scanDescriptorsDataItem.getAt(i);
                    const scanId = descriptor.id;
                    let scan = this.getItemByKey(scanId);
                    if (scan !== undefined) {
                        throw new ZenithDataError(ErrorCode.ScanList_InsertAlreadyExistingScan, scanId);
                    } else {
                        scan = this.createScan(descriptor);
                        insertScans[insertCount++] = scan;
                    }
                }
                this.addRange(insertScans);
                break;
            }
            case UsableListChangeTypeId.BeforeReplace:
                throw new AssertInternalError('SLPSLCBR45094');
            case UsableListChangeTypeId.AfterReplace:
                throw new AssertInternalError('SLPSLCAR45094');
            case UsableListChangeTypeId.BeforeMove:
                throw new AssertInternalError('SLPSLCBM45094');
            case UsableListChangeTypeId.AfterMove:
                throw new AssertInternalError('SLPSLCAM45094');
            case UsableListChangeTypeId.Remove:
                this.deleteScans(index, count);
                break;
            case UsableListChangeTypeId.Clear: {
                const listCount = this.count;
                if (listCount > 0) {
                    this.deleteScans(0, listCount);
                }
                break;
            }
            default:
                throw new UnreachableCaseError('SSPSLCD30871', listChangeTypeId);
        }
    }

    private createScan(descriptor: ScanStatusedDescriptor) {
        return new Scan(
            this._adiService,
            descriptor,
            this.correctnessId,
            () => this.requireUnwantDetailOnScanLastClose(),
            (aScanId) => { this.remove(aScanId); },
        );
    }

    private deleteScans(listIndex: Integer, count: Integer) {
        let blockLastIndex: Integer | undefined;
        for (let i = listIndex + count - 1; i >= listIndex; i--) {
            const toBeRemoved = !this.isItemAtIndexLocked(i, undefined);
            if (toBeRemoved) {
                const scan = this.getAt(i);
                scan.finalise();

                if (blockLastIndex === undefined) {
                    blockLastIndex = i;
                }
            } else {
                if (blockLastIndex !== undefined) {
                    const index = i + 1;
                    const blockLength = blockLastIndex - i;
                    this.removeRange(index, blockLength);
                    blockLastIndex = undefined;
                }
            }
        }

        if (blockLastIndex !== undefined) {
            const index = 0;
            const blockLength = blockLastIndex + 1;
            this.removeRange(index, blockLength);
        }
    }

    private requireUnwantDetailOnScanLastClose() {
        return this._suspendUnwantDetailOnScanLastCloseCount === 0;
    }

    private unwantDetailOnClosedScans() {
        const count = this.count;
        for (let i = 0; i < count; i++) {
            const scan = this.getAt(i);
            scan.unwantDetailIfClosed();
        }
    }
}

export namespace ScanList {
    export type RecordChangeEventHandler = (this: void, index: Integer) => void;
}
