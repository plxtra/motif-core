import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { Integer, LockOpenListItem, UnreachableCaseError } from '@xilytix/sysutils';
import {
    AdiService,
    AllHoldingsDataDefinition,
    AllHoldingsDataItem,
    BrokerageAccountGroup,
    BrokerageAccountGroupRecordList,
    BrokerageAccountHoldingsDataDefinition,
    BrokerageAccountHoldingsDataItem,
    Holding,
    SingleBrokerageAccountGroup
} from "../../../adi/internal-api";
import { TextFormatter } from '../../../services/internal-api';
import { CorrectnessBadness } from '../../../sys/internal-api';
import {
    TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory
} from '../field-source/definition/internal-api';
import { HoldingTableRecordDefinition } from '../record-definition/internal-api';
import { TableRecord } from '../record/internal-api';
import { BrokerageAccountTableValueSource, HoldingTableValueSource, SecurityDataItemTableValueSource } from '../value-source/internal-api';
import {
    BrokerageAccountGroupTableRecordSource
} from './brokerage-account-group-table-record-source';
import { HoldingTableRecordSourceDefinition } from './definition/internal-api';

/** @public */
export class HoldingTableRecordSource
    extends BrokerageAccountGroupTableRecordSource<Holding, BrokerageAccountGroupRecordList<Holding>> {

    constructor(
        private readonly _adiService: AdiService,
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: HoldingTableRecordSourceDefinition,
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
            HoldingTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );
    }

    override createDefinition(): HoldingTableRecordSourceDefinition {
        return new HoldingTableRecordSourceDefinition(
            this.customHeadings,
            this.tableFieldSourceDefinitionCachingFactory,
            this.brokerageAccountGroup,
        );
    }

    override createRecordDefinition(idx: Integer): HoldingTableRecordDefinition {
        const record = this.recordList.records[idx];

        return {
            typeId: TableFieldSourceDefinition.TypeId.Holding,
            mapKey:record.mapKey,
            record,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const holding = this.recordList.records[recordIndex];

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId =
                fieldSourceDefinition.typeId as HoldingTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            switch (fieldSourceDefinitionTypeId) {
                case TableFieldSourceDefinition.TypeId.Holding: {
                    const valueSource = new HoldingTableValueSource(result.fieldCount, holding);
                    result.addSource(valueSource);
                    break;
                }
                case TableFieldSourceDefinition.TypeId.BrokerageAccount: {
                    const valueSource = new BrokerageAccountTableValueSource(result.fieldCount, holding.account);
                    result.addSource(valueSource);
                    break;
                }
                case TableFieldSourceDefinition.TypeId.SecurityDataItem: {
                    const valueSource = new SecurityDataItemTableValueSource(result.fieldCount, holding.defaultDataIvemId, this._adiService);
                    result.addSource(valueSource);
                    break;
                }
                default:
                    throw new UnreachableCaseError('HTRSCTVL77753', fieldSourceDefinitionTypeId);
            }
        }

        return result;
    }

    protected override subscribeList(_opener: LockOpenListItem.Opener): BrokerageAccountGroupRecordList<Holding> {
        switch (this.brokerageAccountGroup.typeId) {
            case BrokerageAccountGroup.TypeId.Single: {
                const brokerageAccountGroup = this.brokerageAccountGroup as SingleBrokerageAccountGroup;
                const definition = new BrokerageAccountHoldingsDataDefinition(brokerageAccountGroup.accountZenithCode);
                const dataItem = this._adiService.subscribe(definition) as BrokerageAccountHoldingsDataItem;
                this.setSingleDataItem(dataItem);
                return dataItem;
            }

            case BrokerageAccountGroup.TypeId.All: {
                const definition = new AllHoldingsDataDefinition();
                const dataItem = this._adiService.subscribe(definition) as AllHoldingsDataItem;
                this.setSingleDataItem(dataItem);
                return dataItem;
            }

            default:
                throw new UnreachableCaseError('HTRDLSDI1999834346', this.brokerageAccountGroup.typeId);
        }
    }

    protected override unsubscribeList(_opener: LockOpenListItem.Opener, list: BrokerageAccountGroupRecordList<Holding>) {
        this._adiService.unsubscribe(this.singleDataItem);
    }

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return HoldingTableRecordSourceDefinition.defaultFieldSourceDefinitionTypeIds;
    }
}
