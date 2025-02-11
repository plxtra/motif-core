import { AssertInternalError, Guid, IndexedRecord, Integer, LockOpenListItem, LockOpenManager, MapKey, Ok, Result, UnexpectedCaseError } from '@xilytix/sysutils';
import { AdiService } from '../adi/internal-api';
import { ScansService } from '../scan/internal-api';
import { ErrorCode } from "../sys/internal-api";
import { WatchmakerService } from '../watchmaker/watchmaker-service';
import { BaseRankedDataIvemIdList } from './base-ranked-data-ivem-id-list';
import { DataIvemIdArrayRankedDataIvemIdList } from './data-ivem-id-array-ranked-data-ivem-id-list';
import { DataIvemIdArrayRankedDataIvemIdListDefinition, RankedDataIvemIdListDefinition, ScanIdRankedDataIvemIdListDefinition, WatchmakerListIdRankedDataIvemIdListDefinition } from "./definition/internal-api";
import { ScanIdRankedDataIvemIdList } from './scan-id-ranked-data-ivem-id-list';
import { WatchmakerListIdRankedDataIvemIdList } from './watchmaker-list-id-ranked-data-ivem-id-list';

export class RankedDataIvemIdListReferential implements LockOpenListItem<RankedDataIvemIdListReferential>, IndexedRecord {
    readonly id: Guid;
    readonly typeId: RankedDataIvemIdListDefinition.TypeId;

    readonly name: string;
    readonly upperCaseName: string;
    readonly mapKey: MapKey;
    index: Integer;

    private readonly _lockOpenManager: LockOpenManager<RankedDataIvemIdListReferential>;

    private _unlockedDefinition: RankedDataIvemIdListDefinition | undefined;
    private _lockedList: BaseRankedDataIvemIdList | undefined;

    constructor(
        private readonly _adiService: AdiService,
        private readonly _scansService: ScansService,
        private readonly _watchmakerService: WatchmakerService,
        definition: RankedDataIvemIdListDefinition,
        name: string,
        initialIndex: Integer,
        private readonly _becameDirtyEventer: RankedDataIvemIdListReferential.BecameDirtyEventer,
    ) {
        this._lockOpenManager = new LockOpenManager<RankedDataIvemIdListReferential>(
            (locker) => this.tryProcessFirstLock(locker),
            (locker) => { this.processLastUnlock(locker); },
            (opener) => { this.processFirstOpen(opener); },
            (opener) => { this.processLastClose(opener); },
        );

        // this.id = definition.id;
        this.typeId = definition.typeId;
        this._unlockedDefinition = definition;

        this.name = name;
        this.upperCaseName = name.toUpperCase();
        this.index = initialIndex;
        this.mapKey = this.id;
    }

    get lockCount() { return this._lockOpenManager.lockCount; }
    get lockers(): readonly LockOpenListItem.Locker[] { return this._lockOpenManager.lockers; }
    get openCount() { return this._lockOpenManager.openCount; }
    get openers(): readonly LockOpenListItem.Opener[] { return this._lockOpenManager.openers; }

    get lockedList() { return this._lockedList; }

    createDefinition(): RankedDataIvemIdListDefinition {
        const list = this._lockedList;
        if (list === undefined) {
            throw new AssertInternalError('RLIILRCDU20281');
        } else {
            if (list.typeId !== this.typeId) {
                throw new AssertInternalError('RLIILRCDT20281');
            } else {
                return list.createDefinition();
            }
        }
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

    equals(other: RankedDataIvemIdListReferential): boolean {
        return this.mapKey === other.mapKey;
    }

    private async tryProcessFirstLock(locker: LockOpenListItem.Locker): Promise<Result<void>> {
        const definition = this._unlockedDefinition;
        if (definition === undefined) {
            throw new AssertInternalError('RLIILRTPFLU20281');
        } else {
            if (definition.typeId !== this.typeId) {
                throw new AssertInternalError('RLIILRTPFLUT20281');
            } else {
                const list = this.createList(definition);
                const lockResult = await list.tryLock(locker);
                if (lockResult.isErr()) {
                    return lockResult.createOuterResolvedPromise(ErrorCode.RankedDataIvemIdListReferential_LockListError);
                } else {
                    list.referentialTargettedModifiedEventer = () => { this.notifyDirty() };
                    this._lockedList = list;
                    this._unlockedDefinition = undefined;
                    return new Ok(undefined);
                }
            }
        }
    }

    private processLastUnlock(locker: LockOpenListItem.Locker): void {
        const lockedList = this._lockedList;
        if (lockedList === undefined) {
            throw new AssertInternalError('RLIILRPLU20281');
        } else {
            lockedList.referentialTargettedModifiedEventer = undefined;
            this._unlockedDefinition = lockedList.createDefinition();
            lockedList.unlock(locker);
            this._lockedList = undefined;
        }
    }

    private processFirstOpen(opener: LockOpenListItem.Opener): void {
        const lockedList = this._lockedList;
        if (lockedList === undefined) {
            throw new AssertInternalError('RLIILRPFO20281');
        } else {
            lockedList.openLocked(opener);
        }
    }

    private processLastClose(opener: LockOpenListItem.Opener): void {
        const lockedList = this._lockedList;
        if (lockedList === undefined) {
            throw new AssertInternalError('RLIILRPLC20281');
        } else {
            lockedList.closeLocked(opener);
        }
    }

    private notifyDirty() {
        this._becameDirtyEventer();
    }

    private createList(definition: RankedDataIvemIdListDefinition): BaseRankedDataIvemIdList {
        switch (this.typeId) {
            case RankedDataIvemIdListDefinition.TypeId.DataIvemIdArray: {
                if (!(definition instanceof DataIvemIdArrayRankedDataIvemIdListDefinition)) {
                    throw new AssertInternalError('RLIILRTPFLJ20281');
                } else {
                    return new DataIvemIdArrayRankedDataIvemIdList(definition);
                }
            }
            case RankedDataIvemIdListDefinition.TypeId.WatchmakerListId: {
                if (!(definition instanceof WatchmakerListIdRankedDataIvemIdListDefinition)) {
                    throw new AssertInternalError('RLIILRTPFLW20281');
                } else {
                    return new WatchmakerListIdRankedDataIvemIdList(this._watchmakerService, definition);
                }
            }
            case RankedDataIvemIdListDefinition.TypeId.ScanId: {
                if (!(definition instanceof ScanIdRankedDataIvemIdListDefinition)) {
                    throw new AssertInternalError('RLIILRTPFLSM20281');
                } else {
                    return new ScanIdRankedDataIvemIdList(this._adiService, this._scansService, definition);
                }
            }
            case RankedDataIvemIdListDefinition.TypeId.DataIvemIdExecuteScan: {
                if (!(definition instanceof ScanIdRankedDataIvemIdListDefinition)) {
                    throw new AssertInternalError('RLIILRTPFLSM20281');
                } else {
                    return new ScanIdRankedDataIvemIdList(this._adiService, this._scansService, definition);
                }
            }
            default: {
                throw new UnexpectedCaseError('RLIILRTPFLD20281', this.typeId);
            }
        }
    }
}

/** @public */
export namespace RankedDataIvemIdListReferential {
    export type BecameDirtyEventer = (this: void) => void;
}
