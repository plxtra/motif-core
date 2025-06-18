import { DecimalFactory, Integer, NotImplementedError, UnreachableCaseError, UsableListChangeType, UsableListChangeTypeId, moveElementsInArray } from '@pbkware/js-utils';
import { RevSourcedFieldCustomHeadings } from 'revgrid';
import { AdiService, DataIvemBaseDetail, RankedDataIvemId } from '../../../adi';
import { TextFormatter } from '../../../services';
import { SymbolDetailCacheService } from '../../../services/symbol-detail-cache-service';
import { Badness, BadnessComparableList, CorrectnessBadness } from '../../../sys';
import {
    TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory
} from "../field-source/internal-api";
import { RankedDataIvemIdTableRecordDefinition } from '../record-definition/internal-api';
import { TableRecord } from '../record/internal-api';
import { DataIvemBaseDetailTableValueSource, RankedDataIvemIdTableValueSource, SecurityDataItemTableValueSource } from '../value-source/internal-api';
import {
    RankedDataIvemIdUsableListTableRecordSourceDefinition,
    TableRecordSourceDefinition
} from './definition/internal-api';
import { PromisedDataIvemBaseDetail } from './promised-data-ivem-base-detail';
import { UsableListTableRecordSource } from './usable-list-table-record-source';

export class RankedDataIvemIdUsableListTableRecordSource extends UsableListTableRecordSource<RankedDataIvemId> {
    declare readonly _definition: RankedDataIvemIdUsableListTableRecordSourceDefinition;
    declare readonly list: BadnessComparableList<RankedDataIvemId>;

    readonly records = new Array<RankedDataIvemIdUsableListTableRecordSource.Record>();

    constructor(
        private readonly _decimalFactory: DecimalFactory,
        private readonly _adiService: AdiService,
        private readonly _symbolDetailCacheService: SymbolDetailCacheService,
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: RankedDataIvemIdUsableListTableRecordSourceDefinition,
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
        );

        const list = this.list;
        if (!list.usable) {
            this.processListChange(UsableListChangeTypeId.Unusable, 0, list.count);
        } else {
            this.processListChange(UsableListChangeTypeId.Usable, 0, list.count);
        }
    }

    override createDefinition(): TableRecordSourceDefinition {
        throw new NotImplementedError('RLIIULTRS31311');
    }

    override createRecordDefinition(recordIdx: number): RankedDataIvemIdTableRecordDefinition {
        const record = this.records[recordIdx];
        const rankedDataIvemId = record.rankedDataIvemId.createCopy();
        return {
            typeId: TableFieldSourceDefinition.TypeId.RankedDataIvemId,
            mapKey: RankedDataIvemIdTableRecordDefinition.createMapKey(rankedDataIvemId),
            rankedDataIvemId,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const record = this.records[recordIndex];
        const rankedDataIvemId = record.rankedDataIvemId;

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId = fieldSourceDefinition.typeId as RankedDataIvemIdUsableListTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            if (this.allowedFieldSourceDefinitionTypeIds.includes(fieldSourceDefinitionTypeId)) {
                switch (fieldSourceDefinitionTypeId) {
                    case TableFieldSourceDefinition.TypeId.DataIvemBaseDetail: {
                        let dataIvemBaseDetail: DataIvemBaseDetail;
                        if (record.dataIvemBaseDetail !== undefined) {
                            dataIvemBaseDetail = record.dataIvemBaseDetail;
                        } else {
                            dataIvemBaseDetail = new PromisedDataIvemBaseDetail(this._symbolDetailCacheService, rankedDataIvemId.dataIvemId);
                            record.dataIvemBaseDetail = dataIvemBaseDetail;
                        }
                        const valueSource = new DataIvemBaseDetailTableValueSource(
                            result.fieldCount,
                            dataIvemBaseDetail,
                            this.list,
                        );
                        result.addSource(valueSource);
                        break;
                    }

                    case TableFieldSourceDefinition.TypeId.RankedDataIvemId: {
                        const valueSource = new RankedDataIvemIdTableValueSource(result.fieldCount, rankedDataIvemId);
                        result.addSource(valueSource);
                        break;
                    }

                    case TableFieldSourceDefinition.TypeId.SecurityDataItem: {
                        const valueSource = new SecurityDataItemTableValueSource(this._decimalFactory, this._adiService, result.fieldCount, rankedDataIvemId.dataIvemId);
                        result.addSource(valueSource);
                        break;
                    }

                    // AlternateCodesFix: Currently this actually is part of FullDetail.  Will be in BaseDetail in future
                    // case TypedTableFieldSourceDefinition.TypeId.DataIvemAlternateCodes: {
                    //     const altCodesSource =
                    //         new DataIvemAlternateCodesTableValueSource(
                    //             result.fieldCount,
                    //             dataIvemBaseDetail,
                    //             this.list
                    //         );
                    //     result.addSource(altCodesSource);
                    //     break;
                    // }
                    default:
                        throw new UnreachableCaseError('PLIBDFLIILTRS41032', fieldSourceDefinitionTypeId);
                }
            }
        }

        return result;
    }

    protected override getCount(): Integer {
        return this.records.length;
    }

    protected override getDefaultFieldSourceDefinitionTypeIds(): TableFieldSourceDefinition.TypeId[] {
        return this._definition.defaultFieldSourceDefinitionTypeIds;
    }

    protected override processListChange(listChangeTypeId: UsableListChangeTypeId, idx: number, count: number): void {
        switch (listChangeTypeId) {
            case UsableListChangeTypeId.Unusable:
                this.setUnusable(Badness.inactive); // hack - list does not support badness
                break;
            case UsableListChangeTypeId.PreUsableClear:
                this.records.length = 0;
                this.setUnusable(Badness.preUsableClear);
                break;
            case UsableListChangeTypeId.PreUsableAdd:
                this.insertRecordsFromList(idx, count);
                this.setUnusable(Badness.preUsableAdd);
                break;
            case UsableListChangeTypeId.Usable: {
                const recordCount = this.count;
                this.notifyListChange(UsableListChangeTypeId.PreUsableClear, 0, 0);
                this.notifyListChange(UsableListChangeTypeId.PreUsableAdd, 0, recordCount);
                this.setUsable(Badness.notBad);
                this.notifyListChange(UsableListChangeTypeId.Usable, 0, recordCount);
                break;
            }
            case UsableListChangeTypeId.Insert:
                this.insertRecordsFromList(idx, count);
                this.notifyListChange(UsableListChangeTypeId.Insert, idx, count);
                break;
            case UsableListChangeTypeId.BeforeReplace:
                this.notifyListChange(UsableListChangeTypeId.BeforeReplace, idx, count);
                break;
            case UsableListChangeTypeId.AfterReplace: {
                const afterRangeIndex = idx + count;
                for (let i = idx; i < afterRangeIndex; i++) {
                    this.records[i] = this.createRecordFromList(i);
                }
                this.notifyListChange(UsableListChangeTypeId.AfterReplace, idx, count);
                break;
            }
            case UsableListChangeTypeId.BeforeMove:
                this.notifyListChange(UsableListChangeTypeId.BeforeMove, idx, count);
                break;
            case UsableListChangeTypeId.AfterMove: {
                const moveParameters = UsableListChangeType.getMoveParameters(idx);
                moveElementsInArray(this.records, moveParameters.fromIndex, moveParameters.toIndex, moveParameters.count);
                this.notifyListChange(UsableListChangeTypeId.AfterMove, idx, count);
                break;
            }
            case UsableListChangeTypeId.Remove:
                this.records.splice(idx, count);
                this.notifyListChange(UsableListChangeTypeId.Remove, idx, count);
                break;
            case UsableListChangeTypeId.Clear:
                this.records.length = 0;
                this.notifyListChange(UsableListChangeTypeId.Clear, idx, count);
                break;
            default:
                throw new UnreachableCaseError('RTRSPLLC12487', listChangeTypeId);
        }
    }

    private insertRecordsFromList(idx: Integer, count: Integer) {
        const newRecords = new Array<RankedDataIvemIdUsableListTableRecordSource.Record>(count);
        for (let i = 0; i < count; i++) {
            newRecords[i] = this.createRecordFromList(idx + i);
        }
        this.records.splice(idx, 0, ...newRecords);
    }

    private createRecordFromList(index: Integer): RankedDataIvemIdUsableListTableRecordSource.Record {
        const rankedDataIvemId = this.list.getAt(index);
        return {
            rankedDataIvemId,
        };
    }
}

export namespace RankedDataIvemIdUsableListTableRecordSource {
    export interface Record {
        readonly rankedDataIvemId: RankedDataIvemId,
        dataIvemBaseDetail?: DataIvemBaseDetail;
    }
}
