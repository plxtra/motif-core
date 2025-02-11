import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { Integer, UnreachableCaseError } from '@xilytix/sysutils';
import { AdiService, DataIvemId } from '../../../adi/internal-api';
import { SymbolDetailCacheService, TextFormatter } from '../../../services/internal-api';
import { CorrectnessBadness, UiComparableList } from '../../../sys/internal-api';
import {
    TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory
} from "../field-source/internal-api";
import { DataIvemIdTableRecordDefinition } from '../record-definition/internal-api';
import { TableRecord } from '../record/internal-api';
import { DataIvemBaseDetailTableValueSource, DataIvemIdTableValueSource, SecurityDataItemTableValueSource } from '../value-source/internal-api';
import { BadnessListTableRecordSource } from './badness-list-table-record-source';
import { DataIvemIdComparableListTableRecordSourceDefinition } from './definition/internal-api';
import { PromisedDataIvemBaseDetail } from './promised-data-ivem-base-detail';

export class DataIvemIdComparableListTableRecordSource extends BadnessListTableRecordSource<DataIvemId> {
    declare readonly _definition: DataIvemIdComparableListTableRecordSourceDefinition;
    declare readonly list: UiComparableList<DataIvemId>;

    constructor(
        private readonly _adiService: AdiService,
        private readonly _symbolDetailCacheService: SymbolDetailCacheService,
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: DataIvemIdComparableListTableRecordSourceDefinition,
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

    override get recordList() { return super.recordList as UiComparableList<DataIvemId>; }

    override createDefinition(): DataIvemIdComparableListTableRecordSourceDefinition {
        const list = this.list.clone();
        return new DataIvemIdComparableListTableRecordSourceDefinition(
            this.customHeadings,
            this.tableFieldSourceDefinitionCachingFactory,
            list,
        );
    }

    override createRecordDefinition(idx: Integer): DataIvemIdTableRecordDefinition {
        const dataIvemId = this.list.getAt(idx);
        return {
            typeId: TableFieldSourceDefinition.TypeId.DataIvemId,
            mapKey: dataIvemId.mapKey,
            dataIvemId,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const dataIvemId = this.list.getAt(recordIndex);

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId = fieldSourceDefinition.typeId as DataIvemIdComparableListTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            if (this.allowedFieldSourceDefinitionTypeIds.includes(fieldSourceDefinitionTypeId)) {
                switch (fieldSourceDefinitionTypeId) {
                    case TableFieldSourceDefinition.TypeId.DataIvemBaseDetail: {
                        const dataIvemBaseDetail = new PromisedDataIvemBaseDetail(this._symbolDetailCacheService, dataIvemId);
                        const valueSource = new DataIvemBaseDetailTableValueSource(
                            result.fieldCount,
                            dataIvemBaseDetail,
                            this.list,
                        );
                        result.addSource(valueSource);
                        break;
                    }

                    case TableFieldSourceDefinition.TypeId.SecurityDataItem: {
                        const valueSource = new SecurityDataItemTableValueSource(result.fieldCount, dataIvemId, this._adiService);
                        result.addSource(valueSource);
                        break;
                    }
                    case TableFieldSourceDefinition.TypeId.DataIvemId: {
                        const valueSource = new DataIvemIdTableValueSource(result.fieldCount, dataIvemId);
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

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return DataIvemIdComparableListTableRecordSourceDefinition.defaultFieldSourceDefinitionTypeIds;
    }
}
