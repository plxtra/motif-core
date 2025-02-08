import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { RankedDataIvemIdListDirectory } from '../../../ranked-lit-ivem-id-list/internal-api';
import { RankedDataIvemIdListDirectoryItem, TextFormatter } from '../../../services/internal-api';
import { CorrectnessBadness, Integer, LockOpenListItem, UnreachableCaseError } from '../../../sys/internal-api';
import {
    TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory
} from "../field-source/internal-api";
import { RankedDataIvemIdListDirectoryItemTableRecordDefinition } from '../record-definition/internal-api';
import { TableRecord } from '../record/internal-api';
import { RankedDataIvemIdListDirectoryItemTableValueSource } from '../value-source/internal-api';
import { RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition } from './definition/internal-api';
import { SubscribeBadnessListTableRecordSource } from './subscribe-badness-list-table-record-source';

export class RankedDataIvemIdListDirectoryItemTableRecordSource extends SubscribeBadnessListTableRecordSource<RankedDataIvemIdListDirectoryItem, RankedDataIvemIdListDirectory> {
    private readonly _listDirectory: RankedDataIvemIdListDirectory;

    constructor(
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition,
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
            RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );

        this._listDirectory = definition.listDirectory;
    }

    override createDefinition(): RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition {
        return new RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition(
            this.customHeadings,
            this.tableFieldSourceDefinitionCachingFactory,
            this._listDirectory,
        );
    }

    override createRecordDefinition(idx: Integer): RankedDataIvemIdListDirectoryItemTableRecordDefinition {
        const rankedDataIvemIdListDirectoryItem = this._listDirectory.getAt(idx);
        return {
            typeId: TableFieldSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem,
            mapKey: RankedDataIvemIdListDirectoryItem.createMapKey(rankedDataIvemIdListDirectoryItem),
            record: rankedDataIvemIdListDirectoryItem,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const rankedDataIvemIdListDirectoryItem = this._listDirectory.getAt(recordIndex);

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId =
                fieldSourceDefinition.typeId as RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            switch (fieldSourceDefinitionTypeId) {
                case TableFieldSourceDefinition.TypeId.RankedDataIvemIdListDirectoryItem: {
                    const valueSource = new RankedDataIvemIdListDirectoryItemTableValueSource(result.fieldCount, rankedDataIvemIdListDirectoryItem);
                    result.addSource(valueSource);
                    break;
                }
                default:
                    throw new UnreachableCaseError('RLIILDITRSCTR30361', fieldSourceDefinitionTypeId);
            }
        }

        return result;
    }

    protected override getCount() { return this._listDirectory.count; }
    protected override subscribeList(opener: LockOpenListItem.Opener) {
        return this._listDirectory;
    }

    protected override unsubscribeList(opener: LockOpenListItem.Opener) {
        // nothing to do
    }

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return RankedDataIvemIdListDirectoryItemTableRecordSourceDefinition.defaultFieldSourceDefinitionTypeIds;
    }
}
