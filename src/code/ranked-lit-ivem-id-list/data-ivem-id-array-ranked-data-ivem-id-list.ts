import { DataIvemId, RankScoredDataIvemIdList } from '../adi/internal-api';
import {
    AssertInternalError, Integer
} from "../sys/internal-api";
import { BaseRankedDataIvemIdList } from './base-ranked-data-ivem-id-list';
import {
    DataIvemIdArrayRankedDataIvemIdListDefinition
} from "./definition/internal-api";
import { IndexRankScoredDataIvemIdList } from './index-rank-scored-data-ivem-id-list';

export class DataIvemIdArrayRankedDataIvemIdList extends BaseRankedDataIvemIdList {
    readonly name: string;
    readonly description: string;
    readonly category: string;

    declare protected _lockedScoredList: IndexRankScoredDataIvemIdList;
    private readonly _initialDataIvemIds: readonly DataIvemId[];

    constructor(definition: DataIvemIdArrayRankedDataIvemIdListDefinition) {
        super(definition.typeId, true, true, true, true);
        this.name = definition.name;
        this.description = definition.description;
        this.category = definition.category;
        this._initialDataIvemIds = definition.dataIvemIds;
    }

    override createDefinition(): DataIvemIdArrayRankedDataIvemIdListDefinition {
        const dataIvemIds = this.getDataIvemIds().slice();
        return new DataIvemIdArrayRankedDataIvemIdListDefinition(this.name, this.description, this.category, dataIvemIds);
    }

    override subscribeRankScoredDataIvemIdList(): RankScoredDataIvemIdList {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList !== undefined) {
            // cannot open more than once
            throw new AssertInternalError('ERLIILISRSLIISL31314');
        } else {
            this._lockedScoredList = new IndexRankScoredDataIvemIdList(
                this._initialDataIvemIds,
                () => { this.notifySourceListModified() },
            );
            return this._lockedScoredList;
        }
    }

    override unsubscribeRankScoredDataIvemIdList(): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIURSLIISL31314');
        } else {
            this._lockedScoredList = undefined as unknown as IndexRankScoredDataIvemIdList;
        }
    }

    override userAdd(dataIvemId: DataIvemId): Integer {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIUA31314');
        } else {
            return this._lockedScoredList.add(dataIvemId);
        }
    }

    override userAddArray(dataIvemIds: DataIvemId[]): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIUAA31314');
        } else {
            this._lockedScoredList.addArray(dataIvemIds);
        }
    }

    override userReplaceAt(index: Integer, dataIvemIds: DataIvemId[]): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIURPA31314');
        } else {
            this._lockedScoredList.replaceAt(index, dataIvemIds);
        }
    }

    override userRemoveAt(index: Integer, count: Integer): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIURMA31314');
        } else {
            this._lockedScoredList.removeAt(index, count);
        }
    }

    override userMoveAt(fromIndex: Integer, count: Integer, toIndex: Integer): void {
        throw new Error('Method not implemented.');
    }

    set(dataIvemIds: DataIvemId[]): void {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIS31314');
        } else {
            this._lockedScoredList.set(dataIvemIds);
        }
    }

    private notifySourceListModified() {
        if (this.referentialTargettedModifiedEventer !== undefined) {
            this.referentialTargettedModifiedEventer();
        }
    }

    private getDataIvemIds() {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedScoredList === undefined) {
            throw new AssertInternalError('ERLIILIGLII31314')
        } else {
            return this._lockedScoredList.dataIvemIds;
        }
    }
}

export namespace DataIvemIdArrayRankedDataIvemIdList {
    export type ModifiedEventer = (this: void) => void;
}
