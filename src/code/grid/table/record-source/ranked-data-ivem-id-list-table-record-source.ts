import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { AdiService, RankedDataIvemId } from '../../../adi/internal-api';
import {
    DataIvemIdArrayRankedDataIvemIdListDefinition,
    DataIvemIdExecuteScanRankedDataIvemIdListDefinition,
    RankedDataIvemIdList,
    RankedDataIvemIdListDefinition,
    RankedDataIvemIdListFactoryService,
    ScanIdRankedDataIvemIdListDefinition
} from "../../../ranked-lit-ivem-id-list/internal-api";
import { TextFormatter } from '../../../services/internal-api';
import { SymbolDetailCacheService } from '../../../services/symbol-detail-cache-service';
import { AssertInternalError, CorrectnessBadness, ErrorCode, Integer, LockOpenListItem, NotImplementedError, Ok, Result, UnreachableCaseError } from '../../../sys/internal-api';
import {
    TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory
} from "../field-source/internal-api";
import { RankedDataIvemIdTableRecordDefinition } from '../record-definition/internal-api';
import { TableRecord } from '../record/internal-api';
import { DataIvemBaseDetailTableValueSource, RankedDataIvemIdTableValueSource, SecurityDataItemTableValueSource } from '../value-source/internal-api';
import { RankedDataIvemIdListTableRecordSourceDefinition, ScanTestTableRecordSourceDefinition, WatchlistTableRecordSourceDefinition } from './definition/internal-api';
import { PromisedDataIvemBaseDetail } from './promised-data-ivem-base-detail';
import { SubscribeBadnessListTableRecordSource } from './subscribe-badness-list-table-record-source';

export class RankedDataIvemIdListTableRecordSource extends SubscribeBadnessListTableRecordSource<RankedDataIvemId, RankedDataIvemIdList> {
    declare readonly _definition: RankedDataIvemIdListTableRecordSourceDefinition;
    private _lockedRankedDataIvemIdList: RankedDataIvemIdList;

    constructor(
        private readonly _adiService: AdiService,
        private readonly _symbolDetailCacheService: SymbolDetailCacheService,
        private readonly _rankedDataIvemIdListFactoryService: RankedDataIvemIdListFactoryService,
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: RankedDataIvemIdListTableRecordSourceDefinition,
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
            definition.allowedFieldSourceDefinitionTypeIds,
        );
    }

    get lockedRankedDataIvemIdList() { return this._lockedRankedDataIvemIdList; }

    override createDefinition(): RankedDataIvemIdListTableRecordSourceDefinition {
        const list = this._lockedRankedDataIvemIdList;
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (list === undefined) {
            throw new AssertInternalError('RLIILORCD50091');
        } else {
            const listDefinition = list.createDefinition();

            switch (listDefinition.typeId) {
                case RankedDataIvemIdListDefinition.TypeId.DataIvemIdExecuteScan:
                    if (listDefinition instanceof DataIvemIdExecuteScanRankedDataIvemIdListDefinition) {
                        return new ScanTestTableRecordSourceDefinition(
                            this.customHeadings,
                            this.tableFieldSourceDefinitionCachingFactory,
                            listDefinition,
                        );
                    } else {
                        throw new AssertInternalError('RLIILTRSCDLIIES44456', listDefinition.typeId.toString());
                    }
                case RankedDataIvemIdListDefinition.TypeId.ScanId:
                case RankedDataIvemIdListDefinition.TypeId.DataIvemIdArray:
                    return new WatchlistTableRecordSourceDefinition(
                        this.customHeadings,
                        this.tableFieldSourceDefinitionCachingFactory,
                        listDefinition as (DataIvemIdArrayRankedDataIvemIdListDefinition | ScanIdRankedDataIvemIdListDefinition),
                    );
                case RankedDataIvemIdListDefinition.TypeId.WatchmakerListId:
                    throw new NotImplementedError('RLIILTRSCDWLI44456');
                default:
                    throw new UnreachableCaseError('RLIILTRSCDD44456', listDefinition.typeId);
            }
        }
    }

    override async tryLock(locker: LockOpenListItem.Locker): Promise<Result<void>> {
        const rankedDataIvemIdList = this._rankedDataIvemIdListFactoryService.createFromDefinition(this._definition.rankedDataIvemIdListDefinition);
        const lockResult = await rankedDataIvemIdList.tryLock(locker);
        if (lockResult.isErr()) {
            return lockResult.createOuterResolvedPromise(ErrorCode.RankedDataIvemIdListTableRecordSource_TryLock);
        } else {
            this._lockedRankedDataIvemIdList = rankedDataIvemIdList;
            return new Ok(undefined);
        }
    }

    override unlock(locker: LockOpenListItem.Locker) {
        this._lockedRankedDataIvemIdList.unlock(locker);
        this._lockedRankedDataIvemIdList = undefined as unknown as RankedDataIvemIdList;
    }

    override createRecordDefinition(idx: Integer): RankedDataIvemIdTableRecordDefinition {
        const rankedDataIvemId = this._lockedRankedDataIvemIdList.getAt(idx);
        return {
            typeId: TableFieldSourceDefinition.TypeId.RankedDataIvemId,
            mapKey: RankedDataIvemIdTableRecordDefinition.createMapKey(rankedDataIvemId),
            rankedDataIvemId,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const rankedDataIvemId = this._lockedRankedDataIvemIdList.getAt(recordIndex);

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId = fieldSourceDefinition.typeId as RankedDataIvemIdListTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            if (this.allowedFieldSourceDefinitionTypeIds.includes(fieldSourceDefinitionTypeId)) {
                switch (fieldSourceDefinitionTypeId) {
                    case TableFieldSourceDefinition.TypeId.DataIvemBaseDetail: {
                        const dataIvemBaseDetail = new PromisedDataIvemBaseDetail(this._symbolDetailCacheService, rankedDataIvemId.dataIvemId);
                        const valueSource = new DataIvemBaseDetailTableValueSource(
                            result.fieldCount,
                            dataIvemBaseDetail,
                            rankedDataIvemId,
                        );
                        result.addSource(valueSource);
                        break;
                    }

                    case TableFieldSourceDefinition.TypeId.SecurityDataItem: {
                        const valueSource = new SecurityDataItemTableValueSource(result.fieldCount, rankedDataIvemId.dataIvemId, this._adiService);
                        result.addSource(valueSource);
                        break;
                    }
                    case TableFieldSourceDefinition.TypeId.RankedDataIvemId: {
                        const valueSource = new RankedDataIvemIdTableValueSource(result.fieldCount, rankedDataIvemId);
                        result.addSource(valueSource);
                        break;
                    }
                    default:
                        throw new UnreachableCaseError('LIITRSCTVK19909', fieldSourceDefinitionTypeId);
                }
            }
        }

        return result;
    }

    // override userCanAdd() {
    //     return this._lockedRankedDataIvemIdList.userCanAdd;
    // }

    // override userCanRemove() {
    //     return this._lockedRankedDataIvemIdList.userCanRemove;
    // }

    // override userCanMove() {
    //     return this._lockedRankedDataIvemIdList.userCanMove;
    // }

    // override userAdd(recordDefinition: RankedDataIvemIdTableRecordDefinition) {
    //     return this._lockedRankedDataIvemIdList.userAdd(recordDefinition.rankedDataIvemId.dataIvemId);
    // }

    // override userAddArray(recordDefinitions: RankedDataIvemIdTableRecordDefinition[]) {
    //     const dataIvemIds = recordDefinitions.map((definition) => definition.rankedDataIvemId.dataIvemId);
    //     this._lockedRankedDataIvemIdList.userAddArray(dataIvemIds);
    // }

    // override userRemoveAt(recordIndex: Integer, removeCount: Integer) {
    //     this._lockedRankedDataIvemIdList.userRemoveAt(recordIndex, removeCount);
    // }

    // override userMoveAt(fromIndex: Integer, moveCount: Integer, toIndex: Integer) {
    //     this._lockedRankedDataIvemIdList.userMoveAt(fromIndex, moveCount, toIndex);
    // }

    protected override getCount() { return this._lockedRankedDataIvemIdList.count; }

    protected override subscribeList(opener: LockOpenListItem.Opener) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedRankedDataIvemIdList === undefined) {
            throw new AssertInternalError('RLIILTRSOL75429')
        } else {
            this._lockedRankedDataIvemIdList.openLocked(opener);
            return this._lockedRankedDataIvemIdList;
        }
    }

    protected override unsubscribeList(opener: LockOpenListItem.Opener) {
        // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
        if (this._lockedRankedDataIvemIdList === undefined) {
            throw new AssertInternalError('RLIILTRSCL75429')
        } else {
            this._lockedRankedDataIvemIdList.closeLocked(opener);
        }
    }

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return this._definition.defaultFieldSourceDefinitionTypeIds;
    }
}
