import { AssertInternalError, Err, Integer, LockOpenListItem, Ok, Result } from '@pbkware/js-utils';
import { DataIvemId, RankScoredDataIvemIdList } from '../adi';
import { ErrorCode } from "../sys";
import { WatchmakerList, WatchmakerService } from '../watchmaker';
import { BaseRankedDataIvemIdList } from './base-ranked-data-ivem-id-list';
import { WatchmakerListIdRankedDataIvemIdListDefinition } from './definition/internal-api';

export class WatchmakerListIdRankedDataIvemIdList extends BaseRankedDataIvemIdList {
    declare protected _lockedScoredList: WatchmakerList;

    private readonly _watchmakerListId: string;

    constructor(
        private readonly _watchmakerService: WatchmakerService,
        definition: WatchmakerListIdRankedDataIvemIdListDefinition,
    ) {
        super(definition.typeId, true, false, true, true);
        this._watchmakerListId = definition.watchmakerListId;
    }

    override get name() {
        // const lockedScan = this._lockedScan;
        // if (lockedScan === undefined) {
        //     throw new AssertInternalError('SMSRLIILGN2085');
        // } else {
        //     return lockedScan.name;
        // }
        return this._lockedScoredList.name;
    }

    override get description() {
        // const lockedScan = this._lockedScan;
        // if (lockedScan === undefined) {
        //     throw new AssertInternalError('SMSRLIILGD20091');
        // } else {
        //     return lockedScan.description;
        // }
        return this._lockedScoredList.description ?? '';
    }

    override get category() {
        // const lockedScan = this._lockedScan;
        // if (lockedScan === undefined) {
        //     throw new AssertInternalError('SMSRLIILGD20091');
        // } else {
        //     return '';
        // }
        return this._lockedScoredList.category ?? '';
    }

    createDefinition(): WatchmakerListIdRankedDataIvemIdListDefinition {
        return new WatchmakerListIdRankedDataIvemIdListDefinition('' /*this._scanId*/);
    }

    override async tryLock(locker: LockOpenListItem.Locker): Promise<Result<void>> {
        const watchmakerListId = this._watchmakerListId;
        const serviceItemLockResult = await this._watchmakerService.tryLockItemByKey(watchmakerListId, locker);
        if (serviceItemLockResult.isErr()) {
            return serviceItemLockResult.createOuter(ErrorCode.WatchmakerListIdRankDataIvemIdList_TryLock);
        } else {
            const watchmakerList = serviceItemLockResult.value;
            if (watchmakerList === undefined) {
                return new Err(`${ErrorCode.WatchmakerListIdRankDataIvemIdList_ScanIdNotFound}: ${watchmakerListId}`);
            } else {
                this._lockedScoredList = watchmakerList;
                return Ok.createResolvedPromise(undefined);
            }
        }
    }

    override unlock(locker: LockOpenListItem.Locker) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('WSRLIILU26997');
        } else {
            this._watchmakerService.unlockItem(this._lockedScoredList, locker);
            this._lockedScoredList = undefined as unknown as WatchmakerList;
        }
    }

    override subscribeRankScoredDataIvemIdList(): RankScoredDataIvemIdList {
        return this._lockedScoredList;
    }

    override unsubscribeRankScoredDataIvemIdList(): void {
        // nothing to do
    }

    override userAdd(dataIvemId: DataIvemId): Integer {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('WSRLIIL22987');
        } else {
            return this._lockedScoredList.initiateAddTo([dataIvemId]);
        }
    }

    override userAddArray(dataIvemIds: DataIvemId[]): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIUAA31314');
        } else {
            this._lockedScoredList.initiateAddTo(dataIvemIds);
        }
    }

    override userReplaceAt(index: Integer, dataIvemIds: DataIvemId[]): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIURPA31314');
        } else {
            this._lockedScoredList.initiateReplaceAt(index, dataIvemIds);
        }
    }

    override userRemoveAt(index: Integer, count: Integer): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIURMA31314');
        } else {
            this._lockedScoredList.initiateRemoveAt(index, count);
        }
    }

    override userMoveAt(fromIndex: Integer, count: Integer, toIndex: Integer): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIUMA31314');
        } else {
            this._lockedScoredList.initiateMoveAt(fromIndex, count, toIndex);
        }
    }

    set(dataIvemIds: DataIvemId[]): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIS31314');
        } else {
            this._lockedScoredList.initiateSetMembers(dataIvemIds);
        }
    }

}
