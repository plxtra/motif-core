import { RevSourcedFieldCustomHeadings } from '@xilytix/revgrid';
import { Integer, LockOpenListItem, UnreachableCaseError } from '@xilytix/sysutils';
import { AdiService, BrokerageAccount, BrokerageAccountsDataDefinition, BrokerageAccountsDataItem } from '../../../adi/internal-api';
import { TextFormatter } from '../../../services/internal-api';
import { CorrectnessBadness, KeyedCorrectnessList } from '../../../sys/internal-api';
import {
    TableFieldSourceDefinition, TableFieldSourceDefinitionCachingFactory
} from "../field-source/internal-api";
import {
    BrokerageAccountTableRecordDefinition
} from "../record-definition/internal-api";
import { TableRecord } from '../record/internal-api';
import { BrokerageAccountTableValueSource, FeedTableValueSource } from '../value-source/internal-api';
import { BrokerageAccountTableRecordSourceDefinition } from './definition/brokerage-account-table-record-source-definition';
import { SingleDataItemRecordTableRecordSource } from './single-data-item-record-table-record-source';

/** @public */
export class BrokerageAccountTableRecordSource
    extends SingleDataItemRecordTableRecordSource<BrokerageAccount, KeyedCorrectnessList<BrokerageAccount>> {

    constructor(
        private readonly _adiService: AdiService,
        textFormatter: TextFormatter,
        customHeadings: RevSourcedFieldCustomHeadings | undefined,
        tableFieldSourceDefinitionCachingFactory: TableFieldSourceDefinitionCachingFactory,
        correctnessBadness: CorrectnessBadness,
        definition: BrokerageAccountTableRecordSourceDefinition,
    ) {
        super(
            textFormatter,
            customHeadings,
            tableFieldSourceDefinitionCachingFactory,
            correctnessBadness,
            definition,
            BrokerageAccountTableRecordSourceDefinition.allowedFieldSourceDefinitionTypeIds,
        );
    }

    override createDefinition(): BrokerageAccountTableRecordSourceDefinition {
        return new BrokerageAccountTableRecordSourceDefinition(
            this.customHeadings,
            this.tableFieldSourceDefinitionCachingFactory,
        );
    }

    override createRecordDefinition(idx: Integer): BrokerageAccountTableRecordDefinition {
        const record = this.recordList.records[idx];
        return {
            typeId: TableFieldSourceDefinition.TypeId.BrokerageAccount,
            mapKey: record.mapKey,
            record,
        };
    }

    override createTableRecord(recordIndex: Integer, eventHandlers: TableRecord.EventHandlers): TableRecord {
        const result = new TableRecord(recordIndex, eventHandlers);
        const brokerageAccount = this.recordList.records[recordIndex];

        const fieldSources = this.activeFieldSources;
        const sourceCount = fieldSources.length;
        for (let i = 0; i < sourceCount; i++) {
            const fieldSource = fieldSources[i];
            const fieldSourceDefinition = fieldSource.definition;
            const fieldSourceDefinitionTypeId =
                fieldSourceDefinition.typeId as BrokerageAccountTableRecordSourceDefinition.FieldSourceDefinitionTypeId;
            switch (fieldSourceDefinitionTypeId) {
                case TableFieldSourceDefinition.TypeId.BrokerageAccount: {
                    const valueSource = new BrokerageAccountTableValueSource(result.fieldCount, brokerageAccount);
                    result.addSource(valueSource);
                    break;
                }
                case TableFieldSourceDefinition.TypeId.Feed: {
                    const valueSource = new FeedTableValueSource(result.fieldCount, brokerageAccount.tradingFeed);
                    result.addSource(valueSource);
                    break;
                }
                default:
                    throw new UnreachableCaseError('BATRSCTVL77752', fieldSourceDefinitionTypeId);
            }
        }

        return result;
    }

    protected override subscribeList(_opener: LockOpenListItem.Opener) {
        const definition = new BrokerageAccountsDataDefinition();
        const dataItem = this._adiService.subscribe(definition) as BrokerageAccountsDataItem;
        super.setSingleDataItem(dataItem);
        return dataItem;
    }

    protected override unsubscribeList(_opener: LockOpenListItem.Opener, list: KeyedCorrectnessList<BrokerageAccount>) {
        this._adiService.unsubscribe(this.singleDataItem);
    }

    protected override getDefaultFieldSourceDefinitionTypeIds() {
        return BrokerageAccountTableRecordSourceDefinition.defaultFieldSourceDefinitionTypeIds;
    }
}
