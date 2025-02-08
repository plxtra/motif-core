import { DataIvemId } from '../adi/internal-api';
import { RankedDataIvemId } from '../adi/scan/ranked-data-ivem-id';
import { BadnessList, Integer, LockOpenListItem, Result } from '../sys/internal-api';
import { RankedDataIvemIdListDefinition } from './definition/ranked-data-ivem-id-list-definition';

/** @public */
export interface RankedDataIvemIdList extends BadnessList<RankedDataIvemId> {
    readonly typeId: RankedDataIvemIdListDefinition.TypeId;

    readonly name: string;
    readonly description: string;
    readonly category: string;

    readonly userCanAdd: boolean;
    readonly userCanReplace: boolean;
    readonly userCanRemove: boolean;
    readonly userCanMove: boolean;

    createDefinition(): RankedDataIvemIdListDefinition;

    tryLock(_locker: LockOpenListItem.Locker): Promise<Result<void>>;
    unlock(_locker: LockOpenListItem.Locker): void;

    openLocked(opener: LockOpenListItem.Opener): void;
    closeLocked(opener: LockOpenListItem.Opener): void;

    userAdd(dataIvemId: DataIvemId): Integer;
    userAddArray(dataIvemId: DataIvemId[]): void;
    userReplaceAt(index: Integer, dataIvemId: DataIvemId[]): void;
    userRemoveAt(index: Integer, count: Integer): void;
    userMoveAt(fromIndex: Integer, count: Integer, toIndex: Integer): void;
}
