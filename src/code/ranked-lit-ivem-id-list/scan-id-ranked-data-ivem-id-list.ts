import { AssertInternalError, Err, LockOpenListItem, Ok, Result } from '@pbkware/js-utils';
import { AdiService, DataIvemIdMatchesDataDefinition, DataIvemIdScanMatchesDataItem, RankScoredDataIvemIdList } from '../adi/internal-api';
import { Scan, ScanList, ScansService } from '../scan/internal-api';
import { ErrorCode } from "../sys/internal-api";
import { BaseRankedDataIvemIdList } from './base-ranked-data-ivem-id-list';
import { ScanIdRankedDataIvemIdListDefinition } from './definition/internal-api';

export class ScanIdRankedDataIvemIdList extends BaseRankedDataIvemIdList {
    private readonly _scanId: string;
    private readonly _scanList: ScanList;

    private _lockedScan: Scan | undefined;
    private _dataItem: DataIvemIdScanMatchesDataItem | undefined;

    constructor(
        private readonly _adiService: AdiService,
        private readonly _scansService: ScansService,
        definition: ScanIdRankedDataIvemIdListDefinition,
    ) {
        super(definition.typeId, false, false, false, false);
        this._scanList = this._scansService.scanList;
        this._scanId = definition.scanId;
    }

    override get name() {
        const lockedScan = this._lockedScan;
        if (lockedScan === undefined) {
            throw new AssertInternalError('SMSRLIILGN2085');
        } else {
            return lockedScan.name;
        }
    }

    override get description() {
        const lockedScan = this._lockedScan;
        if (lockedScan === undefined) {
            throw new AssertInternalError('SMSRLIILGD20091');
        } else {
            const description = lockedScan.description;
            return description ?? '';
        }
    }

    override get category() {
        const lockedScan = this._lockedScan;
        if (lockedScan === undefined) {
            throw new AssertInternalError('SMSRLIILGD20091');
        } else {
            return '';
        }
    }

    createDefinition(): ScanIdRankedDataIvemIdListDefinition {
        return new ScanIdRankedDataIvemIdListDefinition(this._scanId);
    }

    override async tryLock(locker: LockOpenListItem.Locker): Promise<Result<void>> {
        const scanId = this._scanId;
        const itemLockResult = await this._scanList.tryLockItemByKey(this._scanId, locker);
        if (itemLockResult.isErr()) {
            return itemLockResult.createOuter(ErrorCode.ScanIdRankedDataIvemIdList_TryLock);
        } else {
            const scan = itemLockResult.value;
            if (scan === undefined) {
                return new Err(`${ErrorCode.ScanIdRankedDataIvemIdList_ScanIdNotFound}: ${scanId}`);
            } else {
                this._lockedScan = scan;
                return new Ok(undefined);
            }
        }
    }

    override unlock(locker: LockOpenListItem.Locker) {
        if (this._lockedScan === undefined) {
            throw new AssertInternalError('SMLIILU26997');
        } else {
            this._scanList.unlockItem(this._lockedScan, locker);
            this._lockedScan = undefined;
        }
    }

    override subscribeRankScoredDataIvemIdList(): RankScoredDataIvemIdList {
        if (this._dataItem !== undefined) {
            // cannot open more than once
            throw new AssertInternalError('SMSRLIILSRSLIISLD31313');
        } else {
            const lockedScan = this._lockedScan;
            if (lockedScan === undefined) {
                throw new AssertInternalError('SMSRLIILSRSLIISLL31313');
            } else {
                const scanId = lockedScan.id;
                const dataDefinition = new DataIvemIdMatchesDataDefinition();
                dataDefinition.scanId = scanId;
                this._dataItem = this._adiService.subscribe(dataDefinition) as DataIvemIdScanMatchesDataItem;
                return this._dataItem;
            }
        }
    }

    override unsubscribeRankScoredDataIvemIdList(): void {
        if (this._dataItem === undefined) {
            throw new AssertInternalError('SMRLIUILIURSLIISL31313');
        } else {
            this._adiService.unsubscribe(this._dataItem);
            this._dataItem = undefined;
        }
    }
}
